import test from "node:test";
import assert from "node:assert/strict";
import { airlines, createFlightSchedules } from "./appData.js";
import {
  getAirlinePromotion,
  getPromotionForDate,
  applyAirlinePromotion,
  getNextAirlinePromotion,
} from "./airlinePromotions.js";

test("전체 항공사의 특가 시작·종료일과 윤년·연말 경계", () => {
  for (const airline of airlines) {
    for (let month = 0; month < 12; month += 1) {
      const promotion = getAirlinePromotion(airline.code, 2028, month);
      if (!promotion) {
        assert.equal(
          getPromotionForDate(
            airline.code,
            `2028-${String(month + 1).padStart(2, "0")}-18`,
          ),
          null,
        );
        continue;
      }
      assert.deepEqual(
        getPromotionForDate(airline.code, promotion.start),
        promotion,
      );
      assert.deepEqual(
        getPromotionForDate(airline.code, promotion.end),
        promotion,
      );
      const before = new Date(`${promotion.start}T00:00:00Z`);
      before.setUTCDate(before.getUTCDate() - 1);
      assert.equal(
        getPromotionForDate(airline.code, before.toISOString().slice(0, 10)),
        null,
      );
      const after = new Date(`${promotion.end}T00:00:00Z`);
      after.setUTCDate(after.getUTCDate() + 1);
      assert.equal(
        getPromotionForDate(airline.code, after.toISOString().slice(0, 10)),
        null,
      );
      assert.ok(
        applyAirlinePromotion(100000, airline.code, promotion.start).price <
          100000,
      );
    }
  }
  assert.equal(getPromotionForDate("KE", "2027-02-29"), null);
  assert.equal(getPromotionForDate("KE", "invalid"), null);
});

test("성수기·비수기·일반 시즌의 모든 좌석 등급에 특가를 한 번 적용", () => {
  const discountedSeasons = new Set();
  for (const month of [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ]) {
    for (const cabin of ["economy", "business", "first"]) {
      for (const day of ["12", "18", "23"]) {
        const flights = createFlightSchedules({
          departure: "ICN",
          arrival: "DXB",
          departDate: `2027-${month}-${day}`,
          cabin,
        });
        assert.ok(flights.length);
        for (const flight of flights) {
          if (flight.promotion) discountedSeasons.add(flight.season);
          assert.equal(
            flight.originalPrice,
            Math.round(flight.basePrice * flight.seasonRate),
          );
          assert.equal(
            flight.price,
            Math.round(
              flight.originalPrice *
                (1 - (flight.promotion?.discountRate ?? 0)),
            ),
          );
        }
      }
    }
  }
  assert.deepEqual([...discountedSeasons].sort(), [
    "off-peak",
    "peak",
    "regular",
  ]);
});

test("2026년 9월 이전은 특가가 없고, 항공사별 연 3~4회만 진행한다", () => {
  const patterns = new Set();
  for (const airline of airlines) {
    for (let month = 0; month < 8; month += 1)
      assert.equal(getAirlinePromotion(airline.code, 2026, month), null);
    assert.equal(getAirlinePromotion(airline.code, 2025, 11), null);
    const months = [];
    for (let month = 0; month < 12; month += 1) {
      const sale = getAirlinePromotion(airline.code, 2027, month);
      if (sale) {
        months.push(month);
        const duration =
          (Date.parse(sale.end) - Date.parse(sale.start)) / 86400000 + 1;
        assert.ok(duration >= 4 && duration <= 8);
      }
    }
    assert.ok(months.length === 3 || months.length === 4);
    for (let i = 0; i < months.length; i += 1) {
      const next = i + 1 < months.length ? months[i + 1] : months[0] + 12;
      assert.ok(next - months[i] >= 3);
    }
    patterns.add(months.join(","));
    assert.ok(
      getNextAirlinePromotion(airline.code, 2026, 0).start >= "2026-09-01",
    );
    assert.ok(
      getNextAirlinePromotion(airline.code, 2027, 11).start.startsWith("2028-"),
    );
  }
  assert.ok(patterns.size >= 4);
});
