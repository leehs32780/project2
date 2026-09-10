import "../../css/travel-side-promotions.css";

export default function TravelSidePromotions({ language, onSelect }) {
  const en = language === "en";
  return (
    <aside
      className="travel-side-promotions"
      aria-label={en ? "Airport services" : "공항 연계 서비스"}
    >
      <button
        type="button"
        className="travel-side-banner travel-side-pass"
        onClick={() => onSelect("transfer")}
      >
        <span className="side-brand">SKY PASS</span>
        <strong>
          {en ? (
            <>
              An easier
              <br />
              way to the airport.
            </>
          ) : (
            <>
              공항까지,
              <br />
              가볍게.
            </>
          )}
        </strong>
        <span className="side-description">
          {en ? "Find your airport transfer" : "내 여행에 맞는 이동 방법"}
        </span>
        <svg
          className="side-illustration"
          viewBox="0 0 180 180"
          aria-hidden="true"
        >
          <circle cx="90" cy="86" r="72" fill="#ffffff35" />
          <path
            d="M49 171 70 122M131 171 110 122M57 151h66M51 165h78"
            stroke="#badbea"
            strokeWidth="5"
          />
          <rect x="49" y="28" width="82" height="112" rx="22" fill="#edf6fc" />
          <rect x="60" y="47" width="60" height="42" rx="8" fill="#5586a9" />
          <path d="M90 48v40M62 101h56" stroke="#d3e6f2" strokeWidth="4" />
          <circle cx="67" cy="116" r="6" fill="#e9c77e" />
          <circle cx="113" cy="116" r="6" fill="#e9c77e" />
          <rect x="76" y="34" width="28" height="5" rx="2" fill="#5586a9" />
        </svg>
        <span className="side-category">
          {en ? "RAIL · AIRPORT BUS" : "공항철도 · 리무진"}
        </span>
        <span className="side-link">
          {en ? "Explore options →" : "이용 안내 보기 →"}
        </span>
      </button>
      <button
        type="button"
        className="travel-side-banner travel-side-lounge"
        onClick={() => onSelect("lounge")}
      >
        <span className="side-brand">SKY LOUNGE</span>
        <strong>
          {en ? (
            <>
              A moment
              <br />
              to unwind.
            </>
          ) : (
            <>
              출발 전,
              <br />
              잠깐의 여유.
            </>
          )}
        </strong>
        <span className="side-description">
          {en ? "A comfortable start to your trip" : "여행의 시작을 편안하게"}
        </span>
        <svg
          className="side-illustration"
          viewBox="0 0 180 180"
          aria-hidden="true"
        >
          <circle cx="90" cy="86" r="72" fill="#ffffff65" />
          <rect x="89" y="30" width="51" height="74" rx="24" fill="#c8dce5" />
          <path d="M114 30v74M89 68h51" stroke="#f7f3ec" strokeWidth="4" />
          <rect x="31" y="79" width="61" height="50" rx="15" fill="#a68c77" />
          <rect x="25" y="108" width="74" height="29" rx="10" fill="#bca18b" />
          <path
            d="M36 138v15M86 138v15M129 128v25"
            stroke="#776453"
            strokeWidth="5"
          />
          <ellipse cx="129" cy="125" rx="25" ry="6" fill="#8d7865" />
          <path d="M117 105h17v13h-17zM134 108h5v7h-5" fill="#fffaf3" />
        </svg>
        <span className="side-category">
          {en ? "REST · REFRESH" : "휴식 · 라운지"}
        </span>
        <span className="side-link">
          {en ? "Explore lounges →" : "이용 안내 보기 →"}
        </span>
      </button>
    </aside>
  );
}
