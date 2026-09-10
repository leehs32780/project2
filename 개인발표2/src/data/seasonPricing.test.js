import test from "node:test";
import assert from "node:assert/strict";
import { getSeasonPricing } from "./seasonPricing.js";
import { createFlightSchedules } from "./appData.js";

test("시즌 시작일과 종료일 및 연말 경계를 포함한다", () => {
  const groups = {
    peak: ["01-01", "01-10", "07-01", "08-31", "12-20", "12-31"],
    "off-peak": ["03-01", "05-31", "09-01", "11-30"],
    regular: ["01-11", "02-28", "06-01", "06-30", "12-01", "12-19"],
  };
  for (const [season, dates] of Object.entries(groups)) {
    for (const date of dates) assert.equal(getSeasonPricing(`2027-${date}`).season, season, date);
  }
  assert.equal(getSeasonPricing("2028-02-29").rate, 1);
});

test("모든 좌석 등급에서 기본 가격을 유지하며 시즌 배율을 한 번 적용한다", () => {
  for (const cabin of ["economy", "business", "first"]) {
    for (const [departDate, rate] of [["2027-07-10", 1.15], ["2027-04-10", 0.85], ["2027-06-10", 1]]) {
      const flights = createFlightSchedules({ departure: "ICN", arrival: "DXB", cabin, departDate });
      assert.ok(flights.length > 0);
      for (const flight of flights) assert.equal(flight.price, Math.round(flight.basePrice * rate));
    }
  }
});

test("서로 다른 시즌의 왕복도 모든 시간대의 최종 가격이 겹치지 않는다", () => {
  for (const departDate of ["2027-04-10", "2027-06-10", "2027-07-10"]) {
    for (const returnDate of ["2027-09-10", "2027-12-10", "2027-12-24"]) {
      for (const cabin of ["economy", "business", "first"]) {
        const outbound = createFlightSchedules({ departure: "ICN", arrival: "DXB", cabin, departDate, tripType: "round-trip" });
        const inbound = createFlightSchedules({ departure: "DXB", arrival: "ICN", cabin, departDate: returnDate, fareTripType: "round-trip", excludedPrices: outbound.map(({ price }) => price) });
        const prices = [...outbound, ...inbound].map(({ price }) => price);
        assert.equal(new Set(prices).size, prices.length);
        assert.ok(inbound.every(({ seasonRate }) => seasonRate === getSeasonPricing(returnDate).rate));
      }
    }
  }
});
