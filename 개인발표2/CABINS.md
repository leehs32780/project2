# 좌석 등급 데이터

검색창은 `getAvailableCabins`로 여정의 모든 구간을 확인하고, 퍼스트 제공 항공사가 있는 경우에만 퍼스트 클래스를 표시합니다. 검색 결과도 같은 조건을 사용합니다. 노선 변경으로 선택 등급이 없어지면 일반석으로 돌아갑니다.

실시간 운항·예약 API가 아닌 수동 노선 목록입니다. 등록되지 않은 노선은 퍼스트를 표시하지 않으며, 개별 항공편의 기종이나 잔여석을 보장하지 않습니다.

## 퍼스트 참고 운임 (현재 검색 방식)

사용자 요청에 따라 실시간 API 전용 검색을 해제했습니다. `src/data/firstClassPricing.js`에 공개 평균 4건과 공시 운임 1건을 저장하여 네트워크 없이 검색합니다. 각 자료의 원금액·통화·집계 기준·출처와 확인일을 함께 보존합니다.

시간대별 가격은 `src/data/customFlightPrices.js`에서 수정합니다. `customFlightPrices`에 노선 방향 → 좌석 등급 → 출발 시간을 키로 원화 금액을 입력하면 최우선 적용됩니다. 미입력 시간은 모든 등급에 0.88~1.16의 발표용 시간대 배율을 적용합니다. 공개 참고 기준가 자체는 보존하며, 화면에서 시간대별 예상 가격과 직접 설정 가격을 구분합니다. 실제 시간대별 시장 운임 통계가 아닙니다.

- 미국→한국 퍼스트 왕복 평균: USD 24,304 (KAYAK)
- 뉴욕→파리 퍼스트 왕복 평균: USD 25,543 (KAYAK)
- 런던→싱가포르 퍼스트 왕복 평균: GBP 13,207 (KAYAK)
- 독일→로스앤젤레스 퍼스트 왕복 평균: EUR 12,864 (KAYAK)
- 인천→두바이 공시 운임: 편도 KRW 6,021,000 / 왕복 KRW 8,726,800. 2025년 에미레이트 운임표이며 세금 별도, 평균 통계가 아닙니다.

KAYAK 평균은 원문 기준 최근 2주 자료이고 도시/국가 단위로 경유편도 포함할 수 있습니다. 출발 방향과 항공사별 차이는 별도로 확보하지 못했습니다. 이를 특정 직항 항공편의 실제 평균으로 표시하지 않습니다.

환율은 2026-09-07 공개 환율 USD/KRW 1346.56492, USD/GBP 0.739722, USD/EUR 0.861072를 고정 저장했습니다. 출처: https://open.er-api.com/v6/latest/USD (제공자: https://www.exchangerate-api.com).

왕복 평균을 반으로 나눈 것은 **구간 참고가를 위한 가정**이며 실제 편도 평균이 아닙니다. 공시 편도 운임이 있는 인천–두바이는 편도에 그 값을 쓰고 왕복은 왕복 운임을 두 구간에 배분합니다. 비교 가능한 시장 자료가 없는 노선은 공개 운임에 거리 비율(0.35~1.4 범위)을 적용한 유사 노선 추정입니다. 이 범위와 기준 거리들은 앱의 모델 가정이며 외부 관측값이 아닙니다. 화면에서도 구분하며, 실제 날짜별 운항 시간·잔여석은 보장하지 않습니다.

## 보관된 선택적 운영 API 연결 코드

`fetchDirectFlights`는 Amadeus 운영 Flight Offers Search에 선택 날짜, 성인 1명, FIRST, KRW, 직항 조건으로 요청하는 선택적 함수입니다. 현재 검색 화면에서는 호출하지 않습니다. 응답의 구간별 cabin도 FIRST인지 검증합니다.

로컬 실행에는 `.env.local`에 `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`와 `AMADEUS_API_BASE_URL=https://api.amadeus.com` 설정 후 개발 서버 재시작이 필요합니다. 운영 계정의 실제 키가 필요하며 테스트 키로 주소만 변경해서는 사용할 수 없습니다. 비밀 키는 브라우저 코드에 넣지 않습니다. 정적 배포에는 별도의 API 서버가 필요합니다(현재 Vite 개발·미리보기 미들웨어 사용).

설정 누락·오류·테스트 환경·빈 결과는 추정 가격으로 대체하지 않습니다. API 공급 범위 밖의 항공사 가격은 확인할 수 없습니다.

요청 및 응답 스키마: https://github.com/amadeus4dev/amadeus-open-api-specification/blob/main/spec/json/FlightOffersSearch_v2_swagger_specification.json

## 2026-09-07 보완한 노선과 공식 출처

- 에미레이트 인천–두바이: https://www.emirates.com/english/destinations/dxb/icn/flights-from-dubai-to-seoul/
- 싱가포르항공 싱가포르–암스테르담: 2026-07-01부터 First Class 도입. https://www.singaporeair.com/en_UK/sg/corporate/newsroom/press-release/2026/january---march-2026/network_adjustments_2026_northern_summer/

기존 등록 노선은 이번 변경에서 전체 재검증하지 않았습니다. 새 노선은 `src/data/cabinData.js`에 항공사와 공항 쌍을 등록하고, 도입일이 있으면 `availableFrom`을 지정합니다.
