import { t } from "../i18n/translate.js";
import { getLanguage, toKrw } from "../i18n/locale.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  allRouteAirports,
  createFlightSchedules,
  formatPrice,
  getAirportLabel,
} from "../data/appData";

// 입력한 예산으로 갈 수 있는 노선을 찾고 선택한 노선을 메인 검색창에 전달합니다.
export default function BudgetRoutePopup({ date, onSelectRoute, isOpen, setIsOpen, isActive, onActivate }) {
  // 입력 중인 예산, 여행 유형, 검색에 사용한 예산과 로딩·팝업 상태를 관리합니다.
  const [budgetText, setBudgetText] = useState("");
  const [tripType, setTripType] = useState("one-way");
  const [searchedBudget, setSearchedBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // 팝업 DOM과 검색 지연 타이머를 보관합니다. ref 변경 자체는 화면을 다시 그리지 않습니다.
  const popupRef = useRef(null);
  const budgetInputRef = useRef(null);
  const searchTimerRef = useRef(null);
  // 쉼표 등 숫자가 아닌 문자를 제거해 가격 비교에 사용할 숫자로 변환합니다.
  const language = getLanguage();
  const budget = toKrw(Number(budgetText.replace(/,/g, "")) || 0);
  // 통화가 바뀌면 이전 단위로 입력한 예산과 검색 결과를 초기화합니다.
  useEffect(() => {
    window.clearTimeout(searchTimerRef.current);
    setBudgetText("");
    setSearchedBudget(0);
    setIsLoading(false);
  }, [language]);

  // 팝업 밖을 클릭하거나 Escape를 누르면 닫고, 등록한 이벤트는 정리합니다.
  useEffect(() => {
    if (!isOpen) return undefined;
    const closePopup = (event) => {
      if (event.clientX >= document.documentElement.clientWidth) return;
      if (!popupRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closePopup);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("mousedown", closePopup);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen, setIsOpen]);

  // 컴포넌트가 제거되면 대기 중인 검색 타이머를 취소합니다.
  useEffect(() => () => window.clearTimeout(searchTimerRef.current), []);

  // 날짜가 바뀔 때 샘플 스케줄에서 노선별 최저가를 계산합니다. 왕복도 같은 날짜의 양방향 가격으로 추정합니다.
  const routes = useMemo(() => {
    return allRouteAirports.flatMap((airport) => {
      return allRouteAirports
        .filter(({ code }) => code !== airport.code)
        .flatMap(({ code: arrival }) => {
          const flights = createFlightSchedules({
            departure: airport.code,
            arrival,
            departDate: date,
            returnDate: "",
            tripType: "one-way",
          });
          if (!flights.length) return [];

          const cheapestFlight = [...flights].sort(
            (first, second) => first.price - second.price,
          )[0];
          const returnFlights = createFlightSchedules({
            excludedPrices: flights.map(({ price }) => price),
            excludedDepartureTimes: flights.map(({ departureTime }) => departureTime),
            departure: arrival,
            arrival: airport.code,
            departDate: date,
            returnDate: "",
            tripType: "one-way",
          });
          const cheapestReturn = [...returnFlights].sort(
            (first, second) => first.price - second.price,
          )[0];
          return [
            {
              departure: airport.code,
              arrival,
              departureName: airport.city,
              arrivalName: getAirportLabel(arrival),
              oneWayPrice: cheapestFlight.price,
              roundTripPrice:
                cheapestFlight.price +
                (cheapestReturn?.price ?? cheapestFlight.price),
              airline: cheapestFlight.airline,
            },
          ];
        });
    });
  }, [date]);

  // 선택한 여행 유형의 가격이 검색 예산 이하인 노선만 남기고 저렴한 순서로 정렬합니다.
  const affordableRoutes = searchedBudget
    ? routes
        .map((route) => ({
          ...route,
          price:
            tripType === "round-trip"
              ? route.roundTripPrice
              : route.oneWayPrice,
        }))
        .filter(({ price }) => price <= searchedBudget)
        .sort((first, second) => first.price - second.price)
    : [];

  // 예산을 최대 9자리 숫자와 천 단위 쉼표로 정리하고 이전 검색 결과를 초기화합니다.
  const updateBudget = ({ target }) => {
    window.clearTimeout(searchTimerRef.current);
    const digits = target.value.replace(/,/g, "");
    if (language === "en") {
      if (!/^\d{0,7}(\.\d{0,2})?$/.test(digits)) return;
      setBudgetText(digits);
    } else {
      const won = digits.replace(/\D/g, "").slice(0, 9);
      setBudgetText(won ? Number(won).toLocaleString("ko-KR") : "");
    }
    setSearchedBudget(0);
    setIsLoading(false);
  };

    // 3초 동안 로딩을 표시한 뒤 입력 예산을 검색 조건으로 확정합니다.
  const searchBudgetRoutes = () => {
    if (!budget || isLoading) return;
    window.clearTimeout(searchTimerRef.current);
    setIsLoading(true);
    setSearchedBudget(0);
    searchTimerRef.current = window.setTimeout(() => {
      setSearchedBudget(budget);
      setIsLoading(false);
    }, 3000);
  };

  // 편도·왕복을 바꾸면 진행 중인 타이머와 이전 검색 결과를 초기화합니다.
  const changeTripType = (nextTripType) => {
    window.clearTimeout(searchTimerRef.current);
    setTripType(nextTripType);
    setSearchedBudget(0);
    setIsLoading(false);
  };

  return (
    <div className="budget-popup-anchor" ref={popupRef}>
      {/* 예산별 여행지 팝업을 열고 닫는 버튼입니다. */}
      <button
        className={`budget-popup-toggle${isOpen ? " is-open" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-pressed={isActive}
        aria-controls="budget-route-popup"
        onClick={() => {
          onActivate();
          setIsOpen((open) => !open);
        }}
      >
        <span aria-hidden="true">✈</span>
        <span>
          <small>BUDGET FINDER</small>
          <strong>{t("예산별")}<br />{t("여행지")}</strong>
        </span>
        <b aria-hidden="true">{t(isOpen ? "×" : "+")}</b>
      </button>

      {isOpen && (
        <aside
          id="budget-route-popup"
          className="budget-route-popup"
          aria-labelledby="budget-route-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <header>
            <span className="budget-popup-icon" aria-hidden="true">
              ✈
            </span>
            <div>
              <small>BUDGET TRIP FINDER</small>
              <h2 id="budget-route-title">{t("이 예산으로 어디까지?")}</h2>
            </div>
            <button
              className="budget-popup-close"
              type="button"
              aria-label={t("예산별 여행지 팝업 닫기")}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>

          {/* 예산 입력 영역입니다. Enter 키로도 검색을 실행할 수 있습니다. */}
          <label className="budget-input-wrap">
            <span>{t("항공권 예산")}</span>
            <div onClick={() => budgetInputRef.current?.focus()}>
              <input
                ref={budgetInputRef}
                type="text"
                inputMode="numeric"
                value={budgetText}
                onChange={updateBudget}
                onKeyDown={(event) => {
                  if (event.key === "Enter") searchBudgetRoutes();
                }}
                placeholder={language === "en" ? "e.g. 250.00" : "예: 300,000"}
                aria-label={t("항공권 예산")}
              />
              <b>{language === "en" ? "USD" : "원"}</b>
            </div>
          </label>

          <button
            className="budget-search-button"
            type="button"
            disabled={!budget || isLoading}
            onClick={searchBudgetRoutes}
          >
            {t(isLoading ? "검색 중..." : "예산으로 검색")}
          </button>

          {/* 예산 비교에 사용할 편도 또는 왕복 가격 기준을 선택합니다. */}
          <div className="budget-trip-types" aria-label={t("여행 유형")}>
            <button
              className={tripType === "one-way" ? "is-active" : ""}
              type="button"
              aria-pressed={tripType === "one-way"}
              onClick={() => changeTripType("one-way")}
            >{t("편도")}</button>
            <button
              className={tripType === "round-trip" ? "is-active" : ""}
              type="button"
              aria-pressed={tripType === "round-trip"}
              onClick={() => changeTripType("round-trip")}
            >{t("왕복")}</button>
          </div>

          {/* 예산 입력 전에는 사용 방법을 안내합니다. */}
          {!budget && (
            <div className="budget-empty">
              <span aria-hidden="true">⌁</span>
              <p>{t("예산을 입력하면 갈 수 있는")}<br />{t("직항 노선을 찾아드려요.")}</p>
            </div>
          )}

          {/* 검색을 기다리는 동안 로딩 안내를 표시합니다. */}
          {budget > 0 && isLoading && (
            <div
              className="budget-search-loading"
              role="status"
              aria-live="polite"
            >
              <span className="budget-loading-plane" aria-hidden="true">
                ✈
              </span>
              <strong>{t("예산에 맞는 노선을 찾고 있어요")}</strong>
              <small>{t("항공사별 최저가를 비교 중입니다.")}</small>
              <i aria-hidden="true">
                <b />
              </i>
            </div>
          )}

          {/* 검색 완료 후 노선 수와 최저가 목록을 표시합니다. 노선 선택 시 부모 검색창에 반영합니다. */}
          {budget > 0 && !isLoading && searchedBudget > 0 && (
            <div className="budget-result-area" aria-live="polite">
              <div className="budget-result-summary">
                <span>{t("예산 이내 노선 · ")}{t(tripType === "round-trip" ? "왕복" : "편도")}
                </span>
                <strong>{t(affordableRoutes.length)}{t("개")}</strong>
              </div>
              {affordableRoutes.length ? (
                <ol className="budget-route-list">
                  {affordableRoutes.map((route, index) => (
                    <li key={`${route.departure}-${route.arrival}`}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRoute({ ...route, tripType });
                          setIsOpen(false);
                        }}
                      >
                        <span className="budget-rank">{t(index + 1)}</span>
                        <span className="budget-route-copy">
                          <small>{t(route.departureName)}{t(" 출발")}</small>
                          <strong>
                            {t(route.departure)}
                            <i aria-hidden="true">→</i>
                            {t(route.arrival)}
                          </strong>
                          <em>{t(route.arrivalName)}</em>
                        </span>
                        <span className="budget-route-price">
                          <small>{t(route.airline.name)}</small>
                          <b>{t(formatPrice(route.price))}</b>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="budget-no-result">
                  <strong>{t("조건에 맞는 노선이 없어요")}</strong>
                  <p>{t("예산을 조금 높여 다시 확인해 보세요.")}</p>
                </div>
              )}
            </div>
          )}
          <p className="budget-caption">{t("1인 ")}{t(tripType === "round-trip" ? "왕복" : "편도")}{t(" 예상 최저가 기준")}</p>
        </aside>
      )}
    </div>
  );
}
