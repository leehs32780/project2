// React 앱을 브라우저의 #root 요소에 연결하는 진입 파일입니다.
// 개발 중 렌더링과 Effect 문제를 찾는 StrictMode와 React DOM 렌더러를 불러옵니다.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// 페이지 전체에서 사용하는 스타일시트를 기본 스타일부터 테마 순서로 불러옵니다.
import "../../css/site-common.css";
import "../../css/main-search-and-airport-routes.css";
import "../../css/travel-video-and-price-chart.css";
import "../../css/budget-route-popup.css";
import "../../css/main-page-final-theme.css";
import "../../css/qna-theme.css";
import "../../css/header-profile-theme.css";
import "../../css/search-route-theme.css";
import "../../css/flight-booking-theme.css";
import "../../css/home-reference-theme.css";
import "../../css/language-theme.css";

// 개발 중 잠재적인 문제를 쉽게 찾을 수 있도록 StrictMode로 앱을 렌더링합니다.
// HTML의 root 요소에 최상위 App 컴포넌트를 연결합니다. 이 파일이 화면 실행의 시작점입니다.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
