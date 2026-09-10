# 항공편 API 설정

현재 검색 화면은 API 없이 `createFlightSchedules`로 노선별 시간표를 생성합니다. 출발 시각·편명·가격은 생성값이고, 비행시간은 거리 기반 계산값입니다. 공항별 IANA 시간대로 시차·서머타임과 도착 날짜를 반영합니다. 아래 내용은 별도 보관 중인 API 모듈을 다시 연결할 때 참고하는 안내입니다.

프로젝트 루트의 `.env.example`을 참고해 `.env.local`에 본인의 Amadeus 키를 설정한 뒤 개발 서버를 재시작합니다. 키는 서버에서만 읽으며 `VITE_` 접두사를 붙이지 않습니다.

```dotenv
AMADEUS_API_KEY=발급받은_키
AMADEUS_API_SECRET=발급받은_시크릿
AMADEUS_API_BASE_URL=https://test.api.amadeus.com
```

실제 운영 조회는 운영 권한이 있는 키와 `https://api.amadeus.com`을 사용합니다. 테스트 환경은 화면에 `API 테스트 데이터`로 표시합니다. 운영 전환은 계정의 이용 조건과 과금 설정을 확인한 후 직접 설정합니다.

- 공항 목록: `src/data/worldAirports.js`의 유럽 12개, 남미 6개, 아프리카 6개 공항을 기존 목록에 통합합니다.
- 공항 카드와 드롭다운은 등록된 주요 노선 목록이며 모든 노선이나 특정 날짜의 운항을 보장하지 않습니다. 한국에서 남미로 가려면 다구간에서 유럽 등의 경유 공항을 선택합니다.
- 보관된 API 모듈: 서버의 Flight Offers Search 응답에 포함된 운항사·편명·가격·현지시각·예정 소요시간을 처리합니다. 현재 검색 화면에서는 호출하지 않습니다.
- 예산별 여행지와 주별 가격 그래프는 계산된 예상 데이터입니다.
- 현재 예약 기능은 앱 DB 저장 방식입니다. Amadeus의 실제 발권 API까지 연결된 것은 아닙니다.
- API 프록시는 Vite 개발 서버와 preview에서 실행됩니다. 정적 파일만 배포하는 경우 별도 서버 API가 필요합니다.

검증: `node --test src/services/flightApi.test.js`, `npm.cmd run build`

공식 명세: https://github.com/amadeus4dev/amadeus-open-api-specification/blob/main/spec/json/FlightOffersSearch_v2_swagger_specification.json
