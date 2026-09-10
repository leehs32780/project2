// 공식 항공사 자료로 확인한 퍼스트 제공 노선만 등록합니다. 출처는 CABINS.md 참고.
// 노선 단위 제공 여부이며 날짜별 투입 기종·판매 잔여석을 보장하지 않습니다.
export const cabinLabels = {
  economy: "일반석",
  business: "비즈니스석",
  first: "퍼스트 클래스",
};
const firstNetworks = [
  ["KE", "ICN", "JFK LAX CDG LHR FRA"],
  ["AF", "CDG", "JFK LAX SFO GRU DXB SIN HND"],
  ["LH", "FRA", "JFK LAX SFO GRU EZE JNB HND"],
  ["LH", "MUC", "JFK LAX SFO HND PVG"],
  ["SQ", "SIN", "LHR FRA SYD"],
  ["EK", "DXB", "ICN BKK HKG MAD KUL FRA"],
];
export const firstClassRoutes = firstNetworks.flatMap(
  ([carrier, hub, destinations]) =>
    destinations
      .split(" ")
      .map((destination) => ({
        carrier,
        route: [hub, destination].sort().join("-"),
      })),
);
firstClassRoutes.push({
  carrier: "SQ",
  route: "AMS-SIN",
  availableFrom: "2026-07-01",
});
export function getFirstClassCarriers(departure, arrival, date = "") {
  const route = [departure, arrival].sort().join("-");
  const month = Number(date.slice(5, 7));
  return firstClassRoutes
    .filter((entry) => {
      if (entry.route !== route) return false;
      if (entry.availableFrom && (!date || date < entry.availableFrom))
        return false;
      if (
        entry.carrier === "LH" &&
        route === "LAX-MUC" &&
        [1, 2].includes(month)
      )
        return false;
      if (entry.carrier === "LH" && route === "MUC-SFO" && month === 2)
        return false;
      return true;
    })
    .map(({ carrier }) => carrier);
}

// 일반석 전용 항공사의 넓은 좌석/우선 탑승 상품을 비즈니스석으로 취급하지 않습니다.
const economyOnlyCarriers = new Set([
  "YP",
  "7C",
  "LJ",
  "TW",
  "BX",
  "ZE",
  "RS",
  "RF",
  "MM",
  "TR",
  "AK",
  "5J",
  "VY",
  "FA",
  "G3",
  "VJ",
  "QS",
]);
export function hasBusinessCabin(carrier) {
  return !economyOnlyCarriers.has(carrier);
}

// 일반석 기준 운임에 적용하는 등급 배율. 장거리는 침대형 좌석의 가격 차이를 반영합니다.
export function getCabinFareRate(cabin, minutes) {
  if (cabin === "first")
    throw new Error("퍼스트 운임은 실제 항공권 조회가 필요합니다.");
  if (cabin === "business") return minutes >= 360 ? 3.6 : 2.2;
  return 1;
}
