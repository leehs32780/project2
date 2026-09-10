// 여기에서 노선 → 좌석 등급 → 출발 시간별 금액을 직접 입력하세요.
// 원화, 성인 1인 해당 구간 금액입니다. 왕복은 가는 편과 오는 편을 합산합니다.
// 반대 방향은 "DXB-ICN"처럼 따로 작성합니다. 입력하지 않은 시간은 자동 계산합니다.
export const customFlightPrices = {
  "ICN-DXB": {
    first: {
      // "06:40": 5800000,
      // "08:15": 6200000,
    },
    business: {},
    economy: {},
  },
};

// 자동 가격용 시간대 배율. 공개된 실시간 운임 통계가 아닌 발표용 설정입니다.
const timeRates = [0.88, 0.92, 0.96, 1, 1.04, 1.08, 1.12, 1.16];
export function getTimeFareRate(departure, arrival, cabin, index) {
  const seed = `${departure}-${arrival}-${cabin}`
    .split("")
    .reduce(
      (value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0,
      0,
    );
  return timeRates[((seed % timeRates.length) + index * 3) % timeRates.length];
}

// 왕복 예상 운임은 귀국 시간대별로 다른 배율을 적용합니다.
// 동일 검색은 항상 같은 가격을 반환하며 시즌 보정이 끝난 금액을 사용합니다.
export function getReturnFare(
  price,
  departure,
  arrival,
  cabin,
  index,
  usedPrices,
) {
  const rates = [0.94, 1.07, 0.97, 1.04, 0.92, 1.09, 1.03, 0.96];
  const seed = `${departure}-${arrival}-${cabin}`
    .split("")
    .reduce(
      (value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0,
      0,
    );
  const slot = (seed + index * 3) % rates.length;
  let candidate = Math.round((price * rates[slot]) / 1000) * 1000;
  let attempt = 0;
  while (usedPrices.has(candidate)) {
    // 충돌 시에도 고정 금액 대신 운임에 비례하는 서로 다른 폭으로 조정합니다.
    const stepRate = 0.017 + ((seed + index + attempt) % 7) * 0.004;
    candidate += Math.max(2000, Math.round((price * stepRate) / 1000) * 1000);
    attempt += 1;
  }
  return candidate;
}
