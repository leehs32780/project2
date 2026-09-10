import { useState } from "react";
import { t } from "../i18n/translate";
import "../../css/airline-logo.css";

const logos = import.meta.glob("../../images/airlines/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

export default function AirlineLogo({ airline }) {
  const [failedCode, setFailedCode] = useState(null);
  const source = logos[`../../images/airlines/${airline.code}.png`];
  return <span className="airline-logo">
    {source && failedCode !== airline.code
      ? <img src={source} alt={`${t(airline.name)} 로고`} onError={() => setFailedCode(airline.code)} />
      : <span className="airline-logo-fallback">{t(airline.name)}</span>}
  </span>;
}
