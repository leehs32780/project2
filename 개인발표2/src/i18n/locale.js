// 예약·운임은 원화로 보관하고 표시할 때만 환산합니다. 실제 시세가 아닌 테스트용 고정 환율입니다.
export const KRW_PER_USD = 1400;
let language = 'ko';
try { if (globalThis.localStorage?.getItem('skyfinder-language') === 'en') language = 'en'; } catch {}
const listeners = new Set();
export const getLanguage = () => language;
export const subscribeLanguage = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export function setLanguage(value) {
  language = value === 'en' ? 'en' : 'ko';
  try { globalThis.localStorage?.setItem('skyfinder-language', language); } catch {}
  if (globalThis.document) document.documentElement.lang = language;
  listeners.forEach(listener => listener());
}
export function formatMoney(krw, locale = language) {
  const value = Number.isFinite(krw) ? krw : 0;
  return locale === 'en'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / KRW_PER_USD)
    : `${Math.round(value).toLocaleString('ko-KR')}원`;
}
export const toKrw = (value, locale = language) => Math.round(value * (locale === 'en' ? KRW_PER_USD : 1));

// 달러 반올림 때문에 요약의 원가 - 할인액 = 최종액이 1센트 어긋나지 않도록 맞춥니다.
export function formatPaymentDiscount(payment) {
  if (language !== 'en') return formatMoney(payment.discountAmount);
  const originalCents = Math.round(payment.originalAmount * 100 / KRW_PER_USD);
  const finalCents = Math.round(payment.amount * 100 / KRW_PER_USD);
  return new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format((originalCents-finalCents)/100);
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(language === 'en' ? 'en-US' : 'ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}
