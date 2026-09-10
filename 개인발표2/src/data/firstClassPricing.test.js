import test from "node:test";
import assert from "node:assert/strict";
import { createFlightSchedules } from "./appData.js";
import { firstClassRoutes } from "./cabinData.js";
import { getFirstClassReferenceFare, firstFareFx } from "./firstClassPricing.js";

test("공개 평균의 통화·왕복 기준을 보존하고 원화 구간 참고가로 환산한다", () => {
  const fare = getFirstClassReferenceFare("ICN", "JFK", 11000);
  assert.equal(fare.amount, 24304);
  assert.equal(fare.currency, "USD");
  assert.equal(fare.price, Math.round(24304 / 2 * firstFareFx.USD / 1000) * 1000);
  assert.equal(fare.kind, "market-average-reference");
  assert.ok(fare.source.startsWith("https://"));
});

test("인천 두바이 공시 편도와 왕복 운임을 구분하고 왕복 합계를 보존한다", () => {
  const search = { departure: "ICN", arrival: "DXB", departDate: "2026-10-10", cabin: "first" };
  assert.equal(createFlightSchedules({ ...search, tripType: "one-way" })[0].firstFareReference.price, 6021000);
  const outbound = createFlightSchedules({ ...search, tripType: "round-trip" })[0];
  const inbound = createFlightSchedules({ ...search, departure: "DXB", arrival: "ICN", tripType: "one-way", fareTripType: "round-trip" })[0];
  assert.ok(Math.abs(outbound.firstFareReference.price + inbound.firstFareReference.price - 8726800) <= 1000);
  assert.match(outbound.firstFareReference.period, /세금 별도/);
});

test("모든 등록 퍼스트 노선은 API 없이 검색되고 출처가 있는 참고가를 갖는다", () => {
  for (const { route } of firstClassRoutes) {
    const [departure, arrival] = route.split("-");
    for (const [from, to] of [[departure, arrival], [arrival, departure]]) {
      const flights = createFlightSchedules({ departure: from, arrival: to, departDate: "2026-10-10", cabin: "first" });
      assert.ok(flights.length, route);
      for (const flight of flights) {
        assert.ok(Number.isFinite(flight.price) && flight.price > 0, route);
        assert.equal(flight.priceSource, "reference-estimate");
        assert.equal(flight.seats, null);
        assert.ok(flight.firstFareReference.source);
      }
      assert.equal(new Set(flights.map((flight) => flight.price)).size, flights.length);
    }
  }
});

test("유사 노선 참고 운임은 유지하고 출발일의 시즌 요금을 적용한다", () => {
  const fare = getFirstClassReferenceFare("SIN", "SYD", 6300);
  assert.equal(fare.kind, "comparable-route-estimate");
  assert.match(fare.method, /거리 보정/);
  const search = { departure: "ICN", arrival: "JFK", cabin: "first" };
  const offPeak = createFlightSchedules({ ...search, departDate: "2026-10-10" })[0];
  const peak = createFlightSchedules({ ...search, departDate: "2026-12-24" })[0];
  assert.equal(offPeak.basePrice, peak.basePrice);
  assert.ok(offPeak.price < peak.price);
});
