// 추가 공항의 현지시간 계산용 시간대와 거리 계산용 위도·경도입니다.
export const worldScheduleData = {
  FCO: ["Europe/Rome", 41.8, 12.25, "AZ"],
  MXP: ["Europe/Rome", 45.63, 8.72, "AZ"],
  MAD: ["Europe/Madrid", 40.47, -3.56, "IB"],
  BCN: ["Europe/Madrid", 41.3, 2.08, "VY"],
  ZRH: ["Europe/Zurich", 47.46, 8.55, "LX"],
  VIE: ["Europe/Vienna", 48.11, 16.57, "OS"],
  MUC: ["Europe/Berlin", 48.35, 11.79, "LH"],
  PRG: ["Europe/Prague", 50.1, 14.26, "QS"],
  WAW: ["Europe/Warsaw", 52.17, 20.97, "LO"],
  HEL: ["Europe/Helsinki", 60.32, 24.96, "AY"],
  LIS: ["Europe/Lisbon", 38.77, -9.13, "TP"],
  ATH: ["Europe/Athens", 37.94, 23.94, "A3"],
  GRU: ["America/Sao_Paulo", -23.44, -46.47, "LA"],
  GIG: ["America/Sao_Paulo", -22.81, -43.25, "G3"],
  EZE: ["America/Argentina/Buenos_Aires", -34.82, -58.54, "AR"],
  SCL: ["America/Santiago", -33.39, -70.79, "LA"],
  LIM: ["America/Lima", -12.02, -77.11, "LA"],
  BOG: ["America/Bogota", 4.7, -74.15, "AV"],
  JNB: ["Africa/Johannesburg", -26.14, 28.25, "SA"],
  CPT: ["Africa/Johannesburg", -33.97, 18.6, "FA"],
  CAI: ["Africa/Cairo", 30.12, 31.41, "MS"],
  ADD: ["Africa/Addis_Ababa", 8.98, 38.8, "ET"],
  NBO: ["Africa/Nairobi", -1.32, 36.93, "KQ"],
  CMN: ["Africa/Casablanca", 33.37, -7.59, "AT"],
};

export const worldAirlines = [
  ["AZ", "ITA 항공"],
  ["IB", "이베리아항공"],
  ["VY", "부엘링항공"],
  ["LX", "스위스 국제항공"],
  ["OS", "오스트리아항공"],
  ["QS", "스마트윙스"],
  ["LO", "LOT 폴란드항공"],
  ["AY", "핀에어"],
  ["TP", "TAP 포르투갈항공"],
  ["A3", "에게항공"],
  ["LA", "LATAM 항공"],
  ["G3", "골항공"],
  ["AR", "아르헨티나항공"],
  ["AV", "아비앙카항공"],
  ["SA", "남아프리카항공"],
  ["FA", "플라이사페어"],
  ["MS", "이집트항공"],
  ["KQ", "케냐항공"],
  ["AT", "로열 에어 모로코"],
].map(([code, name]) => ({ code, name, color: "#2455a4" }));

// 추가 노선에 배치할 항공사입니다. 편명·시간대는 화면용 생성값입니다.
export function getWorldRouteCarrier(departure, arrival) {
  const codes = [departure, arrival];
  const hubs = {
    FRA: "LH",
    MUC: "LH",
    CDG: "AF",
    AMS: "KL",
    LHR: "BA",
    ADD: "ET",
    MAD: "IB",
    LIS: "TP",
  };
  if (codes.includes("ICN")) {
    const other = codes.find((code) => code !== "ICN");
    return (
      { ZRH: "LX", WAW: "LO", HEL: "AY", ADD: "ET", MUC: "LH" }[other] ?? "KE"
    );
  }
  for (const [hub, carrier] of Object.entries(hubs))
    if (codes.includes(hub)) return carrier;
  return worldScheduleData[departure]?.[3] ?? worldScheduleData[arrival]?.[3];
}
