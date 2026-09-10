// 공개 자료를 저장한 참고 운임입니다. 날짜별 실제 판매가는 아닙니다.
export const firstFareCheckedAt = "2026-09-07";
export const firstFareFx = {
  USD: 1346.56492,
  GBP: 1346.56492 / 0.739722,
  EUR: 1346.56492 / 0.861072,
  KRW: 1,
  source: "https://open.er-api.com/v6/latest/USD",
};

export const firstFareSources = {
  koreaUs: {
    label: "미국 출발 한국행 퍼스트 왕복 평균",
    amount: 24304,
    currency: "USD",
    source:
      "https://www.kayak.com/flight-routes/First-Class-United-States-US0/South-Korea-KR0.fc.ksp",
    period: "원문 기준 최근 2주",
    distanceKm: 11000,
  },
  atlantic: {
    label: "뉴욕 출발 파리행 퍼스트 왕복 평균",
    amount: 25543,
    currency: "USD",
    source:
      "https://www.kayak.com/flight-routes/First-Class-New-York-NYC/Paris-PAR.fc.ksp",
    period: "원문 기준 최근 2주",
    distanceKm: 5840,
  },
  europeAsia: {
    label: "런던 출발 싱가포르행 퍼스트 왕복 평균",
    amount: 13207,
    currency: "GBP",
    source:
      "https://www.kayak.co.uk/flight-routes/First-Class-London-LON/Singapore-Changi-SIN.fc.ksp",
    period: "원문 기준 최근 2주",
    distanceKm: 10880,
  },
  germanyUs: {
    label: "독일 출발 로스앤젤레스행 퍼스트 왕복 평균",
    amount: 12864,
    currency: "EUR",
    source:
      "https://www.kayak.de/fl%C3%BCge/First-Class-Deutschland-DE0/Los-Angeles-LAX.fc.ksp",
    period: "원문 기준 최근 2주",
    distanceKm: 9330,
  },
  dubai: {
    label: "에미레이트 인천 출발 두바이행 퍼스트 공시 운임",
    amount: 8726800,
    oneWay: 6021000,
    currency: "KRW",
    source:
      "https://c.ekstatic.net/ecl/documents/footer-items/icn-dxb-fare-table-2025-english.pdf",
    period: "2025년 공시 운임표 · 평균 통계 아님 · 세금 별도",
    distanceKm: 6740,
  },
};

// 원문은 도시/국가 단위이며 경유편도 포함할 수 있습니다. 역방향도 참고 기준을 공유합니다.
// 동일 시장의 평균이 없으면 공개 퍼스트 운임을 거리 비율로 보정한 '유사 노선 참고가'를 사용합니다.
export function getFirstClassReferenceFare(
  departure,
  arrival,
  distanceKm,
  tripType = "one-way",
) {
  const codes = [departure, arrival];
  const has = (code) => codes.includes(code);
  let sourceId = "europeAsia";
  let comparableMarket = false;
  if (has("ICN") && has("DXB")) {
    sourceId = "dubai";
    comparableMarket = true;
  } else if (
    has("ICN") &&
    codes.some((code) => ["JFK", "LAX"].includes(code))
  ) {
    sourceId = "koreaUs";
    comparableMarket = true;
  } else if (has("CDG") && has("JFK")) {
    sourceId = "atlantic";
    comparableMarket = true;
  } else if (
    codes.some((code) => ["FRA", "MUC"].includes(code)) &&
    has("LAX")
  ) {
    sourceId = "germanyUs";
    comparableMarket = true;
  } else if (has("SIN") && has("LHR")) {
    sourceId = "europeAsia";
    comparableMarket = true;
  } else if (has("DXB")) sourceId = "dubai";
  else if (
    codes.some((code) => ["JFK", "LAX", "SFO", "GRU", "EZE"].includes(code))
  )
    sourceId = "germanyUs";
  const reference = firstFareSources[sourceId];
  const ratio = comparableMarket
    ? 1
    : Math.max(0.35, Math.min(1.4, distanceKm / reference.distanceKm));
  const usePublishedOneWay = sourceId === "dubai" && tripType !== "round-trip";
  const base = usePublishedOneWay ? reference.oneWay : reference.amount / 2;
  return {
    price:
      Math.round((base * firstFareFx[reference.currency] * ratio) / 1000) *
      1000,
    sourceId,
    ...reference,
    checkedAt: firstFareCheckedAt,
    kind:
      sourceId === "dubai" && comparableMarket
        ? "published-fare"
        : comparableMarket
          ? "market-average-reference"
          : "comparable-route-estimate",
    method: `${usePublishedOneWay ? "공시 편도 운임" : "왕복 평균의 1/2을 구간 참고가로 환산"}${ratio !== 1 ? ` × 거리 보정 ${ratio.toFixed(2)}` : ""}`,
    // 공시 왕복 운임은 통계 평균과 구분합니다.
    ...(sourceId === "dubai" && tripType === "round-trip"
      ? {
          method: `공시 왕복 운임의 1/2을 구간별 배분${ratio !== 1 ? ` × 거리 보정 ${ratio.toFixed(2)}` : ""}`,
        }
      : {}),
  };
}
