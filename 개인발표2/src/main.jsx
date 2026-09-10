import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "../css/site-common.css";
import "../css/main-search-and-airport-routes.css";
import "../css/travel-video-and-price-chart.css";
import "../css/main-page-final-theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
