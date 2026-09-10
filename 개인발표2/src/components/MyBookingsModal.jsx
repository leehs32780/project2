import { t } from "../i18n/translate.js";
import { formatDate } from "../i18n/locale.js";
import { FlightSegments } from "./MultiCityResults";

// 현재 사용자가 결제한 예약 목록과 예약 취소 기능을 제공하는 모달입니다.
export default function MyBookingsModal({
  bookings,
  onClose,
  onCancel,
  formatPrice,
  getAirportLabel,
}) {
  // 배경을 클릭하거나 닫기 버튼을 누르면 부모의 onClose를 호출합니다.
  return (
    <div
      className="my-bookings-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="my-bookings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-bookings-title"
      >
        <button
          className="my-bookings-close"
          type="button"
          onClick={onClose}
          aria-label={t("내 예약 닫기")}
        >
          ×
        </button>
        <header>
          {/* 모달의 제목과 기능 안내 문구입니다. */}
          <span>MY TRIPS</span>
          <h2 id="my-bookings-title">{t("내가 예약한 항공권")}</h2>
          <p>{t("결제 완료된 항공권과 여행 일정을 확인해보세요.")}</p>
        </header>
        <div className="my-bookings-list">
          {/* 저장된 예약이 없을 때 보여주는 빈 화면입니다. */}
          {bookings.length === 0 && (
            <div className="my-bookings-empty">{t("아직 예약한 항공권이 없습니다.")}</div>
          )}
          {bookings.map((booking) => (
            // 예약 한 건마다 노선, 항공편, 탑승객과 결제 정보를 카드로 출력합니다.
            <article className="my-booking-card" key={booking.number}>
              <div className="my-booking-top">
                <span>{t("결제 완료")}</span>
                <strong>{t(booking.number)}</strong>
              </div>
              {/* 출발·도착 공항과 다구간의 경유 공항을 여행 순서대로 표시합니다. */}
              <div className="my-booking-route">
                <b>{t(booking.trip.departure)}</b>
                <i>✈</i>
                {booking.trip.tripType === "multi-city" && <><b>{t(booking.trip.stopover)}</b><i>✈</i></>}
                <b>{t(booking.trip.arrival)}</b>
              </div>
              <p>
                {t(getAirportLabel(booking.trip.departure))} →{t(" ")}
                {t(getAirportLabel(booking.trip.arrival))}
              </p>
              {/* 구간별 일정, 탑승객, 결제 금액을 표시합니다. 다구간은 공통 요약 컴포넌트를 사용합니다. */}
              <dl>
                {booking.flight.segments && <div><dt>{t("다구간 일정")}</dt><dd><FlightSegments segments={booking.flight.segments} /></dd></div>}
                <div>
                  <dt>{t("가는 편")}</dt>
                  <dd>
                    {formatDate(booking.trip.departDate)} ·{t(" ")}
                    {t(booking.outboundFlight.airline.name)}{t(" ")}
                    {t(booking.outboundFlight.cabinLabel ?? "일반석")} · {t(booking.outboundFlight.flightNumber)} ·{t(" ")}
                    {t(booking.outboundFlight.departureTime)}
                  </dd>
                </div>
                {booking.returnFlight && (
                  <div>
                    <dt>{t("오는 편")}</dt>
                    <dd>
                      {formatDate(booking.trip.returnDate)} ·{t(" ")}
                      {t(booking.returnFlight.airline.name)}{t(" ")}
                      {t(booking.returnFlight.cabinLabel ?? "일반석")} · {t(booking.returnFlight.flightNumber)} ·{t(" ")}
                      {t(booking.returnFlight.departureTime)}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>{t("탑승객")}</dt>
                  <dd>{booking.passenger.passengerName}</dd>
                </div>
                <div>
                  <dt>{t("결제 금액")}</dt>
                  <dd>{formatPrice(booking.payment.amount)} · {booking.payment.lastFour ? booking.payment.method : t(booking.payment.method)}</dd>
                </div>
              </dl>
              {/* 예약 번호를 부모에게 전달해 확인 및 예약 취소 처리를 실행합니다. */}
              <button
                className="booking-cancel-button"
                type="button"
                onClick={() => onCancel(booking.number)}
              >{t("예약 취소")}</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
