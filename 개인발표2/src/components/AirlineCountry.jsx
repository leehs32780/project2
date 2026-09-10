import { useSyncExternalStore } from "react";
import { getLanguage, subscribeLanguage } from "../i18n/locale";
import { getAirlineCountry } from "../data/airlineCountries";
import "../../css/airline-country.css";

export default function AirlineCountry({ airline }) {
  const language = useSyncExternalStore(subscribeLanguage, getLanguage, () => "ko");
  const country = getAirlineCountry(airline.code, language);
  return country ? <small className="airline-country">{country}</small> : null;
}
