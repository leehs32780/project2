// 일반석 1인 편도 총액(KRW)의 기준값입니다. 실시간 견적이 아닌 운임 모델입니다.
// 항공사 공개 운임을 참고해 지역별 가격대를 정하고 거리별로 연속 보간합니다.
const regions = {
  europe: "FCO MXP MAD BCN ZRH VIE MUC PRG WAW HEL LIS ATH CDG LHR FRA AMS",
  southAmerica: "GRU GIG EZE SCL LIM BOG",
  africa: "JNB CPT CAI ADD NBO CMN",
  northAmerica: "JFK LAX SFO",
  oceania: "SYD AKL",
  middleEast: "DXB",
};
const regionByCode = Object.fromEntries(
  Object.entries(regions).flatMap(([region, codes]) =>
    codes.split(" ").map((code) => [code, region]),
  ),
);
const regionalFares = {
  europe: [65000, 72],
  southAmerica: [95000, 65],
  africa: [125000, 95],
  northAmerica: [85000, 60],
  oceania: [100000, 70],
  middleEast: [100000, 80],
  asia: [65000, 57],
};
// 대표 노선의 일반석 편도 기준값. 왕복 특가를 그대로 편도 가격으로 쓰지 않습니다.
const routeBaseFares = {
  "CDG-ICN": 790000,
  "ICN-LHR": 850000,
  "ICN-JFK": 980000,
  "ICN-LAX": 750000,
  "ICN-NRT": 155000,
  "ICN-KIX": 130000,
  "BKK-ICN": 245000,
  "ICN-SYD": 690000,
  "FCO-FRA": 155000,
  "GRU-SCL": 260000,
  "CPT-JNB": 105000,
  "JFK-LHR": 580000,
};

export function getRouteBaseFare(departure, arrival, distanceKm) {
  const key = [departure.code, arrival.code].sort().join("-");
  if (routeBaseFares[key]) return routeBaseFares[key];
  const sameCountry = departure.country === arrival.country;
  if (sameCountry && departure.country === "대한민국")
    return 35000 + distanceKm * 65;
  const from = regionByCode[departure.code] ?? "asia";
  const to = regionByCode[arrival.code] ?? "asia";
  let fare;
  if (from === to) {
    const [fixed, perKm] = regionalFares[from];
    fare = fixed + distanceKm * perKm;
    if (sameCountry) fare *= 0.82;
  } else {
    const pair = [from, to].sort().join("-");
    const rates = {
      "europe-northAmerica": 58,
      "europe-southAmerica": 67,
      "africa-europe": 76,
      "asia-europe": 76,
      "asia-northAmerica": 74,
      "asia-oceania": 67,
      "africa-southAmerica": 105,
      "oceania-southAmerica": 105,
      "northAmerica-oceania": 80,
    };
    fare = 100000 + distanceKm * (rates[pair] ?? 78);
  }
  return Math.round(Math.max(40000, fare) / 1000) * 1000;
}
