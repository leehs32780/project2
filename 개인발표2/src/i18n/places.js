export const places = Object.fromEntries(`
아시아|Asia
유럽|Europe
북아메리카|North America
남아메리카|South America
오세아니아|Oceania
아프리카|Africa
대한민국|South Korea
일본|Japan
중국|China
대만|Taiwan
태국|Thailand
베트남|Vietnam
프랑스|France
미국|United States
영국|United Kingdom
말레이시아|Malaysia
필리핀|Philippines
아랍에미리트|United Arab Emirates
독일|Germany
네덜란드|Netherlands
호주|Australia
뉴질랜드|New Zealand
이탈리아|Italy
스페인|Spain
스위스|Switzerland
오스트리아|Austria
체코|Czechia
폴란드|Poland
핀란드|Finland
포르투갈|Portugal
그리스|Greece
브라질|Brazil
아르헨티나|Argentina
칠레|Chile
페루|Peru
콜롬비아|Colombia
남아프리카공화국|South Africa
이집트|Egypt
에티오피아|Ethiopia
케냐|Kenya
모로코|Morocco
서울|Seoul
인천|Incheon
부산|Busan
대구|Daegu
제주|Jeju
청주|Cheongju
여수|Yeosu
광주|Gwangju
김포|Gimpo
김해|Gimhae
충북·대전권|Chungbuk / Daejeon
국내|Domestic
국제|International
장거리|Long haul
도쿄|Tokyo
하네다|Haneda
쑹산|Songshan
오사카|Osaka
후쿠오카|Fukuoka
삿포로|Sapporo
베이징|Beijing
상하이|Shanghai
홍콩|Hong Kong
타이베이|Taipei
방콕|Bangkok
다낭|Da Nang
나트랑|Nha Trang
뉴욕|New York
로스앤젤레스|Los Angeles
파리|Paris
런던|London
싱가포르|Singapore
쿠알라룸푸르|Kuala Lumpur
마닐라|Manila
호찌민|Ho Chi Minh City
하노이|Hanoi
두바이|Dubai
샌프란시스코|San Francisco
프랑크푸르트|Frankfurt
암스테르담|Amsterdam
시드니|Sydney
오클랜드|Auckland
로마|Rome
밀라노|Milan
마드리드|Madrid
바르셀로나|Barcelona
취리히|Zurich
빈|Vienna
뮌헨|Munich
프라하|Prague
바르샤바|Warsaw
헬싱키|Helsinki
리스본|Lisbon
아테네|Athens
상파울루|São Paulo
리우데자네이루|Rio de Janeiro
부에노스아이레스|Buenos Aires
산티아고|Santiago
리마|Lima
보고타|Bogotá
요하네스버그|Johannesburg
케이프타운|Cape Town
카이로|Cairo
아디스아바바|Addis Ababa
나이로비|Nairobi
카사블랑카|Casablanca
대한항공|Korean Air
아시아나항공|Asiana Airlines
에어프레미아|Air Premia
제주항공|Jeju Air
진에어|Jin Air
티웨이항공|T'way Air
에어부산|Air Busan
이스타항공|Eastar Jet
에어서울|Air Seoul
에어로케이|Aero K
일본항공|Japan Airlines
전일본공수|ANA
피치항공|Peach Aviation
집에어|ZIPAIR
에티오피아항공|Ethiopian Airlines
에어차이나|Air China
중국동방항공|China Eastern Airlines
캐세이퍼시픽|Cathay Pacific
중화항공|China Airlines
에바항공|EVA Air
타이거에어 타이완|Tigerair Taiwan
싱가포르항공|Singapore Airlines
스쿠트항공|Scoot
타이항공|Thai Airways
베트남항공|Vietnam Airlines
비엣젯항공|VietJet Air
필리핀항공|Philippine Airlines
세부퍼시픽|Cebu Pacific
말레이시아항공|Malaysia Airlines
에어아시아|AirAsia
에미레이트항공|Emirates
유나이티드항공|United Airlines
델타항공|Delta Air Lines
에어프랑스|Air France
영국항공|British Airways
루프트한자|Lufthansa
KLM 네덜란드항공|KLM Royal Dutch Airlines
콴타스항공|Qantas
에어뉴질랜드|Air New Zealand
ITA 항공|ITA Airways
이베리아항공|Iberia
부엘링항공|Vueling
스위스 국제항공|SWISS
오스트리아항공|Austrian Airlines
스마트윙스|Smartwings
LOT 폴란드항공|LOT Polish Airlines
핀에어|Finnair
TAP 포르투갈항공|TAP Air Portugal
에게항공|Aegean Airlines
LATAM 항공|LATAM Airlines
골항공|GOL
아르헨티나항공|Aerolíneas Argentinas
아비앙카항공|Avianca
남아프리카항공|South African Airways
플라이사페어|FlySafair
이집트항공|EgyptAir
케냐항공|Kenya Airways
로열 에어 모로코|Royal Air Maroc
인천광역시 영종구 공항로 271 (제1여객터미널)|271 Gonghang-ro, Yeongjong-gu, Incheon (Terminal 1)
인천광역시 영종구 제2터미널대로 446 (제2여객터미널)|446 Je2terminal-daero, Yeongjong-gu, Incheon (Terminal 2)
서울 강서구 하늘길 38|38 Haneul-gil, Gangseo-gu, Seoul
대구 동구 공항로 221|221 Gonghang-ro, Dong-gu, Daegu
부산 강서구 공항진입로 108|108 Gonghangjinip-ro, Gangseo-gu, Busan
제주 제주시 공항로 2 제주국제공항|Jeju International Airport, 2 Gonghang-ro, Jeju-si
충북 청주시 청원구 내수읍 오창대로 980 5-4|980-5-4 Ochang-daero, Naesu-eup, Cheongwon-gu, Cheongju, Chungbuk
전라남도 여수시 율촌면 여순로 386|386 Yeosun-ro, Yulchon-myeon, Yeosu, Jeollanam-do
광주광역시 광산구 상무대로 420-25|420-25 Sangmu-daero, Gwangsan-gu, Gwangju
`.trim().split('\n').map(line => line.split('|')));
