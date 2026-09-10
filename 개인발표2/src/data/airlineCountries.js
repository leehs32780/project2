// 항공사 코드의 운항사 소재 국가·지역 기준 (그룹 주주나 노선 목적지 기준이 아님).
// 참고: https://www.iata.org/en/about/members/airline-list/
export const airlineCountries = Object.fromEntries([
  ["KR", "KE OZ YP 7C LJ TW BX ZE RS RF"],
  ["JP", "JL NH MM ZG"], ["CN", "CA MU"], ["HK", "CX"],
  ["TW", "CI BR IT"], ["SG", "SQ TR"], ["TH", "TG"],
  ["VN", "VN VJ"], ["PH", "PR 5J"], ["MY", "MH AK"],
  ["AE", "EK"], ["US", "UA DL"], ["FR", "AF"],
  ["GB", "BA"], ["DE", "LH"], ["NL", "KL"],
  ["AU", "QF"], ["NZ", "NZ"], ["IT", "AZ"],
  ["ES", "IB VY"], ["CH", "LX"], ["AT", "OS"],
  ["CZ", "QS"], ["PL", "LO"], ["FI", "AY"],
  ["PT", "TP"], ["GR", "A3"], ["CL", "LA"],
  ["BR", "G3"], ["AR", "AR"], ["CO", "AV"],
  ["ZA", "SA FA"], ["EG", "MS"], ["KE", "KQ"],
  ["MA", "AT"], ["ET", "ET"],
].flatMap(([country, codes]) => codes.split(" ").map(code => [code, country])));

const regions = {
  ko: new Intl.DisplayNames(["ko"], { type: "region" }),
  en: new Intl.DisplayNames(["en"], { type: "region" }),
};
export function getAirlineCountry(code, language = "ko") {
  const region = airlineCountries[code];
  if (!region) return "";
  if (language !== "en" && region === "KR") return "대한민국";
  if (language !== "en" && region === "HK") return "홍콩";
  return regions[language === "en" ? "en" : "ko"].of(region);
}
