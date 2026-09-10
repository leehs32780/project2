import "../../css/about-page.css";
import travelVideo from "../../videos/travel-resort.mp4";

export default function AboutPage({ language }) {
  const en = language === "en";
  const features = en ? [
    ["01", "Find your next flight", "Choose a one-way, round-trip or multi-city journey. Set your airports, dates and cabin to explore your options."],
    ["02", "Explore six continents", "Browse destinations by continent and discover airports and example direct routes."],
    ["03", "Plan around your budget", "Explore popular destinations, budget suggestions and seasonal pricing guidance in one place."],
    ["04", "Keep your plans together", "Use your account to review bookings, manage your profile and ask questions through Q&A."],
  ] : [
    ["01", "나에게 맞는 항공권 찾기", "편도부터 왕복, 다구간까지. 출발지와 도착지, 여행 날짜와 좌석을 선택해 여행에 맞는 항공편을 찾아보세요."],
    ["02", "여섯 대륙으로 펼쳐지는 여행", "아시아부터 오세아니아까지 대륙별 공항을 둘러보고, 공항별 주요 직항 노선으로 다음 여행의 힌트를 얻으세요."],
    ["03", "예산과 계절에 맞춰 계획하기", "인기 여행지, 예산별 추천, 성수기·비수기 안내를 함께 살펴보며 여행 시기와 목적지를 정해보세요."],
    ["04", "예약부터 궁금한 점까지 한곳에서", "내 예약에서 여행 정보를 확인하고 프로필을 관리해보세요. 궁금한 내용은 Q&A에 남길 수 있어요."],
  ];
  return (
    <main className="about-page" id="about">
      <section className="about-hero">
        <video
          className="about-hero-video"
          src={travelVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          onLoadedMetadata={({ currentTarget: video }) => {
            if (Number.isFinite(video.duration) && video.duration > 0 && video.duration < 13) {
              video.playbackRate = Math.max(0.25, video.duration / 13);
            }
          }}
          onTimeUpdate={({ currentTarget: video }) => {
            if (video.currentTime >= 13) video.currentTime = 0;
          }}
        />
        <div className="container">
          <p className="about-kicker">ABOUT SKY ROUTE</p>
          <h1>{en ? "Your next journey starts here." : <>여행의 시작을,<br />조금 더 가볍게.</>}</h1>
          <p>{en ? "From finding a destination to planning your flight, explore your next journey with SKY ROUTE." : "어디로 떠날지 고민하는 순간부터 항공권을 고르는 순간까지, SKY ROUTE가 여행의 첫걸음을 함께합니다."}</p>
          <a className="about-cta" href="#flight-search">{en ? "Find flights →" : "항공권 찾아보기 →"}</a>
        </div>
      </section>
      <section className="container about-features" aria-labelledby="about-features-title">
        <p className="about-kicker">EXPLORE · PLAN · GO</p>
        <h2 id="about-features-title">{en ? "A clearer way to plan your trip" : "여행을 준비하는 네 가지 방법"}</h2>
        <div className="about-feature-grid">
          {features.map(([number, title, description]) => (
            <article key={number} className="about-feature">
              <span className="about-number">{number}</span>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container about-ending">
        <p className="about-kicker">YOUR NEXT DESTINATION</p>
        <h2>{en ? "Where would you like to go?" : "다음 여행은 어디로 떠나볼까요?"}</h2>
        <p>{en ? "Start with a destination that catches your eye." : "마음에 드는 여행지를 찾는 것부터 시작해보세요."}</p>
        <a className="about-cta" href="#direct-routes">{en ? "Explore destinations →" : "여행지 둘러보기 →"}</a>
      </section>
    </main>
  );
}
