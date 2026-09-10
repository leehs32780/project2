import { t } from "../i18n/translate.js";
import { getLanguage, setLanguage } from "../i18n/locale.js";
import SearchSelect from "./SearchSelect";
// 로고, 주요 메뉴, 로그인 상태와 사용자 메뉴를 담당하는 상단 헤더입니다.
// 로그인 정보와 메뉴 클릭 함수를 props로 받아 부모의 예약·프로필·로그인 창을 엽니다.

export default function Header({
  user,
  avatarIcon,
  bookingCount,
  onBookings,
  onLogin,
  onLogout,
  onProfile,
  onQna,
}) {
  return (
    <header className="site-header">
      <div className="container">
        {/* 로고를 누르면 메인 화면으로 이동합니다. */}
        <a className="logo" href="/" aria-label={t("Sky Finder 홈")}>
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle className="logo-orbit" cx="12" cy="12" r="8.35" />
              <path
                className="logo-flight-path"
                d="M3.6 17.1c3.85 1.1 7.5.4 10.25-1.85 2.15-1.75 3.15-4.05 3.55-6.7"
              />
              <g className="logo-plane">
                <path d="M20.85 5.15c-.58-.58-1.95-.08-3.05 1.02l-3.28 3.28-7.7-3.02-1.4 1.4 6.08 4.6-2.82 2.82-2.42-.42-1.2 1.2 3.06 1.85 1.85 3.06 1.2-1.2-.42-2.42 2.82-2.82 4.6 6.08 1.4-1.4-3.02-7.7 3.28-3.28c1.1-1.1 1.6-2.47 1.02-3.05Z" />
              </g>
              <circle className="logo-star" cx="5.25" cy="8.1" r=".8" />
            </svg>
          </span>
          <span className="logo-wordmark">
            <strong>SKY</strong>
            <b>ROUTE</b>
            <small>FLIGHTS, SIMPLIFIED</small>
          </span>
        </a>
        {/* 같은 페이지의 검색·여행지 영역으로 이동하는 링크와 사용자 메뉴를 배치합니다. */}
        <nav className="site-nav" aria-label={t("주요 메뉴")}>
          {/* 로그인한 사용자에게만 내 예약 버튼과 예약 개수를 보여줍니다. */}
          <a href="#flight-search">{t("항공권")}</a>
          <a
            href="#about"
            aria-current={
              window.location.hash === "#about" ? "page" : undefined
            }
          >
            {getLanguage() === "en" ? "About" : "소개"}
          </a>
          <a href="#direct-routes">{t("여행지")}</a>
          {user && (
            <button
              className="header-action bookings-button"
              type="button"
              onClick={onBookings}
            >
              {t("내 예약 ")}
              <span>{t(bookingCount)}</span>
            </button>
          )}
          {/* 로그인 상태에서는 프로필 메뉴를, 비로그인 상태에서는 로그인 버튼을 표시합니다. */}
          {user ? (
            <div className="profile">
              <button
                className="profile-main"
                type="button"
                onClick={onProfile}
                aria-label={t("프로필 수정")}
              >
                <span className="profile-avatar" aria-hidden="true">
                  {t(avatarIcon)}
                </span>
                <span className="profile-copy">
                  <strong>{user.name}</strong>
                  <small>{user.id}</small>
                </span>
              </button>
              <button
                className="logout-button"
                type="button"
                onClick={onLogout}
              >
                {t("로그아웃")}
              </button>
            </div>
          ) : (
            <button
              className="header-action login-button"
              type="button"
              onClick={onLogin}
            >
              {t("로그인")}
            </button>
          )}
          {/* 로그인 여부와 관계없이 Q&A 창을 열 수 있습니다. */}
          <button
            className="header-action qna-action"
            type="button"
            onClick={onQna}
          >
            Q &amp; A
          </button>
          <div className="language-picker">
            <span>
              {getLanguage() === "en" ? "Language / Currency" : "언어 / 통화"}
            </span>
            <SearchSelect
              ariaLabel={
                getLanguage() === "en"
                  ? "Language and currency"
                  : "언어 및 통화 선택"
              }
              value={getLanguage()}
              onChange={setLanguage}
              options={[
                {
                  label: "Language",
                  items: [
                    { value: "ko", label: "한국어 · KRW" },
                    { value: "en", label: "English · USD" },
                  ],
                },
              ]}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
