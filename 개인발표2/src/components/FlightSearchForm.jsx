import { t } from "../i18n/translate.js";
import { useMemo } from "react";
import SearchSelect from "./SearchSelect";
import { allRouteAirports, getDirectDestinationCodes, getAvailableCabins } from "../data/appData";
import { cabinLabels } from "../data/cabinData";

// 여행 유형, 공항, 날짜 입력을 담당하고 검색 상태는 App에서 관리합니다.
export default function FlightSearchForm({
  form,
  today,
  isSearching,
  updateTripType,
  updateAirport,
  updateForm,
  searchFlights,
}) {
  // 공항 데이터를 국가별로 묶습니다. 최초 렌더링 때 계산한 목록을 재사용합니다.
  const airportGroups = useMemo(() => {
    const groups = new Map();
    allRouteAirports.forEach((airport) => {
      groups.set(airport.country, [
        ...(groups.get(airport.country) ?? []),
        airport,
      ]);
    });
    return Array.from(groups, ([label, items]) => ({ label, items }));
  }, []);
  // 다구간의 마지막 구간은 경유 공항에서 출발하는 직항만 선택합니다.
  const arrivalDepartureCode =
    form.tripType === "multi-city" ? form.stopover : form.departure;
  // 마지막 구간의 출발 공항에서 직항으로 연결된 공항만 도착지 목록에 남깁니다.
  const arrivalAirportGroups = useMemo(() => {
    const directDestinationCodes = new Set(
      getDirectDestinationCodes(arrivalDepartureCode),
    );

    return airportGroups
      .map(({ label, items }) => ({
        label,
        items: items.filter(({ code }) => directDestinationCodes.has(code)),
      }))
      .filter(({ items }) => items.length > 0);
  }, [airportGroups, arrivalDepartureCode]);

  const availableCabins = getAvailableCabins(form);
  return (
    <form
      className={`search-form${form.tripType === "multi-city" ? " multi-city-form" : ""}`}
      onSubmit={searchFlights}
    >
      {/* 왕복·편도·다구간 유형을 선택하며 변경 처리는 App의 함수에 맡깁니다. */}
      <div className="trip-type-tabs" role="group" aria-label={t("여행 유형")}>
        {[
          { value: "one-way", label: "편도" },
          { value: "round-trip", label: "왕복" },
          { value: "multi-city", label: "다구간" },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={form.tripType === value}
            onClick={() => updateTripType(value)}
          >
            {t(label)}
          </button>
        ))}
      </div>
      <label>
        {/* 출발 공항을 선택하면 부모 상태에서 뒤에 연결된 공항 선택을 초기화합니다. */}{t("출발지")}<SearchSelect
          value={form.departure}
          placeholder={t("출발 공항 선택")}
          options={airportGroups.map(({ label, items }) => ({
            label,
            items: items.map((airport) => ({
              value: airport.code,
              label: `${airport.city} - ${airport.name} (${airport.code})`,
              disabled:
                form.tripType !== "multi-city" &&
                airport.code === form.arrival,
            })),
          }))}
          onChange={(value) =>
            updateAirport({ target: { name: "departure", value } })
          }
        />
      </label>
      {/* 다구간에서만 경유지 입력을 표시하고 출발지의 직항 공항으로 후보를 제한합니다. */}
      {form.tripType === "multi-city" && (
        <label>{t("경유지")}<SearchSelect
            value={form.stopover}
            disabled={!form.departure}
            placeholder={
              t(form.departure
                ? "경유 공항 선택"
                : "출발 공항을 먼저 선택해 주세요")
            }
            options={airportGroups
              .map(({ label, items }) => ({
                label,
                items: items
                  .filter(({ code }) =>
                    getDirectDestinationCodes(form.departure).includes(
                      code,
                    ),
                  )
                  .map((airport) => ({
                    value: airport.code,
                    label: `${airport.city} - ${airport.name} (${airport.code})`,
                  })),
              }))
              .filter(({ items }) => items.length)}
            onChange={(value) =>
              updateAirport({ target: { name: "stopover", value } })
            }
          />
        </label>
      )}
      <label>
        {/* 경유지 선택 전에는 최종 도착지를 비활성화하며 선택 후 경유지의 직항 목록을 제공합니다. */}
        {t(form.tripType === "multi-city" ? "최종 도착지" : "도착지")}
        <SearchSelect
          key={`${form.tripType}-${arrivalDepartureCode}`}
          value={form.arrival}
          disabled={!arrivalDepartureCode}
          placeholder={
            t(form.tripType === "multi-city" && !form.stopover
              ? "경유 공항을 먼저 선택해 주세요"
              : form.tripType === "multi-city"
                ? "도착 공항 선택"
                : form.departure
                  ? "도착 공항 선택"
                  : "출발 공항을 먼저 선택해 주세요")
          }
          options={arrivalAirportGroups.map(({ label, items }) => ({
            label,
            items: items.map((airport) => ({
              value: airport.code,
              label: `${airport.city} - ${airport.name} (${airport.code})`,
            })),
          }))}
          onChange={(value) =>
            updateAirport({ target: { name: "arrival", value } })
          }
        />
        {form.tripType === "multi-city" && form.stopover && (
          <small>
            {t(form.stopover)}{t("에서 직항으로 갈 수 있는 공항")}{t(" ")}
            {t(arrivalAirportGroups.reduce(
              (count, group) => count + group.items.length,
              0,
            ))}{t("곳")}</small>
        )}
      </label>
      <label>
        {/* 첫 항공편의 출발 날짜를 입력합니다. 오늘보다 이전 날짜는 선택할 수 없습니다. */}
        {t(form.tripType === "multi-city" ? "첫 구간 출발일" : "출국일")}
        <span className="localized-date-field" data-empty={!form.departDate}>
        <input
          name="departDate"
          data-empty={!form.departDate}
          type="date"
          min={today}
          value={form.departDate}
          onChange={updateForm}
        />
        <span className="localized-date-placeholder" aria-hidden="true">YYYY-MM-DD</span>
        </span>
      </label>
      <label>
        {/* 다구간은 경유지 출발일, 왕복은 귀국일을 입력합니다. 편도에서는 비활성화합니다. */}
        {t(form.tripType === "multi-city" ? "경유지 출발일" : "귀국일")}
        <span className="localized-date-field" data-empty={!(form.tripType === "multi-city" ? form.stopoverDate : form.returnDate)}>
        <input
          name={
            form.tripType === "multi-city" ? "stopoverDate" : "returnDate"
          }
          type="date"
          min={form.departDate || today}
          data-empty={!(form.tripType === "multi-city" ? form.stopoverDate : form.returnDate)}
          value={
            form.tripType === "multi-city"
              ? form.stopoverDate
              : form.returnDate
          }
          onChange={updateForm}
          disabled={form.tripType === "one-way"}
        />
        <span className="localized-date-placeholder" aria-hidden="true">YYYY-MM-DD</span>
        </span>
      </label>
      <label className="cabin-select-field">{t("좌석 유형")}<SearchSelect
          value={form.cabin ?? "economy"}
          onChange={(value) => updateForm({ target: { name: "cabin", value } })}
          options={[{ label: "좌석 유형", items: Object.entries(cabinLabels)
            .filter(([value]) => value !== "first" || availableCabins.includes(value))
            .map(([value, label]) => ({ value, label, disabled: !availableCabins.includes(value) })) }]}
        />
        {availableCabins.includes("first") && <small>{t("퍼스트는 일부 항공편에 제공되며 기종에 따라 달라질 수 있습니다.")}</small>}
      </label>
      {/* 검색 중에는 중복 제출을 막고 버튼에 진행 상태를 표시합니다. */}
      <button
        className="primary-button"
        type="submit"
        disabled={isSearching}
      >
        {t(isSearching ? "검색 중..." : "항공권 검색")}
      </button>
    </form>
  );
}
