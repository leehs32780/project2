import test from "node:test";
import assert from "node:assert/strict";
import { calculatePayment } from "./paymentPromotions.js";

test("수단별 할인율, 정액 할인, 한도", () => {
  for (const [method, price, discount] of [
    ["kakao", 400000, 20000],
    ["kakao", 2000000, 50000],
    ["naver", 299999, 0],
    ["naver", 300000, 30000],
    ["toss", 400000, 12000],
    ["toss", 3000000, 70000],
    ["payco", 149999, 0],
    ["payco", 150000, 20000],
    ["card:123", 99999, 0],
    ["card:123", 100000, 10000],
  ]) {
    const result = calculatePayment(price, method);
    assert.equal(result.discountAmount, discount);
    assert.equal(result.amount, price - discount);
  }
});
test("원 미만 버림, 미등록 수단, 잘못된 금액 처리", () => {
  assert.equal(calculatePayment(10019, "kakao").discountAmount, 500);
  assert.equal(calculatePayment(200000, "unknown").amount, 200000);
  for (const amount of [0, -1, NaN, Infinity])
    assert.equal(calculatePayment(amount, "kakao").amount, 0);
  assert.equal(calculatePayment(200000, "naver").remainingAmount, 100000);
});
