let cachedToken = null;
let tokenExpiresAt = 0;
let cachedTokenContext = null;

function getApiBaseUrl() {
  return process.env.AMADEUS_API_BASE_URL === "https://api.amadeus.com"
    ? "https://api.amadeus.com"
    : "https://test.api.amadeus.com";
}

async function getAccessToken() {
  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;
  const tokenContext = JSON.stringify([getApiBaseUrl(), clientId, clientSecret]);
  if (cachedToken && cachedTokenContext === tokenContext && Date.now() < tokenExpiresAt) return cachedToken;
  if (!clientId || !clientSecret) {
    const error = new Error("Amadeus API 키가 설정되지 않았습니다. .env.local을 확인해 주세요.");
    error.status = 503;
    throw error;
  }

  const response = await fetch(`${getApiBaseUrl()}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error_description ?? "Amadeus 인증에 실패했습니다.");

  cachedToken = payload.access_token;
  cachedTokenContext = tokenContext;
  tokenExpiresAt = Date.now() + (payload.expires_in - 60) * 1000;
  return cachedToken;
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

async function handleFlightOffers(request, response) {
  try {
    const requestUrl = new URL(request.url, "http://localhost");
    const departure = requestUrl.searchParams.get("departure")?.toUpperCase();
    const arrival = requestUrl.searchParams.get("arrival")?.toUpperCase();
    const departDate = requestUrl.searchParams.get("departDate");
    const cabin = requestUrl.searchParams.get("cabin") ?? "economy";
    const travelClass = { economy: "ECONOMY", business: "BUSINESS", first: "FIRST" }[cabin];
    if (!travelClass) return sendJson(response, 400, { message: "좌석 등급을 확인해 주세요." });
    if (cabin === "first" && getApiBaseUrl() !== "https://api.amadeus.com") {
      return sendJson(response, 503, { message: "실제 퍼스트 운임 조회를 위한 운영 API 연결이 필요합니다. 현재 실제 평균 가격을 확인할 수 없습니다." });
    }
    if (!/^[A-Z]{3}$/.test(departure) || !/^[A-Z]{3}$/.test(arrival) || !/^\d{4}-\d{2}-\d{2}$/.test(departDate)) {
      return sendJson(response, 400, { message: "공항 코드와 출발일을 확인해 주세요." });
    }

    const token = await getAccessToken();
    const query = new URLSearchParams({
      originLocationCode: departure,
      destinationLocationCode: arrival,
      departureDate: departDate,
      adults: "1",
      travelClass,
      nonStop: "true",
      currencyCode: "KRW",
      // 싼 항공편 10개만 받으면 한두 항공사에 결과가 몰릴 수 있으므로
      // 더 넓게 조회한 뒤 클라이언트에서 항공사별로 고르게 선택합니다.
      max: "250",
    });
    const apiResponse = await fetch(`${getApiBaseUrl()}/v2/shopping/flight-offers?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    });
    const payload = await apiResponse.json();
    if (!apiResponse.ok) {
      const detail = payload.errors?.[0]?.detail;
      return sendJson(response, apiResponse.status, { message: detail ?? "항공편 조회에 실패했습니다." });
    }

    const carriers = payload.dictionaries?.carriers ?? {};
    const offers = (payload.data ?? [])
      .filter((offer) => cabin !== "first" || (
        offer.price?.currency === "KRW" &&
        Number(offer.price.grandTotal ?? offer.price.total) > 0 &&
        offer.itineraries?.length === 1 &&
        offer.travelerPricings?.length === 1 &&
        offer.travelerPricings[0].travelerType === "ADULT" &&
        offer.travelerPricings[0].fareDetailsBySegment?.some((fare) =>
          fare.segmentId === offer.itineraries?.[0]?.segments?.[0]?.id && fare.cabin === "FIRST")
      ))
      .filter(({ itineraries }) => itineraries?.[0]?.segments?.length === 1 &&
        (itineraries[0].segments[0].numberOfStops ?? 0) === 0 &&
        itineraries[0].segments[0].departure.iataCode === departure &&
        itineraries[0].segments[0].arrival.iataCode === arrival)
      .map((offer) => ({
        id: offer.id,
        cabin,
        currency: offer.price.currency,
        price: offer.price.grandTotal ?? offer.price.total,
        seats: offer.numberOfBookableSeats,
        segment: offer.itineraries[0].segments[0],
        duration: offer.itineraries[0].duration,
        marketingCarrierName: carriers[offer.itineraries[0].segments[0].carrierCode],
        carrierName:
          carriers[offer.itineraries[0].segments[0].operating?.carrierCode] ??
          carriers[offer.itineraries[0].segments[0].carrierCode],
      }));
    return sendJson(response, 200, {
      offers,
      environment: getApiBaseUrl() === "https://api.amadeus.com" ? "production" : "test",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return sendJson(response, error.status ?? 502, { message: error.message });
  }
}

export function amadeusPlugin() {
  const attachMiddleware = (server) => {
    server.middlewares.use("/api/flight-offers", handleFlightOffers);
  };
  return {
    name: "amadeus-flight-offers",
    configureServer: attachMiddleware,
    configurePreviewServer: attachMiddleware,
  };
}
