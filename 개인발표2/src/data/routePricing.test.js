import test from "node:test";
import assert from "node:assert/strict";
import { allRouteAirports, getDirectDestinationCodes, getFlightDurationMinutes, createFlightSchedules } from "./appData.js";

test("전 노선 가격과 시간이 유효하고 대표 구간의 가격대가 구분된다", (t) => {
  t.mock.method(Date, "now", () => Date.parse("2026-09-07T00:00:00Z"));
  for (const { code: departure } of allRouteAirports) {
    for (const arrival of getDirectDestinationCodes(departure)) {
      const flights = createFlightSchedules({ departure, arrival, departDate: "2026-11-15" });
      for (const flight of flights) {
        assert.ok(Number.isFinite(flight.price) && flight.price > 0 && flight.price < 4000000, `${departure}-${arrival}: ${flight.price}`);
        assert.ok(flight.originalPrice >= 25000, `${departure}-${arrival}: original ${flight.originalPrice}`);
        assert.equal(flight.price, Math.round(flight.originalPrice * (1 - (flight.promotion?.discountRate ?? 0))));
        assert.ok(flight.durationMinutes >= 35 && flight.durationMinutes <= 1200);
      }
    }
  }
  const minimum = (departure, arrival) => Math.min(...createFlightSchedules({ departure, arrival, departDate: "2026-11-15" }).map(({ price }) => price));
  assert.ok(minimum("GMP", "CJU") < minimum("ICN", "NRT"));
  assert.ok(minimum("FRA", "FCO") < minimum("FRA", "GRU") / 2);
  assert.ok(minimum("JNB", "CPT") < minimum("JNB", "LHR") / 2);
});

test("국내선을 80분으로 고정하지 않고 장거리 왕복 시간차를 유지한다", () => {
  assert.equal(getFlightDurationMinutes("GMP", "RSU"), 60);
  assert.equal(getFlightDurationMinutes("ICN", "CDG"), 865);
  assert.equal(getFlightDurationMinutes("CDG", "ICN"), 730);
  assert.ok(getFlightDurationMinutes("SCL", "EZE") >= 100);
});
