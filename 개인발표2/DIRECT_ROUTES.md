# 직항 노선 데이터

확인일: 2026-09-07

앱에 등록된 60개 공항의 FlightsFrom 무착륙 목적지 목록을 대조하여 `src/data/directRoutes.js`에 저장했다. 앱 밖의 공항은 제외하고, 같은 공항 쌍은 양방향 한 노선으로 집계한다. 총 721개 공항 쌍이다.

계절 운항을 포함한 정적 노선 목록이다. 날짜별 실제 운항 여부나 전 세계 전체 노선 수를 뜻하지 않는다. 확인일 이후 취항 예정으로 표시된 바르샤바–하노이와 삿포로–샌프란시스코는 제외했다. 시간표는 기존 로컬 생성 방식을 유지한다.

카드 표시, 직항 목적지 선택, 경유지 이후 목적지 선택, 시간표 생성은 동일한 노선 목록을 사용한다. 항공사 매핑만 남아 있는 미등록 노선에는 시간표를 생성하지 않는다.

## 확인한 공항별 출처

- [ICN 무착륙 목적지](https://www.flightsfrom.com/ICN/destinations)
- [GMP 무착륙 목적지](https://www.flightsfrom.com/GMP/destinations)
- [TAE 무착륙 목적지](https://www.flightsfrom.com/TAE/destinations)
- [PUS 무착륙 목적지](https://www.flightsfrom.com/PUS/destinations)
- [CJU 무착륙 목적지](https://www.flightsfrom.com/CJU/destinations)
- [CJJ 무착륙 목적지](https://www.flightsfrom.com/CJJ/destinations)
- [RSU 무착륙 목적지](https://www.flightsfrom.com/RSU/destinations)
- [KWJ 무착륙 목적지](https://www.flightsfrom.com/KWJ/destinations)
- [FCO 무착륙 목적지](https://www.flightsfrom.com/FCO/destinations)
- [MXP 무착륙 목적지](https://www.flightsfrom.com/MXP/destinations)
- [MAD 무착륙 목적지](https://www.flightsfrom.com/MAD/destinations)
- [BCN 무착륙 목적지](https://www.flightsfrom.com/BCN/destinations)
- [ZRH 무착륙 목적지](https://www.flightsfrom.com/ZRH/destinations)
- [VIE 무착륙 목적지](https://www.flightsfrom.com/VIE/destinations)
- [MUC 무착륙 목적지](https://www.flightsfrom.com/MUC/destinations)
- [PRG 무착륙 목적지](https://www.flightsfrom.com/PRG/destinations)
- [WAW 무착륙 목적지](https://www.flightsfrom.com/WAW/destinations)
- [HEL 무착륙 목적지](https://www.flightsfrom.com/HEL/destinations)
- [LIS 무착륙 목적지](https://www.flightsfrom.com/LIS/destinations)
- [ATH 무착륙 목적지](https://www.flightsfrom.com/ATH/destinations)
- [GRU 무착륙 목적지](https://www.flightsfrom.com/GRU/destinations)
- [GIG 무착륙 목적지](https://www.flightsfrom.com/GIG/destinations)
- [EZE 무착륙 목적지](https://www.flightsfrom.com/EZE/destinations)
- [SCL 무착륙 목적지](https://www.flightsfrom.com/SCL/destinations)
- [LIM 무착륙 목적지](https://www.flightsfrom.com/LIM/destinations)
- [BOG 무착륙 목적지](https://www.flightsfrom.com/BOG/destinations)
- [JNB 무착륙 목적지](https://www.flightsfrom.com/JNB/destinations)
- [CPT 무착륙 목적지](https://www.flightsfrom.com/CPT/destinations)
- [CAI 무착륙 목적지](https://www.flightsfrom.com/CAI/destinations)
- [ADD 무착륙 목적지](https://www.flightsfrom.com/ADD/destinations)
- [NBO 무착륙 목적지](https://www.flightsfrom.com/NBO/destinations)
- [CMN 무착륙 목적지](https://www.flightsfrom.com/CMN/destinations)
- [NRT 무착륙 목적지](https://www.flightsfrom.com/NRT/destinations)
- [HND 무착륙 목적지](https://www.flightsfrom.com/HND/destinations)
- [KIX 무착륙 목적지](https://www.flightsfrom.com/KIX/destinations)
- [FUK 무착륙 목적지](https://www.flightsfrom.com/FUK/destinations)
- [CTS 무착륙 목적지](https://www.flightsfrom.com/CTS/destinations)
- [PEK 무착륙 목적지](https://www.flightsfrom.com/PEK/destinations)
- [PVG 무착륙 목적지](https://www.flightsfrom.com/PVG/destinations)
- [HKG 무착륙 목적지](https://www.flightsfrom.com/HKG/destinations)
- [TPE 무착륙 목적지](https://www.flightsfrom.com/TPE/destinations)
- [TSA 무착륙 목적지](https://www.flightsfrom.com/TSA/destinations)
- [BKK 무착륙 목적지](https://www.flightsfrom.com/BKK/destinations)
- [DAD 무착륙 목적지](https://www.flightsfrom.com/DAD/destinations)
- [CXR 무착륙 목적지](https://www.flightsfrom.com/CXR/destinations)
- [JFK 무착륙 목적지](https://www.flightsfrom.com/JFK/destinations)
- [LAX 무착륙 목적지](https://www.flightsfrom.com/LAX/destinations)
- [CDG 무착륙 목적지](https://www.flightsfrom.com/CDG/destinations)
- [LHR 무착륙 목적지](https://www.flightsfrom.com/LHR/destinations)
- [SIN 무착륙 목적지](https://www.flightsfrom.com/SIN/destinations)
- [KUL 무착륙 목적지](https://www.flightsfrom.com/KUL/destinations)
- [MNL 무착륙 목적지](https://www.flightsfrom.com/MNL/destinations)
- [SGN 무착륙 목적지](https://www.flightsfrom.com/SGN/destinations)
- [HAN 무착륙 목적지](https://www.flightsfrom.com/HAN/destinations)
- [DXB 무착륙 목적지](https://www.flightsfrom.com/DXB/destinations)
- [SFO 무착륙 목적지](https://www.flightsfrom.com/SFO/destinations)
- [FRA 무착륙 목적지](https://www.flightsfrom.com/FRA/destinations)
- [AMS 무착륙 목적지](https://www.flightsfrom.com/AMS/destinations)
- [SYD 무착륙 목적지](https://www.flightsfrom.com/SYD/destinations)
- [AKL 무착륙 목적지](https://www.flightsfrom.com/AKL/destinations)

## 검증

## 가격과 소요시간

`routeDurations.js`는 위 공항별 출처의 방향별 Flight time을 분 단위로 보관한다. `appData.js`는 이를 우선 사용하며, 누락된 방향은 역방향 대표값을 참고하고 물리적으로 지나치게 짧은 값은 거리 계산으로 대체한다. 실제 운항일·편명별 시간이 아닌 대표값이다. 도착 시각은 소요시간을 UTC에 더한 후 도착 공항 시간대와 서머타임으로 변환한다.

`routePricing.js`는 일반석 1인 편도 원화 기준의 추정 모델이다. 전 노선의 실판매가를 수집한 것은 아니다. 지역·거리별 기준값과 대표 노선 보정에 기존 출발일·예약 임박·항공사·시간대 계수를 적용한다. 아래 공개 판매가의 가격대를 참고했으며, 왕복 특가와 편도 운임은 동일하지 않으므로 그대로 복사하지 않았다. 외화 가격은 정확한 실시간 환율 환산값으로 사용하지 않는다.

- [대한항공 인천–파리](https://www.koreanair.com/flights/en-kr/flights-from-seoul-to-paris): 왕복 일반석 1,327,300원부터.
- [대한항공 인천–도쿄](https://www.koreanair.com/flights/en-kr/flights-from-seoul-to-tokyo): 왕복 일반석 469,600원부터.
- [대한항공 공개 운임](https://www.koreanair.com/flights/en-kr/?subfolder=flights): 인천–LA 왕복 일반석 1,477,900원부터.
- [루프트한자 로마 운임](https://www.lufthansa.com/lhg/de/en/dest/cy/rome): 프랑크푸르트 출발 164유로부터.
- [LATAM 상파울루–산티아고](https://www.latamairlines.com/br/pt/destinos/chile/voos-de-sao-paulo-para-santiago): 1,990.59 BRL부터.
- [남아프리카항공 요하네스버그–케이프타운](https://www.flysaa.com/en-za/flights-from-johannesburg-to-cape-town): 1,960 ZAR부터.

운임 참고일: 2026-09-07. 위 금액은 공개 특가이며 날짜·재고에 따라 바뀐다.

`node --test src/data/directRoutes.test.js src/services/flightApi.test.js`

60개 공항의 카드와 목적지 목록 일치, 양방향 연결, 공항 코드 유효성, 미취항 노선 제외 및 전체 등록 노선의 시간표 생성을 검사한다.
