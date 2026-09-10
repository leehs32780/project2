import { t } from "../i18n/translate.js";
import { formatDate } from "../i18n/locale.js";
import { useState } from "react";
import AirlineCountry from "./AirlineCountry";
import { formatPrice } from "../data/appData";

// 두 시각 모두 경유 공항의 현지시간이므로 시차 변환 없이 비교합니다.
export function canConnect(first, second, trip) {
  if (first.arrivalUtc && second.departureUtc) {
    return Date.parse(second.departureUtc) - Date.parse(first.arrivalUtc) >= 120 * 60000;
  }
  // 첫 항공편의 날짜 차이를 반영합니다. Z는 두 현지시각을 같은 기준으로 비교하기 위한 계산용 표기입니다.
  const arrival = Date.parse(`${trip.departDate}T${first.arrivalTime}:00Z`)
    + (first.arrivalDayOffset ?? 0) * 86400000;
  const departure = Date.parse(`${trip.stopoverDate}T${second.departureTime}:00Z`);
  return departure - arrival >= 120 * 60000;
}

// 예매 창과 예약 내역에서 재사용하는 구간별 공항·날짜·항공편·가격 요약입니다.
export function FlightSegments({ segments }) {
  if (!segments) return null;
  return <div className="multi-city-segments">{segments.map((segment, index) => (
    <p key={index}>
      <strong>{t(index + 1)}{t("구간 · ")}{t(segment.departure)} → {t(segment.arrival)}</strong><br />
      {t(segment.cabinLabel ?? "일반석")} · {formatDate(segment.departDate)} · {t(segment.airline.name)} {t(segment.flightNumber)}<br />
      {t(segment.departureTime)} → {t(segment.arrivalTime)}
      {t(segment.arrivalDayOffset > 0 && ` (+${segment.arrivalDayOffset}일)`)}
      {t(" · ")}{t(formatPrice(segment.price))}
    </p>
  ))}</div>;
}

// 두 구간의 조회 결과를 표시하고 각 항공편을 선택해 하나의 예약 데이터로 묶습니다.
export default function MultiCityResults({ trip, results, onBook, onAirlineSelect }) {
  // 첫 번째와 두 번째 구간에서 선택한 항공편을 배열로 보관합니다.
  const [selected, setSelected] = useState([null, null]);
  // 출발지 → 경유지와 경유지 → 최종 도착지를 구간별 출발일과 연결합니다.
  const routes = [
    { departure: trip.departure, arrival: trip.stopover, departDate: trip.departDate },
    { departure: trip.stopover, arrival: trip.arrival, departDate: trip.stopoverDate },
  ];
  // 두 구간을 모두 선택해야 총액과 예매 버튼을 표시합니다.
  const ready = selected.every(Boolean);
  return <section className="flight-results">
    <div className="flight-results-heading"><div><h2>{t("다구간 항공 스케줄")}</h2>
      <p>{t(trip.departure)} → {t(trip.stopover)} → {t(trip.arrival)}</p>
      <p>{t("각 구간을 선택해보세요. 경유지에서 최소 2시간의 이동 여유를 둡니다. 시각은 각 공항 현지시간입니다.")}</p>
    </div><b>{t("다구간")}</b></div>
    {/* 구간별 항공편 목록을 표시합니다. 첫 구간을 바꾸면 두 번째 구간 선택을 초기화합니다. */}
    {routes.map((route, index) => <div key={index}>
      <h3>{t(index + 1)}{t("구간 · ")}{t(route.departure)} → {t(route.arrival)} · {formatDate(route.departDate)}</h3>
      {!results[index].length && <p role="status">{t("이 구간의 항공편이 없습니다. 공항이나 날짜를 변경해 주세요.")}</p>}
      <div className="flight-list">{results[index].map((flight) => {
        // 첫 구간을 먼저 선택해야 하며, 경유지 도착 후 2시간 이상 여유가 있는 항공편만 허용합니다.
        const disabled = index === 1 && (!selected[0] || !canConnect(selected[0], flight, trip));
        return <article className="flight-card" key={flight.id}>
          <div><button className="airline-special-link" type="button" onClick={() => onAirlineSelect?.(flight.airline)}>{t(flight.airline.name)}</button><AirlineCountry airline={flight.airline} /><p>{t(flight.cabinLabel)} · {t(flight.flightNumber)}</p>{flight.promotion && <small className="airline-special-badge">{t("특가")} −{Math.round(flight.promotion.discountRate * 100)}% · <del>{t(formatPrice(flight.originalPrice))}</del></small>}</div>
          <div><strong>{t(flight.departureTime)} → {t(flight.arrivalTime)}</strong>
            {flight.arrivalDayOffset !== 0 && <sup>{t(flight.arrivalDayOffset > 0 ? "+" : "")}{t(flight.arrivalDayOffset)}{t("일")}</sup>}<p>{t("예정 ")}{t(flight.duration)}</p></div>
          <div className="flight-price"><strong>{t(formatPrice(flight.price))}</strong><small>{t(flight.priceLabel)}</small><span>{t(flight.seats == null ? "좌석 수 미제공" : `잔여 ${flight.seats}석`)}</span></div>
          <button type="button" disabled={disabled} aria-pressed={selected[index]?.id === flight.id}
            onClick={() => setSelected(index === 0 ? [flight, null] : [selected[0], flight])}>
            {t(selected[index]?.id === flight.id ? "선택 완료" : disabled ? "연결 불가" : `${index + 1}구간 선택`)}
          </button>
        </article>;
      })}</div>
    </div>)}
    {/* 두 항공편의 가격을 합산하고 구간 상세 정보를 포함한 예약용 객체를 부모에게 전달합니다. */}
    {ready && <div className="multi-city-total"><strong>{t("1인 총액 ")}{t(formatPrice(selected[0].price + selected[1].price))}</strong>
      <button className="primary-button" type="button" onClick={() => onBook({
        ...selected[0],
        id: selected.map(({ id }) => id).join("/"),
        airline: { ...selected[0].airline, name: "다구간" },
        flightNumber: selected.map(({ flightNumber }) => flightNumber).join(" / "),
        price: selected[0].price + selected[1].price,
        arrivalTime: selected[1].arrivalTime,
        arrivalDayOffset: Math.round((Date.parse(trip.stopoverDate) - Date.parse(trip.departDate)) / 86400000) + (selected[1].arrivalDayOffset ?? 0),
        segments: selected.map((flight, index) => ({ ...flight, ...routes[index] })),
      })}>{t("다구간 예매하기")}</button>
    </div>}
  </section>;
}
