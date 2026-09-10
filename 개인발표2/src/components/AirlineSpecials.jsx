import { useEffect, useRef, useState } from "react";
import { airlines } from "../data/appData";
import { getAirlinePromotion, getNextAirlinePromotion, PROMOTION_FIRST_MONTH } from "../data/airlinePromotions";
import { t } from "../i18n/translate";
import "../../css/airline-specials.css";
import aircraftPhoto from "../../images/airline-special-wing.jpg";
import AirlineLogo from "./AirlineLogo";
import AirlineCountry from "./AirlineCountry";

export function AirlineSpecialDialog({ airline, onClose, language }) {
  const ref = useRef(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(Math.max(new Date(2026, 8, 1).getTime(), new Date(now.getFullYear(), now.getMonth(), 1).getTime()));
  });
  const en = language === "en";
  const year = month.getFullYear();
  const index = month.getMonth();
  const promotion = getAirlinePromotion(airline.code, year, index);
  const nextPromotion = getNextAirlinePromotion(airline.code, year, index);
  const isFirstMonth = year * 12 + index <= PROMOTION_FIRST_MONTH;
  const days = new Date(year, index + 1, 0).getDate();
  const offset = month.getDay();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className="airline-special-dialog" style={{ "--airline-color": airline.color }}
    aria-labelledby="airline-special-title" onClose={(event) => { if (!event.currentTarget.open) onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}>
    <header className="airline-special-hero">
      <img src={aircraftPhoto} alt={en ? "Aircraft wing above the clouds, illustrative photo" : "구름 위 비행기 날개 · 공통 여행 이미지"} />
      <button className="airline-special-close" type="button" onClick={onClose} aria-label={en ? "Close" : "닫기"}>×</button>
      <div><span className="airline-special-identity"><AirlineLogo airline={airline} /><span>{t(airline.name)}<AirlineCountry airline={airline} /></span></span>
        <h2 id="airline-special-title">{t(airline.name)}<br />{en ? "Your next special fare" : "특가로 떠나는 다음 여행"}</h2>
        <p>{en ? "Extra savings in every season" : "성수기에도, 비수기에도 시즌 운임에서 추가 할인"}</p>
        <b>{promotion ? `${Math.round(promotion.discountRate * 100)}% ${en ? "OFF" : "할인"}` : (en ? "No special fares this month" : "이번 달 특가 없음")}</b>
      </div>
    </header>
    <section className="airline-special-calendar">
      <div className="airline-special-month"><h3>{en ? "Special fare calendar" : "특가 운임 캘린더"}</h3>
        <div><button type="button" disabled={isFirstMonth} aria-label={en ? "Previous month" : "이전 달"} onClick={() => { if (!isFirstMonth) setMonth(new Date(year, index - 1, 1)); }}>‹</button>
          <strong aria-live="polite">{year}.{String(index + 1).padStart(2, "0")}</strong>
          <button type="button" aria-label={en ? "Next month" : "다음 달"} onClick={() => setMonth(new Date(year, index + 1, 1))}>›</button></div>
      </div>
      <div className="airline-special-grid">
        {(en ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["일", "월", "화", "수", "목", "금", "토"]).map(day => <b key={day}>{day}</b>)}
        {Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, cell) => {
          const day = cell - offset + 1;
          const valid = day > 0 && day <= days;
          const date = `${year}-${String(index + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const special = valid && promotion && date >= promotion.start && date <= promotion.end;
          return <div key={cell} className={special ? "is-special" : ""} aria-label={valid ? `${date}${special ? (en ? ", special fare" : ", 특가") : ""}` : undefined}>{valid && day}{special && <small>{en ? "SALE" : "특가"}</small>}</div>;
        })}
      </div>
      {promotion
        ? <p className="airline-special-period"><i /> {promotion.start} ~ {promotion.end} · {Math.round(promotion.discountRate * 100)}% {en ? "off" : "할인"}</p>
        : <div className="airline-special-empty" role="status"><strong>{en ? "No special fares scheduled this month." : "이번 달은 특가 기간이 없습니다."}</strong>
          {nextPromotion && <p>{en ? "Next demo promotion: " : "다음 시연 특가: "}{nextPromotion.start} ~ {nextPromotion.end} <button type="button" onClick={() => { const [nextYear, nextMonth] = nextPromotion.start.split("-").map(Number); setMonth(new Date(nextYear, nextMonth - 1, 1)); }}>{en ? "View dates →" : "해당 월 보기 →"}</button></p>}
        </div>}
      <p>{en ? "The discount applies automatically to this airline’s departures on the marked dates, separately for each leg." : "표시된 날짜에 출발하는 해당 항공편은 검색·예약 시 자동 할인됩니다. 왕복·다구간은 각 구간의 출발일을 기준으로 적용됩니다."}</p>
      <small>{en ? "Available from September 2026. Each airline has 3–4 demo promotions per year. These are not actual airline offers. Shared illustrative aircraft photo." : "2026년 9월부터 조회할 수 있습니다. 항공사별 연 3~4회 시연용 특가 일정·할인율이며 실제 항공사 행사와 무관합니다. 사진은 공통 비행 이미지입니다."}</small>
    </section>
  </dialog>;
}

export default function AirlineSpecials({ onSelect, language }) {
  const [query, setQuery] = useState("");
  const unique = [...new Map(airlines.map(airline => [airline.code, airline])).values()]
    .sort((a, b) => a.code.localeCompare(b.code, "en"));
  const filtered = unique.filter(airline => `${airline.name} ${t(airline.name)} ${airline.code}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="airline-specials">
    <h2>{language === "en" ? "Airline special fares" : "항공사별 특가 캘린더"}</h2>
    <p>{language === "en" ? "Choose an airline to explore its special fare dates." : "국내외 항공사를 선택하고, 브랜드 색상으로 표시된 특가 탑승일을 확인하세요."}</p>
    <input aria-label={language === "en" ? "Search airlines" : "항공사 검색"} placeholder={language === "en" ? "Airline name or code" : "항공사 이름 또는 코드 검색"} value={query} onChange={event => setQuery(event.target.value)} />
    <div className="airline-special-list">{filtered.map(airline => <button type="button" key={airline.code} onClick={() => onSelect(airline)}><AirlineLogo airline={airline} /><span className="airline-special-copy">{t(airline.name)}<AirlineCountry airline={airline} /></span><span className="airline-special-code">{airline.code}</span><span aria-hidden="true">↗</span></button>)}</div>
    {!filtered.length && <p role="status">{language === "en" ? "No airlines found." : "검색된 항공사가 없습니다."}</p>}
  </section>;
}
