import { t } from "../i18n/translate.js";
import { getFirstFareSummary } from "../services/flightApi.js";
import { formatPrice } from "../data/appData.js";

export default function FirstFareSummary({ flights }) {
  const reference = flights.find(
    (flight) => flight.firstFareReference,
  )?.firstFareReference;
  if (reference)
    return (
      <div className="first-fare-summary" role="status">
        <p>
          <strong>
            {t(reference.kind === "published-fare"
              ? "공시 운임 참고가"
              : reference.kind === "comparable-route-estimate"
                ? "유사 노선 평균 기반 참고가"
                : "공개 평균 기반 참고가")}{t(" ")}
            {t(formatPrice(reference.price))}
          </strong>
          <br />{t("성인 1인 구간 기준 · 아래 항공편 금액은 시간대별 예상 가격 또는 직접 설정한 가격입니다.")}<br />{t("이 기준가는 시간대별 금액의 평균이 아닙니다. 시간표는 예시입니다.")}</p>
        <details>
          <summary>{t("평균 운임 출처와 계산 기준")}</summary>
          <p>
            <a href={reference.source} target="_blank" rel="noreferrer">
              {t(reference.label)}
            </a>
            <br />{t("원문 왕복 ")}{t(reference.amount.toLocaleString("ko-KR"))}{t(" ")}
            {t(reference.currency)} · {t(reference.period)}
            <br />
            {t(reference.method)}
            <br />{t("확인일 ")}{t(reference.checkedAt)}{t(" · 원문 출발 방향·도시/국가 단위 참고 자료이며 경유편도 포함할 수 있습니다.")}<br />{t("역방향·다른 공항·항공사의 실제 평균을 보장하지 않습니다. 세금 포함 여부는 원문 기준입니다.")}</p>
        </details>
      </div>
    );
  const summary = getFirstFareSummary(flights);
  if (!summary) return null;
  return (
    <p className="first-fare-summary" role="status">
      <strong>{t("조회된 퍼스트 평균 ")}{t(formatPrice(summary.average))}</strong>
      <br />{t("성인 1인 편도 · 세금 포함 · ")}{t(summary.count)}{t("편의 최저 운임 평균")}<br />{t("현재 조회된 항공편 기준이며 전체 항공사의 평균은 아닙니다. 왕복은 구간별 편도 운임입니다.")}</p>
  );
}
