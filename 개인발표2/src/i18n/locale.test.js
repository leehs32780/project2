import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney, toKrw, setLanguage, getLanguage, subscribeLanguage, formatDate, formatPaymentDiscount } from './locale.js';
import { t } from './translate.js';
import { allRouteAirports, airports, destinationAttractions } from '../data/appData.js';
import { calculatePayment, paymentPromotions } from '../data/paymentPromotions.js';

test('원화·달러 환산과 달러 예산 입력', () => {
  assert.equal(formatMoney(140000,'ko'), '140,000원');
  assert.equal(formatMoney(140000,'en'), '$100.00');
  assert.equal(formatMoney(0,'en'), '$0.00');
  assert.equal(toKrw(123.45,'en'), 172830);
  assert.equal(toKrw(140000,'ko'), 140000);
});
test('언어 상태 변경 알림과 날짜 표시', () => {
  let changes=0;
  const unsubscribe=subscribeLanguage(()=>changes++);
  setLanguage('en');
  assert.equal(getLanguage(),'en');
  assert.equal(formatDate('2026-09-08'),'Sep 8, 2026');
  setLanguage('ko'); unsubscribe();
  assert.equal(changes,2);
  assert.equal(t('공항별 주요 직항 노선'),'공항별 주요 직항 노선');
});
test('공항·국가·관광지와 할인 조건의 영어 표시', () => {
  for(const airport of [...allRouteAirports,...airports]) {
    for(const value of [airport.name,airport.city,airport.country,airport.area]) {
      if(value) assert.ok(!/[가-힣]/.test(t(value,'en')), value);
    }
  }
  for(const value of Object.values(destinationAttractions).flat()) assert.ok(!/[가-힣]/.test(t(value,'en')),value);
  for(const promo of Object.values(paymentPromotions)) {
    assert.ok(!/[가-힣]/.test(t(promo.label,'en')));
    assert.ok(!/[가-힣]/.test(t(promo.condition,'en')));
  }
  assert.equal(t('잔여 12석','en'),'12 seats left');
  assert.equal(t('2시간 30분','en'),'2h 30m');
});
test('언어 변경은 원화 할인 계산과 저장 금액을 바꾸지 않음', () => {
  const korean=calculatePayment(400000,'naver');
  setLanguage('en');
  assert.deepEqual(calculatePayment(400000,'naver'),korean);
  assert.equal(formatMoney(korean.discountAmount),'$21.43');
  const rounded = calculatePayment(209000,'kakao');
  assert.equal(formatMoney(rounded.originalAmount),'$149.29');
  assert.equal(formatPaymentDiscount(rounded),'$7.47');
  assert.equal(formatMoney(rounded.amount),'$141.82');
  setLanguage('ko');
});
