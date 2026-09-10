import test from "node:test";
import assert from "node:assert/strict";
import { getAvailableCabins, createFlightSchedules } from "./appData.js";

const form = {
  departure: "ICN",
  arrival: "DXB",
  departDate: "2026-10-10",
  returnDate: "2026-10-20",
  tripType: "one-way",
  cabin: "first",
};

test("퍼스트 제공 노선과 역방향에만 퍼스트 선택 및 해당 운항사 결과를 제공한다", () => {
  for (const [departure, arrival] of [
    ["ICN", "DXB"],
    ["DXB", "ICN"],
  ]) {
    const search = { ...form, departure, arrival };
    assert.ok(getAvailableCabins(search).includes("first"));
    const flights = createFlightSchedules(search);
    assert.ok(flights.length > 0);
    assert.ok(
      flights.every(
        (flight) =>
          flight.airline.code === "EK" &&
          flight.priceSource === "reference-estimate",
      ),
    );
  }
  for (const arrival of ["CJU", "NRT", "GRU", ""]) {
    const search = { ...form, arrival };
    assert.ok(!getAvailableCabins(search).includes("first"));
    assert.deepEqual(createFlightSchedules(search), []);
  }
});

test("왕복과 다구간은 모든 구간에서 퍼스트를 제공해야 한다", () => {
  assert.ok(
    getAvailableCabins({ ...form, tripType: "round-trip" }).includes("first"),
  );
  const multi = {
    ...form,
    tripType: "multi-city",
    stopover: "DXB",
    stopoverDate: "2026-10-12",
  };
  assert.ok(getAvailableCabins({ ...multi, arrival: "FRA" }).includes("first"));
  assert.ok(
    !getAvailableCabins({ ...multi, arrival: "ICN", stopover: "NRT" }).includes(
      "first",
    ),
  );
});

test("퍼스트 도입일 이전에는 선택할 수 없다", () => {
  const search = { ...form, departure: "SIN", arrival: "AMS" };
  assert.ok(
    !getAvailableCabins({ ...search, departDate: "2026-06-30" }).includes(
      "first",
    ),
  );
  assert.ok(
    getAvailableCabins({ ...search, departDate: "2026-07-01" }).includes(
      "first",
    ),
  );
  assert.ok(
    !getAvailableCabins({ ...search, departDate: "" }).includes("first"),
  );
  assert.ok(
    !getAvailableCabins({
      ...search,
      tripType: "round-trip",
      departDate: "2026-06-30",
    }).includes("first"),
  );
});
