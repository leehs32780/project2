import { t } from "../i18n/translate.js";
// 선택한 여행지의 5주간 예상 가격을 SVG 선 그래프로 그립니다.
export default function PriceChart({ destination, formatPrice }) {
  // viewBox 크기와 그래프 내부 여백을 고정해 화면 크기에 맞게 비율로 확대·축소합니다.
  const width = 760;
  const height = 300;
  const padding = { top: 45, right: 35, bottom: 45, left: 35 };
  // 최저·최고 가격보다 축 범위를 넓혀 그래프 위아래에 여유를 줍니다.
  const min = Math.min(...destination.prices) * 0.92;
  const max = Math.max(...destination.prices) * 1.05;
  // 가격 범위를 SVG의 위아래 좌표로 변환해 각 주차의 점 위치를 계산합니다.
  const points = destination.prices.map((price, index) => ({
    x: padding.left + ((width - padding.left - padding.right) / 4) * index,
    y:
      padding.top +
      ((max - price) / (max - min)) * (height - padding.top - padding.bottom),
  }));
  // polyline은 선, polygon은 선 아래의 반투명 영역에 사용할 좌표 문자열입니다.
  const pointText = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaText = `${padding.left},${height - padding.bottom} ${pointText} ${width - padding.right},${height - padding.bottom}`;

  return (
    <section className="price-chart-panel" aria-live="polite">
      {/* 선택한 여행지 이름과 5주 중 가장 낮은 예상 가격을 표시합니다. */}
      <div className="chart-heading">
        <div>
          <span>{t(destination.country)}</span>
          <h3>{t(destination.city)}{t(" 주별 항공 가격")}</h3>
        </div>
        <strong>{t("최저 ")}{t(formatPrice(Math.min(...destination.prices)))}</strong>
      </div>
      <div className="chart-wrap">
        <svg
          className="price-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={t(`${destination.city} 5주간 항공 가격 변화 그래프`)}
        >
          <defs>
            {/* 선 아래 영역에 적용할 위에서 아래 방향의 그라데이션입니다. */}
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#68b8f5" stopOpacity=".32" />
              <stop offset="1" stopColor="#68b8f5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[padding.top, height / 2, height - padding.bottom].map((y) => (
            // 가격 변화를 읽기 쉽도록 가로 기준선 세 개를 표시합니다.
            <line
              className="chart-grid"
              key={y}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
            />
          ))}
          {/* 가격선 아래를 채운 면과 가격 변화를 연결하는 선을 함께 그립니다. */}
          <polygon className="chart-area" points={areaText} />
          <polyline className="chart-line" points={pointText} />
          {points.map((point, index) => (
            // 각 주차의 점, 가격, 주차 라벨을 하나의 SVG 그룹으로 묶습니다.
            <g key={index}>
              <circle className="chart-point" cx={point.x} cy={point.y} r="6" />
              <text className="chart-price" x={point.x} y={point.y - 15}>
                {formatPrice(destination.prices[index])}</text>
              <text className="chart-label" x={point.x} y={height - 17}>
                {t(index + 1)}{t("주차")}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="chart-note">{t("발표 화면용 예상 가격이며 실제 항공권 가격과 다를 수 있습니다.")}</p>
    </section>
  );
}
