// 프로젝트 시연용 일정이며 실제 항공사 행사와 무관합니다.
export const PROMOTION_CALENDAR_START = "2026-09-01";
export const PROMOTION_FIRST_MONTH = 2026 * 12 + 8;

// 항공사별 연 3~4회. 최소 두 달은 쉬고 다음 행사를 진행합니다.
const campaignMonths = [
  [0, 4, 8],
  [1, 5, 9],
  [2, 6, 10],
  [3, 7, 11],
  [0, 3, 6, 9],
  [1, 4, 7, 10],
  [2, 5, 8, 11],
];
export function getAirlinePromotion(code, year, month) {
  if (
    !code ||
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 0 ||
    month > 11 ||
    year * 12 + month < PROMOTION_FIRST_MONTH
  )
    return null;
  const seed = [...code].reduce((sum, ch) => sum * 31 + ch.charCodeAt(0), 0);
  if (!campaignMonths[seed % campaignMonths.length].includes(month))
    return null;
  const campaignSeed = seed + year * 7 + month * 13;
  const startDay = 12 + (campaignSeed % 10);
  const duration = 4 + (campaignSeed % 5);
  const stamp = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return {
    start: stamp(startDay),
    end: stamp(startDay + duration - 1),
    discountRate: (15 + (campaignSeed % 4) * 5) / 100,
    demo: true,
  };
}
export function getNextAirlinePromotion(code, year, month) {
  const first = Math.max(year * 12 + month + 1, PROMOTION_FIRST_MONTH);
  for (let offset = 0; offset < 12; offset += 1) {
    const absoluteMonth = first + offset;
    const promotion = getAirlinePromotion(
      code,
      Math.floor(absoluteMonth / 12),
      absoluteMonth % 12,
    );
    if (promotion) return promotion;
  }
  return null;
}
export function getPromotionForDate(code, date = "") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    return null;
  const promotion = getAirlinePromotion(
    code,
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
  );
  return promotion && date >= promotion.start && date <= promotion.end
    ? promotion
    : null;
}
export function applyAirlinePromotion(price, code, date) {
  const promotion = getPromotionForDate(code, date);
  return {
    originalPrice: price,
    price: promotion ? Math.round(price * (1 - promotion.discountRate)) : price,
    promotion,
  };
}
