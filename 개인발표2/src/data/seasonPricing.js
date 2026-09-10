// 화면의 여행 기간 안내와 같은 기준이며 각 구간의 출발일을 사용합니다.
export function getSeasonPricing(date = "") {
  const monthDay = date.slice(5, 10);
  if (
    (monthDay >= "07-01" && monthDay <= "08-31") ||
    monthDay >= "12-20" ||
    (monthDay >= "01-01" && monthDay <= "01-10")
  ) {
    return { season: "peak", rate: 1.15 };
  }
  if (
    (monthDay >= "03-01" && monthDay <= "05-31") ||
    (monthDay >= "09-01" && monthDay <= "11-30")
  ) {
    return { season: "off-peak", rate: 0.85 };
  }
  return { season: "regular", rate: 1 };
}
