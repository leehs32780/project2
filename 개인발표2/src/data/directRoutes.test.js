import test from "node:test";
import assert from "node:assert/strict";
import {
  directDestinationsByAirport,
  directRouteKeys,
} from "./directRoutes.js";
import {
  allRouteAirports,
  getAirportRouteCards,
  getDirectDestinationCodes,
  createFlightSchedules,
} from "./appData.js";

test("모든 공항의 카드 목적지와 검색 목적지가 같은 노선 목록을 사용한다", () => {
  const codes = allRouteAirports.map(({ code }) => code).sort();
  assert.deepEqual(Object.keys(directDestinationsByAirport).sort(), codes);
  assert.equal(new Set(directRouteKeys).size, directRouteKeys.length);
  const cards = getAirportRouteCards();
  for (const code of codes) {
    const destinations = getDirectDestinationCodes(code);
    assert.ok(!destinations.includes(code));
    const card = cards.find((airport) => airport.code === code);
    const cardCodes = card.routes.flatMap(({ cities }) =>
      [...cities.matchAll(/\(([A-Z]{3})\)/g)].map((match) => match[1]),
    );
    assert.deepEqual(cardCodes.sort(), [...destinations].sort(), code);
    for (const arrival of destinations) {
      assert.ok(codes.includes(arrival));
      assert.ok(
        getDirectDestinationCodes(arrival).includes(code),
        `${code}-${arrival}`,
      );
    }
  }
});

test("누락됐던 대륙 내·대륙 간 노선을 검색할 수 있고 미취항 노선은 제외한다", () => {
  for (const [departure, arrival] of [
    ["PRG", "AMS"],
    ["HEL", "KIX"],
    ["GIG", "FCO"],
    ["CPT", "GRU"],
    ["CMN", "JFK"],
  ]) {
    assert.ok(getDirectDestinationCodes(departure).includes(arrival));
    assert.equal(
      createFlightSchedules({ departure, arrival, departDate: "2026-10-10" })
        .length,
      8,
    );
  }
  for (const [departure, arrival] of [
    ["ICN", "GRU"],
    ["WAW", "HAN"],
    ["CTS", "SFO"],
  ]) {
    assert.ok(!getDirectDestinationCodes(departure).includes(arrival));
    assert.deepEqual(
      createFlightSchedules({ departure, arrival, departDate: "2026-10-10" }),
      [],
    );
  }
});
