// 테스트 결제용 혜택입니다. 실제 결제사 행사와 무관하며 결제 한 건에 한 가지만 적용합니다.
export const paymentPromotions = {
  kakao: { label: "5% 즉시 할인", condition: "최소 금액 없음 · 최대 5만 원", rate: 0.05, cap: 50000, minimum: 0 },
  naver: { label: "3만 원 즉시 할인", condition: "30만 원 이상 결제 시", amount: 30000, minimum: 300000 },
  toss: { label: "3% 즉시 할인", condition: "최소 금액 없음 · 최대 7만 원", rate: 0.03, cap: 70000, minimum: 0 },
  payco: { label: "2만 원 즉시 할인", condition: "15만 원 이상 결제 시", amount: 20000, minimum: 150000 },
  card: { label: "1만 원 즉시 할인", condition: "10만 원 이상 결제 시", amount: 10000, minimum: 100000 },
};

export function getPaymentPromotion(method) {
  return paymentPromotions[method?.startsWith("card:") ? "card" : method] ?? null;
}

// 표시 금액과 예약 저장 금액에 같은 계산을 사용합니다. 비율 할인은 원 미만을 버립니다.
export function calculatePayment(originalAmount, method) {
  const amount = Number.isFinite(originalAmount) ? Math.max(0, Math.floor(originalAmount)) : 0;
  const promotion = getPaymentPromotion(method);
  const eligible = Boolean(promotion && amount >= promotion.minimum);
  const discountAmount = eligible
    ? Math.min(amount, promotion.amount ?? Math.min(Math.floor(amount * promotion.rate), promotion.cap))
    : 0;
  return { originalAmount: amount, discountAmount, amount: amount - discountAmount,
    promotionLabel: discountAmount > 0 ? promotion.label : null,
    remainingAmount: promotion ? Math.max(0, promotion.minimum - amount) : 0 };
}
