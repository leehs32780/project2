import { cabinLabels } from "../data/cabinData.js";
const airlineColors = ["#1976c9", "#c52b36", "#f26b21", "#5a9f38", "#6d38a8"];

// API가 제공한 ISO 8601 예정 운항시간입니다. 현지 출도착 시각을 빼서 추정하지 않습니다.
export function formatDuration(value = "") {
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(value);
  if (!match || !match.slice(1).some(Boolean)) return "소요시간 미제공";
  const minutes = Number(match[1] ?? 0) * 1440 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  return `${Math.floor(minutes / 60)}시간${minutes % 60 ? ` ${minutes % 60}분` : ""}`;
}

export function getFlightSourceLabel(flight) {
  if (flight.priceSource === "custom") return "직접 설정 가격";
  if (flight.priceSource === "reference-estimate") return "참고 운임 기반 시간대별 예상가";
  if (flight.priceSource === "published-reference") return "공개 운임 기반 참고가";
  if (flight.priceSource === "live") return "실시간 조회";
  if (flight.priceSource === "api-test") return "API 테스트 데이터";
  return "예상 데이터";
}

// API 시각은 각 공항의 현지시각입니다. 브라우저 시간대로 재변환하지 않습니다.
export function mapFlightOffers(payload, tripType) {
  if (!Array.isArray(payload.offers)) throw new Error("항공편 응답 형식이 올바르지 않습니다.");
  const seen = new Set();
  return payload.offers.map((offer, index) => {
    const segment = offer.segment;
    const departureAt = segment.departure.at;
    const arrivalAt = segment.arrival.at;
    const carrierCode = segment.operating?.carrierCode ?? segment.carrierCode;
    return {
      id: `amadeus-${offer.id}-${index}`,
      cabin: offer.cabin ?? "economy",
      cabinLabel: cabinLabels[offer.cabin ?? "economy"],
      currency: offer.currency,
      operatingFlightNumber: segment.operating?.number ?? segment.number,
      airline: { code: carrierCode, name: offer.carrierName ?? carrierCode, color: airlineColors[index % airlineColors.length] },
      marketingCarrierName: offer.marketingCarrierName ?? segment.carrierCode,
      flightNumber: `${segment.carrierCode}${segment.number}`,
      departure: segment.departure.iataCode,
      arrival: segment.arrival.iataCode,
      departureAt,
      arrivalAt,
      departureTime: departureAt.slice(11, 16),
      arrivalTime: arrivalAt.slice(11, 16),
      arrivalDayOffset: Math.round((Date.parse(`${arrivalAt.slice(0, 10)}T00:00:00Z`) - Date.parse(`${departureAt.slice(0, 10)}T00:00:00Z`)) / 86400000),
      duration: formatDuration(segment.duration ?? offer.duration),
      seats: offer.seats ?? null,
      price: Math.round(Number(offer.price)),
      tripType,
      priceSource: payload.environment === "production" ? "live" : "api-test",
      fetchedAt: payload.fetchedAt,
    };
  }).filter((flight) => Number.isFinite(flight.price) && flight.price > 0)
    .sort((a, b) => a.price - b.price)
    .filter((flight) => {
      // 동일 편명의 같은 출발편에 여러 운임이 있으면 최저가 한 건만 표시합니다.
      const key = `${flight.airline.code}-${flight.operatingFlightNumber}-${flight.departure}-${flight.arrival}-${flight.departureAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

// 외항사를 하드코딩하거나 8개로 자르지 않고 API가 반환한 항공편을 표시합니다.
export async function fetchDirectFlights({ departure, arrival, departDate, tripType, cabin = "economy" }) {
  const query = new URLSearchParams({ departure, arrival, departDate, cabin });
  const response = await fetch(`/api/flight-offers?${query}`, { signal: AbortSignal.timeout(40000) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? "항공편 API 조회에 실패했습니다.");
  if (cabin === "first") {
    if (payload.environment !== "production") throw new Error("실제 퍼스트 운임을 조회할 수 없습니다. 운영 API 연결을 확인해 주세요.");
    payload.offers = (payload.offers ?? []).filter((offer) => offer.cabin === "first" && offer.currency === "KRW");
  }
  return mapFlightOffers(payload, tripType);
}

// 선택 날짜에 조회된 운항편별 최저 운임의 산술평균입니다. 전체 시장 평균이 아닙니다.
export function getFirstFareSummary(flights) {
  const fares = flights.filter((flight) => flight.cabin === "first" && flight.priceSource === "live" && flight.currency === "KRW" && Number.isFinite(flight.price) && flight.price > 0);
  if (!fares.length) return null;
  return { count: fares.length, average: Math.round(fares.reduce((sum, flight) => sum + flight.price, 0) / fares.length) };
}
