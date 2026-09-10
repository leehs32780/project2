import test from "node:test";
import assert from "node:assert/strict";
import { customFlightPrices, getReturnFare } from "./customFlightPrices.js";
import {
  createFlightSchedules,
  allRouteAirports,
  getDirectDestinationCodes,
  getFlightDurationMinutes,
} from "./appData.js";

test("귀국 운임은 재검색에도 일정하고 시간대별 차등 및 충돌 보정을 적용한다", () => {
  const prices = Array.from({ length: 8 }, (_, index) =>
    getReturnFare(1000000, "DXB", "ICN", "first", index, new Set()),
  );
  assert.equal(new Set(prices).size, 8);
  for (let index = 0; index < prices.length; index += 1) {
    assert.equal(
      getReturnFare(1000000, "DXB", "ICN", "first", index, new Set()),
      prices[index],
    );
    const adjusted = getReturnFare(
      1000000,
      "DXB",
      "ICN",
      "first",
      index,
      new Set(prices),
    );
    assert.ok(!prices.includes(adjusted));
    assert.ok(adjusted - prices[index] >= 17000);
  }
});

test("모든 직항 노선의 제공 좌석 등급마다 시간대별 자동 가격이 다르다", () => {
  for (const { code: departure } of allRouteAirports) {
    for (const arrival of getDirectDestinationCodes(departure)) {
      for (const cabin of ["economy", "business", "first"]) {
        const flights = createFlightSchedules({
          departure,
          arrival,
          cabin,
          departDate: "2026-10-10",
        });
        assert.equal(
          new Set(flights.map((flight) => flight.price)).size,
          flights.length,
          `${departure}-${arrival}-${cabin}`,
        );
        assert.ok(
          flights.every(
            (flight) => Number.isFinite(flight.price) && flight.price > 0,
          ),
        );
        const returnFlights = createFlightSchedules({
          departure: arrival,
          arrival: departure,
          cabin,
          departDate: "2026-10-17",
          excludedPrices: flights.map(({ price }) => price),
          excludedDepartureTimes: flights.map(
            ({ departureTime }) => departureTime,
          ),
        });
        const roundTrip = [...flights, ...returnFlights];
        for (const [schedules, from, to] of [
          [flights, departure, arrival],
          [returnFlights, arrival, departure],
        ]) {
          const baseDuration = getFlightDurationMinutes(from, to);
          if (schedules.length > 1)
            assert.ok(
              new Set(schedules.map(({ durationMinutes }) => durationMinutes))
                .size > 1,
              `${from}-${to}-${cabin}: 시간대별 비행시간`,
            );
          for (const flight of schedules) {
            assert.equal(flight.durationMinutes % 5, 0);
            assert.ok(
              Math.abs(
                flight.durationMinutes - Math.round(baseDuration / 5) * 5,
              ) <= 10,
            );
            assert.equal(
              (Date.parse(flight.arrivalUtc) -
                Date.parse(flight.departureUtc)) /
                60000,
              flight.durationMinutes,
            );
          }
        }
        assert.equal(
          new Set(roundTrip.map(({ departureTime }) => departureTime)).size,
          roundTrip.length,
          `${departure}-${arrival}-${cabin}: 왕복 출발 시간 중복`,
        );
        assert.deepEqual(
          returnFlights.map(({ departureTime }) => departureTime),
          returnFlights.map(({ departureTime }) => departureTime).sort(),
        );
        for (const flight of returnFlights) {
          assert.equal(
            (Date.parse(flight.arrivalUtc) - Date.parse(flight.departureUtc)) /
              60000,
            flight.durationMinutes,
          );
        }
        assert.equal(
          new Set(roundTrip.map(({ price }) => price)).size,
          roundTrip.length,
          `${departure}-${arrival}-${cabin}: 왕복 전체 가격 중복`,
        );
      }
    }
  }
});

test("직접 정한 가격은 해당 방향·등급·시간에만 적용한다", () => {
  const search = {
    departure: "ICN",
    arrival: "DXB",
    cabin: "first",
    departDate: "2026-10-10",
  };
  const before = createFlightSchedules(search);
  customFlightPrices["ICN-DXB"].first["06:40"] = 6123456;
  try {
    const after = createFlightSchedules(search);
    assert.equal(after[0].basePrice, 6123456);
    assert.equal(after[0].price, Math.round(6123456 * 0.85));
    assert.equal(after[0].priceSource, "custom");
    assert.deepEqual(after.slice(1), before.slice(1));
    assert.notEqual(
      createFlightSchedules({ ...search, cabin: "economy" })[0].price,
      6123456,
    );
    assert.notEqual(
      createFlightSchedules({ ...search, departure: "DXB", arrival: "ICN" })[0]
        .price,
      6123456,
    );
  } finally {
    delete customFlightPrices["ICN-DXB"].first["06:40"];
  }
});
