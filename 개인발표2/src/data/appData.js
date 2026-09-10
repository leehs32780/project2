import { worldAirports } from "./worldAirports.js";
import { formatMoney } from "../i18n/locale.js";
import { directRouteKeys } from "./directRoutes.js";
import { routeDurationMinutes } from "./routeDurations.js";
import { getRouteBaseFare } from "./routePricing.js";
import { getFirstClassReferenceFare } from "./firstClassPricing.js";
import { getSeasonPricing } from "./seasonPricing.js";
import {
  customFlightPrices,
  getTimeFareRate,
  getReturnFare,
} from "./customFlightPrices.js";
import {
  cabinLabels,
  getFirstClassCarriers,
  hasBusinessCabin,
  getCabinFareRate,
} from "./cabinData.js";
import {
  worldScheduleData,
  worldAirlines,
  getWorldRouteCarrier,
} from "./worldScheduleData.js";

// ============================================================
// 1. 공항 및 직항 노선 데이터
// ============================================================
export const airports = [
  {
    code: "ICN",
    name: "인천국제공항",
    area: "서울·인천",
    routes: [
      { type: "일본", cities: "도쿄 · 오사카 · 후쿠오카 · 삿포로" },
      { type: "아시아", cities: "베이징 · 상하이 · 타이베이 · 방콕 · 다낭" },
      { type: "장거리", cities: "뉴욕 · 로스앤젤레스 · 파리 · 런던" },
    ],
  },
  {
    code: "GMP",
    name: "김포국제공항",
    area: "서울",
    routes: [
      { type: "국내", cities: "제주 · 부산 · 여수" },
      {
        type: "국제",
        cities: "도쿄(하네다) · 오사카 · 베이징 · 상하이 · 타이베이(쑹산)",
      },
    ],
  },
  {
    code: "TAE",
    name: "대구국제공항",
    area: "대구",
    routes: [
      { type: "국내", cities: "제주" },
      { type: "국제", cities: "도쿄 · 오사카 · 타이베이 · 다낭" },
    ],
  },
  {
    code: "PUS",
    name: "김해국제공항",
    area: "부산",
    routes: [
      { type: "국내", cities: "제주 · 김포" },
      {
        type: "국제",
        cities: "도쿄 · 오사카 · 후쿠오카 · 타이베이 · 방콕 · 다낭",
      },
    ],
  },
  {
    code: "CJU",
    name: "제주국제공항",
    area: "제주",
    routes: [
      { type: "국내", cities: "김포 · 김해 · 대구 · 청주 · 광주" },
      { type: "국제", cities: "도쿄 · 오사카 · 타이베이 · 상하이 · 홍콩" },
    ],
  },
  {
    code: "CJJ",
    name: "청주국제공항",
    area: "충북·대전권",
    routes: [
      { type: "국내", cities: "제주" },
      { type: "국제", cities: "도쿄 · 오사카 · 타이베이 · 다낭 · 나트랑" },
    ],
  },
];

export const airportEnglishNames = {
  ...Object.fromEntries(
    worldAirports.map((airport) => [airport.code, airport.englishName]),
  ),
  ICN: "Incheon International Airport",
  GMP: "Gimpo International Airport",
  TAE: "Daegu International Airport",
  PUS: "Gimhae International Airport",
  CJU: "Jeju International Airport",
  CJJ: "Cheongju International Airport",
  RSU: "Yeosu Airport",
  KWJ: "Gwangju Airport",
  NRT: "Narita International Airport",
  HND: "Tokyo Haneda Airport",
  KIX: "Kansai International Airport",
  FUK: "Fukuoka Airport",
  CTS: "New Chitose Airport",
  PEK: "Beijing Capital International Airport",
  PVG: "Shanghai Pudong International Airport",
  HKG: "Hong Kong International Airport",
  TPE: "Taiwan Taoyuan International Airport",
  TSA: "Taipei Songshan Airport",
  BKK: "Suvarnabhumi Airport",
  DAD: "Da Nang International Airport",
  CXR: "Cam Ranh International Airport",
  JFK: "John F. Kennedy International Airport",
  LAX: "Los Angeles International Airport",
  CDG: "Paris Charles de Gaulle Airport",
  LHR: "London Heathrow Airport",
  SIN: "Singapore Changi Airport",
  KUL: "Kuala Lumpur International Airport",
  MNL: "Ninoy Aquino International Airport",
  SGN: "Tan Son Nhat International Airport",
  HAN: "Noi Bai International Airport",
  DXB: "Dubai International Airport",
  SFO: "San Francisco International Airport",
  FRA: "Frankfurt Airport",
  AMS: "Amsterdam Airport Schiphol",
  SYD: "Sydney Airport",
  AKL: "Auckland Airport",
};

// 노선 검색 결과에서 도착지별로 보여 주는 대표 관광지입니다.
export const destinationCityNames = {
  ...Object.fromEntries(
    worldAirports.map((airport) => [airport.code, airport.city]),
  ),
  ICN: "인천",
  GMP: "서울",
  PUS: "부산",
  TAE: "대구",
  CJU: "제주",
  CJJ: "청주",
  RSU: "여수",
  KWJ: "광주",
  NRT: "도쿄",
  HND: "도쿄",
  KIX: "오사카",
  FUK: "후쿠오카",
  CTS: "삿포로",
  PEK: "베이징",
  PVG: "상하이",
  HKG: "홍콩",
  TPE: "타이베이",
  TSA: "타이베이",
  BKK: "방콕",
  DAD: "다낭",
  CXR: "나트랑",
  JFK: "뉴욕",
  LAX: "로스앤젤레스",
  CDG: "파리",
  LHR: "런던",
  SIN: "싱가포르",
  KUL: "쿠알라룸푸르",
  MNL: "마닐라",
  SGN: "호찌민",
  HAN: "하노이",
  DXB: "두바이",
  SFO: "샌프란시스코",
  FRA: "프랑크푸르트",
  AMS: "암스테르담",
  SYD: "시드니",
  AKL: "오클랜드",
};

export const destinationAttractions = {
  ICN: ["송도 센트럴파크", "월미도", "차이나타운", "을왕리 해수욕장"],
  GMP: ["경복궁", "남산서울타워", "북촌한옥마을", "한강공원"],
  PUS: ["해운대", "광안리", "감천문화마을", "태종대"],
  TAE: ["앞산전망대", "서문시장", "수성못", "김광석길"],
  CJU: ["성산일출봉", "협재해수욕장", "한라산", "우도"],
  CJJ: ["청남대", "수암골", "상당산성", "국립현대미술관 청주"],
  RSU: ["여수 해상케이블카", "오동도", "향일암", "낭만포차거리"],
  KWJ: ["국립아시아문화전당", "무등산", "양림동 역사문화마을", "충장로"],
  NRT: [
    "도쿄 스카이트리",
    "아사쿠사 센소지",
    "시부야 스크램블",
    "도쿄 디즈니리조트",
  ],
  HND: ["도쿄타워", "메이지 신궁", "오다이바", "긴자"],
  KIX: ["오사카성", "도톤보리", "유니버설 스튜디오 재팬", "신세카이"],
  FUK: ["오호리공원", "다자이후 텐만구", "후쿠오카타워", "캐널시티 하카타"],
  CTS: ["오도리공원", "삿포로 맥주박물관", "모이와산", "시로이 코이비토 파크"],
  PEK: ["자금성", "만리장성", "천안문 광장", "이화원"],
  PVG: ["와이탄", "예원", "상하이 타워", "신천지"],
  HKG: ["빅토리아 피크", "침사추이", "홍콩 디즈니랜드", "란타우섬"],
  TPE: ["타이베이 101", "국립고궁박물원", "스린 야시장", "중정기념당"],
  TSA: ["용산사", "시먼딩", "송산문창원구", "라오허제 야시장"],
  BKK: ["왕궁", "왓 아룬", "왓 포", "짜뚜짝 시장"],
  DAD: ["미케비치", "바나힐", "오행산", "용다리"],
  CXR: ["나트랑 해변", "포나가르 사원", "혼똔섬", "롱선사"],
  JFK: ["자유의 여신상", "센트럴파크", "타임스스퀘어", "브루클린 브리지"],
  LAX: ["할리우드", "산타모니카 해변", "그리피스 천문대", "게티 센터"],
  CDG: ["에펠탑", "루브르 박물관", "몽마르트르", "개선문"],
  LHR: ["빅벤", "버킹엄 궁전", "타워 브리지", "대영박물관"],
  SIN: ["마리나 베이 샌즈", "가든스 바이 더 베이", "센토사", "머라이언 파크"],
  KUL: ["페트로나스 트윈 타워", "바투 동굴", "메르데카 광장", "부킷 빈탕"],
  MNL: ["인트라무로스", "리잘 공원", "마닐라 대성당", "마닐라 베이"],
  SGN: ["통일궁", "벤탄시장", "사이공 중앙우체국", "노트르담 대성당"],
  HAN: ["호안끼엠 호수", "하노이 올드쿼터", "호찌민 묘소", "문묘"],
  DXB: ["부르즈 할리파", "두바이 몰", "팜 주메이라", "두바이 마리나"],
  SFO: ["금문교", "피셔맨스 워프", "알카트라즈", "유니언 스퀘어"],
  FRA: ["뢰머 광장", "프랑크푸르트 대성당", "마인 타워", "괴테 하우스"],
  AMS: ["국립미술관", "반 고흐 미술관", "운하 지구", "담 광장"],
  SYD: ["오페라 하우스", "하버 브리지", "본다이 비치", "달링 하버"],
  AKL: ["스카이 타워", "와이헤케섬", "마운트 이든", "오클랜드 전쟁기념박물관"],
};

// ============================================================
// 2. 인기 여행지와 가격 그래프 데이터
// ============================================================
export const destinations = [
  {
    id: "tokyo",
    country: "일본",
    city: "도쿄",
    from: 198000,
    prices: [238000, 219000, 198000, 225000, 247000],
  },
  {
    id: "paris",
    country: "프랑스",
    city: "파리",
    from: 892000,
    prices: [965000, 928000, 892000, 910000, 948000],
  },
  {
    id: "newyork",
    country: "미국",
    city: "뉴욕",
    from: 1120000,
    prices: [1240000, 1185000, 1120000, 1168000, 1215000],
  },
];

export const airportAddresses = {
  ICN: "인천광역시 영종구 공항로 271 (제1여객터미널)\n인천광역시 영종구 제2터미널대로 446 (제2여객터미널)",
  GMP: "서울 강서구 하늘길 38",
  TAE: "대구 동구 공항로 221",
  PUS: "부산 강서구 공항진입로 108",
  CJU: "제주 제주시 공항로 2 제주국제공항",
  CJJ: "충북 청주시 청원구 내수읍 오창대로 980 5-4",
  RSU: "전라남도 여수시 율촌면 여순로 386",
  KWJ: "광주광역시 광산구 상무대로 420-25",
  NRT: "1-1 Furugome, Narita, Chiba 282-0004, Japan",
  HND: "Hanedakuko, Ota City, Tokyo 144-0041, Japan",
  KIX: "1 Senshukukokita, Izumisano, Osaka 549-0001, Japan",
  FUK: "778-1 Shimousui, Hakata Ward, Fukuoka, Japan",
  CTS: "Bibi, Chitose, Hokkaido 066-0012, Japan",
  PEK: "Shunyi District, Beijing 100621, China",
  PVG: "6000 Yingbin Avenue, Pudong, Shanghai, China",
  HKG: "1 Sky Plaza Road, Chek Lap Kok, Hong Kong",
  TPE: "No. 9, Hangzhan South Road, Dayuan District, Taoyuan, Taiwan",
  TSA: "No. 340-9, Dunhua North Road, Songshan District, Taipei, Taiwan",
  BKK: "999 Nong Prue, Bang Phli District, Samut Prakan 10540, Thailand",
  DAD: "Nguyen Van Linh, Hai Chau District, Da Nang, Vietnam",
  CXR: "Nguyen Tat Thanh, Cam Hai Dong, Khanh Hoa, Vietnam",
  JFK: "Queens, New York 11430, United States",
  LAX: "1 World Way, Los Angeles, California 90045, United States",
  CDG: "95700 Roissy-en-France, France",
  LHR: "Hounslow TW6, United Kingdom",
  SIN: "Airport Boulevard, Singapore 819643",
  KUL: "64000 Sepang, Selangor, Malaysia",
  MNL: "Pasay and Paranaque, Metro Manila, Philippines",
  SGN: "Truong Son, Tan Binh District, Ho Chi Minh City, Vietnam",
  HAN: "Phu Minh, Soc Son District, Hanoi, Vietnam",
  DXB: "Dubai International Airport, Dubai, United Arab Emirates",
  SFO: "San Francisco, California 94128, United States",
  FRA: "60547 Frankfurt am Main, Germany",
  AMS: "Evert van de Beekstraat 202, 1118 CP Schiphol, Netherlands",
  SYD: "Mascot, New South Wales 2020, Australia",
  AKL: "Ray Emery Drive, Māngere, Auckland 2022, New Zealand",
};

// ============================================================
// 3. 공통 설정: 가격 표시, 항공사, 배경 영상
// ============================================================
export const formatPrice = formatMoney;

export const airlines = [
  ...worldAirlines,
  { name: "대한항공", code: "KE", color: "#1976c9" },
  { name: "아시아나항공", code: "OZ", color: "#c52b36" },
  { name: "에어프레미아", code: "YP", color: "#2f2a8f" },
  { name: "제주항공", code: "7C", color: "#f26b21" },
  { name: "진에어", code: "LJ", color: "#5a9f38" },
  { name: "티웨이항공", code: "TW", color: "#d92832" },
  { name: "에어부산", code: "BX", color: "#245ea8" },
  { name: "이스타항공", code: "ZE", color: "#d9232e" },
  { name: "에어서울", code: "RS", color: "#20a887" },
  { name: "에어로케이", code: "RF", color: "#6d38a8" },
  { name: "일본항공", code: "JL", color: "#d71920" },
  { name: "전일본공수", code: "NH", color: "#1557a0" },
  { name: "피치항공", code: "MM", color: "#b51883" },
  { name: "집에어", code: "ZG", color: "#272727" },
  { name: "에티오피아항공", code: "ET", color: "#d4a017" },
  { name: "에어차이나", code: "CA", color: "#b51f2e" },
  { name: "중국동방항공", code: "MU", color: "#2455a4" },
  { name: "캐세이퍼시픽", code: "CX", color: "#006564" },
  { name: "중화항공", code: "CI", color: "#e05a63" },
  { name: "에바항공", code: "BR", color: "#16835b" },
  { name: "타이거에어 타이완", code: "IT", color: "#f58220" },
  { name: "싱가포르항공", code: "SQ", color: "#d8a526" },
  { name: "스쿠트항공", code: "TR", color: "#f3c400" },
  { name: "타이항공", code: "TG", color: "#6b348b" },
  { name: "베트남항공", code: "VN", color: "#1686a7" },
  { name: "비엣젯항공", code: "VJ", color: "#d71920" },
  { name: "필리핀항공", code: "PR", color: "#003876" },
  { name: "세부퍼시픽", code: "5J", color: "#72be44" },
  { name: "말레이시아항공", code: "MH", color: "#cc163f" },
  { name: "에어아시아", code: "AK", color: "#e31b23" },
  { name: "에미레이트항공", code: "EK", color: "#d71920" },
  { name: "유나이티드항공", code: "UA", color: "#005daa" },
  { name: "델타항공", code: "DL", color: "#c8102e" },
  { name: "에어프랑스", code: "AF", color: "#002157" },
  { name: "영국항공", code: "BA", color: "#075aaa" },
  { name: "루프트한자", code: "LH", color: "#05164d" },
  { name: "KLM 네덜란드항공", code: "KL", color: "#00a1de" },
  { name: "콴타스항공", code: "QF", color: "#e4002b" },
  { name: "에어뉴질랜드", code: "NZ", color: "#111111" },
];

export const travelScenes = [
  "/videos/travel-resort.mp4",
  "/videos/travel-mountain.mp4",
  "/videos/travel-flight.mp4",
];

// ============================================================
// 4. 도착 도시별 국가·공항명·공항 코드
// ============================================================
export const countryByCity = {
  ...Object.fromEntries(
    worldAirports.map((airport) => [airport.city, airport.country]),
  ),
  도쿄: "일본",
  오사카: "일본",
  후쿠오카: "일본",
  삿포로: "일본",
  베이징: "중국",
  상하이: "중국",
  홍콩: "홍콩",
  타이베이: "대만",
  방콕: "태국",
  다낭: "베트남",
  나트랑: "베트남",
  뉴욕: "미국",
  로스앤젤레스: "미국",
  파리: "프랑스",
  런던: "영국",
  싱가포르: "싱가포르",
  쿠알라룸푸르: "말레이시아",
  마닐라: "필리핀",
  호찌민: "베트남",
  하노이: "베트남",
  두바이: "아랍에미리트",
  샌프란시스코: "미국",
  프랑크푸르트: "독일",
  암스테르담: "네덜란드",
  시드니: "호주",
  오클랜드: "뉴질랜드",
};

export const destinationAirports = {
  ...Object.fromEntries(
    worldAirports.map((airport) => [
      airport.city,
      [airport.name, airport.code],
    ]),
  ),
  도쿄: ["나리타 국제공항", "NRT"],
  "도쿄(하네다)": ["하네다 국제공항", "HND"],
  오사카: ["간사이 국제공항", "KIX"],
  후쿠오카: ["후쿠오카 공항", "FUK"],
  삿포로: ["신치토세 공항", "CTS"],
  베이징: ["베이징 수도 국제공항", "PEK"],
  상하이: ["상하이 푸동 국제공항", "PVG"],
  홍콩: ["홍콩 국제공항", "HKG"],
  타이베이: ["타이완 타오위안 국제공항", "TPE"],
  "타이베이(쑹산)": ["타이베이 쑹산 공항", "TSA"],
  방콕: ["수완나품 국제공항", "BKK"],
  다낭: ["다낭 국제공항", "DAD"],
  나트랑: ["깜라인 국제공항", "CXR"],
  뉴욕: ["존 F. 케네디 국제공항", "JFK"],
  로스앤젤레스: ["로스앤젤레스 국제공항", "LAX"],
  파리: ["샤를 드골 국제공항", "CDG"],
  런던: ["런던 히드로 국제공항", "LHR"],
  싱가포르: ["싱가포르 창이 국제공항", "SIN"],
  쿠알라룸푸르: ["쿠알라룸푸르 국제공항", "KUL"],
  마닐라: ["니노이 아키노 국제공항", "MNL"],
  호찌민: ["떤선녓 국제공항", "SGN"],
  하노이: ["노이바이 국제공항", "HAN"],
  두바이: ["두바이 국제공항", "DXB"],
  샌프란시스코: ["샌프란시스코 국제공항", "SFO"],
  프랑크푸르트: ["프랑크푸르트 국제공항", "FRA"],
  암스테르담: ["암스테르담 스키폴 국제공항", "AMS"],
  시드니: ["시드니 국제공항", "SYD"],
  오클랜드: ["오클랜드 국제공항", "AKL"],
};

export const domesticAirports = {
  김포: ["김포국제공항", "GMP"],
  부산: ["김해국제공항", "PUS"],
  김해: ["김해국제공항", "PUS"],
  대구: ["대구국제공항", "TAE"],
  제주: ["제주국제공항", "CJU"],
  청주: ["청주국제공항", "CJJ"],
  여수: ["여수공항", "RSU"],
  광주: ["광주공항", "KWJ"],
};

// 검색에 등장하는 국내·해외 공항을 하나의 목록으로 합칩니다.
// 같은 공항 코드가 여러 노선에 있어도 선택 목록에는 한 번만 표시됩니다.
export const allRouteAirports = Array.from(
  new Map(
    [
      ...airports.map((airport) => ({
        code: airport.code,
        name: airport.name,
        city: destinationCityNames[airport.code] ?? airport.area,
        country: "대한민국",
      })),
      ...Object.entries(domesticAirports).map(([city, [name, code]]) => ({
        code,
        name,
        city,
        country: "대한민국",
      })),
      ...Object.entries(destinationAirports).map(([city, [name, code]]) => {
        const baseCity = city.replace(/\(.+\)/, "");
        return {
          code,
          name,
          city: baseCity,
          country: countryByCity[baseCity] ?? baseCity,
        };
      }),
    ].map((airport) => [airport.code, airport]),
  ).values(),
);

const koreaAirports = ["ICN", "GMP", "PUS", "TAE", "CJU", "CJJ", "RSU", "KWJ"];
// 공항별 현지 시각을 계산하기 위한 IANA 표준 시간대입니다.
const airportTimeZones = {
  ...Object.fromEntries(
    Object.entries(worldScheduleData).map(([code, values]) => [
      code,
      values[0],
    ]),
  ),
  ICN: "Asia/Seoul",
  GMP: "Asia/Seoul",
  PUS: "Asia/Seoul",
  TAE: "Asia/Seoul",
  CJU: "Asia/Seoul",
  CJJ: "Asia/Seoul",
  RSU: "Asia/Seoul",
  KWJ: "Asia/Seoul",
  NRT: "Asia/Tokyo",
  HND: "Asia/Tokyo",
  KIX: "Asia/Tokyo",
  FUK: "Asia/Tokyo",
  CTS: "Asia/Tokyo",
  PEK: "Asia/Shanghai",
  PVG: "Asia/Shanghai",
  HKG: "Asia/Hong_Kong",
  TPE: "Asia/Taipei",
  TSA: "Asia/Taipei",
  BKK: "Asia/Bangkok",
  DAD: "Asia/Ho_Chi_Minh",
  CXR: "Asia/Ho_Chi_Minh",
  JFK: "America/New_York",
  LAX: "America/Los_Angeles",
  CDG: "Europe/Paris",
  LHR: "Europe/London",
  SIN: "Asia/Singapore",
  KUL: "Asia/Kuala_Lumpur",
  MNL: "Asia/Manila",
  SGN: "Asia/Ho_Chi_Minh",
  HAN: "Asia/Ho_Chi_Minh",
  DXB: "Asia/Dubai",
  SFO: "America/Los_Angeles",
  FRA: "Europe/Berlin",
  AMS: "Europe/Amsterdam",
  SYD: "Australia/Sydney",
  AKL: "Pacific/Auckland",
};
const durationByForeignAirport = {
  NRT: 150,
  HND: 140,
  KIX: 110,
  FUK: 85,
  CTS: 160,
  PEK: 130,
  PVG: 120,
  HKG: 220,
  TPE: 160,
  TSA: 155,
  BKK: 350,
  DAD: 300,
  CXR: 310,
  JFK: 840,
  LAX: 660,
  CDG: 850,
  LHR: 870,
  SIN: 390,
  KUL: 405,
  MNL: 260,
  SGN: 330,
  HAN: 275,
  DXB: 610,
  SFO: 660,
  FRA: 830,
  AMS: 840,
  SYD: 630,
  AKL: 695,
};

// 실제 논스톱 시간표가 확인된 장거리 노선은 방향별 운항시간을 우선합니다.
// 편서풍과 운항 경로 때문에 같은 두 공항도 왕복 시간이 서로 다를 수 있습니다.
const durationByDirection = {
  "ICN-AKL": 695, // 대한항공 KE411: 약 11시간 35분
  "AKL-ICN": 720,
  "AKL-JFK": 975, // 에어뉴질랜드·콴타스: 약 16시간 15분
  "JFK-AKL": 1050,
};

// 실시간 예약 API를 사용하지 않는 발표용 화면이므로 최근 시세를 참고한 편도 기준가를 사용합니다.
// 왕복 검색에서는 가는 편과 오는 편 가격이 합산되며, 미주·유럽이 근거리 가격으로 표시되지 않습니다.
const airlineFareRate = {
  KE: 1.12,
  OZ: 1.1,
  YP: 0.98,
  "7C": 0.94,
  LJ: 0.96,
  TW: 0.93,
  BX: 0.95,
  ZE: 0.92,
  RS: 0.94,
  RF: 0.93,
};
const schedulesPerRoute = 8;

// 최근 운임 수준을 날짜 조건에 맞춰 보정합니다. 실시간 API 응답이 없을 때만 사용됩니다.
function getMarketFareRate(departDate) {
  const departure = new Date(`${departDate}T00:00:00`);
  if (Number.isNaN(departure.getTime())) return 1;

  const daysUntilDeparture = Math.ceil(
    (departure.getTime() - Date.now()) / 86400000,
  );
  const month = departure.getMonth() + 1;
  const seasonalRate = [7, 8, 12].includes(month)
    ? 1.18
    : [1, 2, 9, 10].includes(month)
      ? 1.08
      : 1;
  const bookingRate =
    daysUntilDeparture <= 7
      ? 1.42
      : daysUntilDeparture <= 21
        ? 1.24
        : daysUntilDeparture <= 60
          ? 1.08
          : daysUntilDeparture >= 180
            ? 0.94
            : 1;
  return seasonalRate * bookingRate;
}

// 2026년 9월 직항 운항 자료를 기준으로 실제 취항 범위를 벗어난 항공사가
// 검색되지 않도록 출발 공항과 도착 공항의 정확한 조합별 운항사를 제한합니다.
// 키는 출발·도착 순서와 무관하게 공항 코드를 알파벳순으로 연결해 사용합니다.
const airlineCodesByRoute = {
  // 2026년 인천–오클랜드 논스톱은 대한항공 단독 운항입니다.
  "AKL-ICN": ["KE"],
  "AKL-NRT": ["NZ"],
  "AKL-PVG": ["NZ", "MU"],
  "AKL-HKG": ["NZ", "CX"],
  "AKL-SIN": ["NZ", "SQ"],
  "AKL-KUL": ["MH"],
  "AKL-SYD": ["NZ", "QF"],
  "AKL-LAX": ["NZ"],
  "AKL-SFO": ["NZ", "UA"],
  "AKL-JFK": ["NZ", "QF"],
  "AKL-DXB": ["EK"],
  "ICN-NRT": ["KE", "OZ", "7C", "LJ", "TW", "BX", "ZE", "RS"],
  "ICN-KIX": ["KE", "OZ", "7C", "LJ", "TW", "BX", "ZE", "RS", "RF"],
  "FUK-ICN": ["KE", "OZ", "7C", "LJ", "TW", "BX", "ZE", "RS"],
  "CTS-ICN": ["KE", "OZ", "7C", "LJ", "TW", "ZE"],
  "ICN-PEK": ["KE", "OZ", "7C"],
  "ICN-PVG": ["KE", "OZ", "7C", "LJ", "TW"],
  "ICN-TPE": ["KE", "OZ", "7C", "LJ", "TW"],
  "BKK-ICN": ["KE", "OZ", "7C", "LJ", "TW"],
  "DAD-ICN": ["KE", "OZ", "7C", "LJ", "TW"],
  "ICN-JFK": ["KE", "OZ"],
  "ICN-LAX": ["KE", "OZ", "YP"],
  "CDG-ICN": ["KE", "TW"],
  "ICN-LHR": ["KE", "OZ"],
  "GMP-HND": ["KE", "OZ"],
  "GMP-KIX": ["KE", "OZ", "7C"],
  "GMP-PEK": ["KE", "OZ"],
  "GMP-PVG": ["KE", "OZ"],
  "GMP-TSA": ["KE", "OZ", "TW"],
  "NRT-TAE": ["TW"],
  "KIX-TAE": ["TW"],
  "TAE-TPE": ["TW"],
  "DAD-TAE": ["TW"],
  "NRT-PUS": ["KE", "7C", "LJ", "BX"],
  "KIX-PUS": ["KE", "7C", "LJ", "TW", "BX"],
  "FUK-PUS": ["KE", "7C", "LJ", "BX"],
  "PUS-TPE": ["KE", "7C", "LJ", "BX"],
  "BKK-PUS": ["KE", "LJ", "BX"],
  "DAD-PUS": ["LJ", "BX"],
  "CJU-NRT": ["KE"],
  "CJU-KIX": ["TW"],
  "CJU-TPE": ["LJ", "TW", "ZE"],
  "CJU-PVG": ["LJ", "ZE"],
  "CJU-HKG": ["LJ"],
  "CJJ-NRT": ["RF", "ZE"],
  "CJJ-KIX": ["RF", "TW"],
  "CJJ-TPE": ["RF", "ZE"],
  "CJJ-DAD": ["RF", "TW"],
  "CJJ-CXR": ["RF", "TW"],
  "CJU-GMP": ["KE", "OZ", "7C", "LJ", "TW", "BX", "ZE", "RS"],
  "GMP-PUS": ["KE", "LJ", "BX"],
  "GMP-RSU": ["KE", "OZ"],
  "CJU-PUS": ["KE", "7C", "LJ", "BX"],
  "CJU-TAE": ["KE", "7C", "LJ", "TW"],
  "CJJ-CJU": ["KE", "7C", "LJ", "TW", "ZE", "RF"],
  "CJU-KWJ": ["KE", "OZ", "LJ"],
};

// 한국 출발 직항에 실제로 투입되는 외국 항공사를 국내 항공사 목록과 합칩니다.
const foreignAirlineCodesByRoute = {
  "ICN-NRT": ["ZG", "ET", "MM"],
  "ICN-KIX": ["MM"],
  "ICN-PEK": ["CA"],
  "ICN-PVG": ["MU", "CA"],
  "ICN-TPE": ["CI", "BR"],
  "BKK-ICN": ["TG"],
  "DAD-ICN": ["VN", "VJ"],
  "CDG-ICN": ["AF"],
  "GMP-HND": ["JL", "NH"],
  "GMP-PEK": ["CA"],
  "GMP-PVG": ["MU"],
  "GMP-TSA": ["CI", "BR"],
  "TAE-TPE": ["IT"],
  "DAD-TAE": ["VJ"],
  "PUS-TPE": ["CI", "BR"],
  "DAD-PUS": ["VJ"],
  "CJU-TPE": ["IT"],
  "CJU-PVG": ["MU"],
};

// 모든 화면에서 확인된 동일한 노선 목록을 사용합니다.
const directRouteKeySet = new Set(directRouteKeys);

// Returns only airports connected to the selected airport by a registered direct route.
export function getDirectDestinationCodes(departureCode) {
  if (!departureCode) return [];

  const destinationCodes = new Set();
  directRouteKeySet.forEach((routeKey) => {
    const [firstCode, secondCode] = routeKey.split("-");
    if (firstCode === departureCode) destinationCodes.add(secondCode);
    if (secondCode === departureCode) destinationCodes.add(firstCode);
  });

  return allRouteAirports
    .filter(({ code }) => destinationCodes.has(code))
    .map(({ code }) => code);
}

// 카드에 등록된 해외 직항을 검색할 때 사용할 공항 권역별 실제 항공사 후보입니다.
// 상세 조합이 따로 등록된 노선은 airlineCodesByRoute의 운항사를 우선합니다.
const airlineCodesByAirport = {
  ICN: ["KE", "OZ", "YP"],
  GMP: ["KE", "OZ", "TW"],
  PUS: ["KE", "BX", "LJ"],
  TAE: ["TW", "LJ"],
  CJU: ["KE", "7C", "LJ"],
  CJJ: ["RF", "TW", "ZE"],
  RSU: ["KE", "OZ"],
  KWJ: ["KE", "OZ", "LJ"],
  NRT: ["JL", "NH", "MM"],
  HND: ["JL", "NH"],
  KIX: ["JL", "NH", "MM"],
  FUK: ["JL", "NH", "MM"],
  CTS: ["JL", "NH", "MM"],
  PEK: ["CA", "MU"],
  PVG: ["MU", "CA"],
  HKG: ["CX"],
  TPE: ["CI", "BR"],
  TSA: ["CI", "BR"],
  BKK: ["TG"],
  DAD: ["VN", "VJ"],
  CXR: ["VN", "VJ"],
  SIN: ["SQ", "TR"],
  KUL: ["MH", "AK"],
  MNL: ["PR", "5J"],
  SGN: ["VN", "VJ"],
  HAN: ["VN", "VJ"],
  DXB: ["EK"],
  JFK: ["UA", "DL"],
  LAX: ["UA", "DL"],
  SFO: ["UA", "DL"],
  CDG: ["AF"],
  LHR: ["BA"],
  FRA: ["LH"],
  AMS: ["KL"],
  SYD: ["QF"],
  AKL: ["NZ"],
};

// 공항 간 대권거리를 기준으로 예상 블록 타임(순항 시간 + 이착륙 45분)을 계산합니다.
// 예상 비행시간이 6시간 이상인 노선만 장거리로 분류합니다.
const airportCoordinates = {
  ...Object.fromEntries(
    Object.entries(worldScheduleData).map(([code, values]) => [
      code,
      values.slice(1, 3),
    ]),
  ),
  ICN: [37.4602, 126.4407],
  GMP: [37.5583, 126.7906],
  PUS: [35.1795, 128.9382],
  TAE: [35.8941, 128.6589],
  CJU: [33.5113, 126.493],
  CJJ: [36.7166, 127.4991],
  RSU: [34.8423, 127.6169],
  KWJ: [35.1264, 126.8089],
  NRT: [35.772, 140.3929],
  HND: [35.5494, 139.7798],
  KIX: [34.4347, 135.244],
  FUK: [33.5859, 130.4507],
  CTS: [42.7752, 141.6923],
  PEK: [40.0799, 116.6031],
  PVG: [31.1443, 121.8083],
  HKG: [22.308, 113.9185],
  TPE: [25.0797, 121.2342],
  TSA: [25.0697, 121.5525],
  BKK: [13.69, 100.7501],
  DAD: [16.0439, 108.1994],
  CXR: [11.9982, 109.2194],
  JFK: [40.6413, -73.7781],
  LAX: [33.9416, -118.4085],
  CDG: [49.0097, 2.5479],
  LHR: [51.47, -0.4543],
  SIN: [1.3644, 103.9915],
  KUL: [2.7456, 101.7072],
  MNL: [14.5086, 121.0198],
  SGN: [10.8188, 106.6519],
  HAN: [21.2212, 105.8072],
  DXB: [25.2532, 55.3657],
  SFO: [37.6213, -122.379],
  FRA: [50.0379, 8.5622],
  AMS: [52.3105, 4.7683],
  SYD: [-33.9399, 151.1753],
  AKL: [-37.0082, 174.785],
};

function getRouteDistanceKm(departureCode, arrivalCode) {
  const departure = airportCoordinates[departureCode];
  const arrival = airportCoordinates[arrivalCode];
  if (!departure || !arrival) return 0;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDistance = toRadians(arrival[0] - departure[0]);
  const longitudeDistance = toRadians(arrival[1] - departure[1]);
  const firstLatitude = toRadians(departure[0]);
  const secondLatitude = toRadians(arrival[0]);
  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDistance / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getEstimatedFlightMinutes(departureCode, arrivalCode) {
  const distanceKilometers = getRouteDistanceKm(departureCode, arrivalCode);

  // 시간표가 없는 발표용 스케줄은 거리 구간별 실제 평균 블록 속도로 추정합니다.
  // 기존의 고정 780km/h 계산은 초장거리 노선을 지나치게 길게 만들었습니다.
  const averageBlockSpeed =
    distanceKilometers < 1000
      ? 650
      : distanceKilometers < 3000
        ? 760
        : distanceKilometers < 7000
          ? 830
          : 885;
  const groundMinutes = distanceKilometers < 3000 ? 25 : 35;
  return Math.round(
    (distanceKilometers / averageBlockSpeed) * 60 + groundMinutes,
  );
}

const airportRouteTypeOrder = { 국내: 0, 국제: 1, 장거리: 2 };

// 카드 분류와 시간표가 동일한 비행시간을 기준으로 판단하도록 공통 계산을 사용합니다.
export function getFlightDurationMinutes(departure, arrival) {
  // 방향별 자료를 우선해 편서풍·우회 항로에 따른 왕복 소요시간 차이를 보존합니다.
  const published = routeDurationMinutes[departure]?.[arrival];
  const distance = getRouteDistanceKm(departure, arrival);
  // 공개 자료에도 오류가 있을 수 있어 이착륙 시간을 뺀 속도가 비현실적인 값은 추정합니다.
  if (published && published >= 35 && distance / ((published - 20) / 60) < 1100)
    return published;
  const reverse = routeDurationMinutes[arrival]?.[departure];
  if (!published && reverse) return reverse;
  const foreignCode = koreaAirports.includes(departure) ? arrival : departure;
  return (
    durationByDirection[`${departure}-${arrival}`] ||
    getEstimatedFlightMinutes(departure, arrival) ||
    durationByForeignAirport[foreignCode] ||
    80
  );
}

// 등록된 직항 노선을 양방향으로 읽어 모든 공항 카드의 노선 그룹을 만듭니다.
export function getAirportRouteCards() {
  const cardRouteKeys = directRouteKeys;
  return allRouteAirports
    .map((airport) => {
      const groupedDestinations = new Map();
      cardRouteKeys.forEach((routeKey) => {
        const [firstCode, secondCode] = routeKey.split("-");
        if (firstCode !== airport.code && secondCode !== airport.code) return;

        const destinationCode =
          firstCode === airport.code ? secondCode : firstCode;
        const destinationAirport = allRouteAirports.find(
          ({ code }) => code === destinationCode,
        );
        const isDomestic =
          Boolean(airport.country) &&
          airport.country === destinationAirport?.country;
        // 6시간 이상이면 장거리를 우선하고, 나머지는 양쪽 공항의 국가로 분류합니다.
        const type =
          getFlightDurationMinutes(airport.code, destinationCode) >= 360
            ? "장거리"
            : isDomestic
              ? "국내"
              : "국제";
        const destinationName =
          destinationCityNames[destinationCode] ?? destinationCode;
        groupedDestinations.set(type, [
          ...(groupedDestinations.get(type) ?? []),
          `${destinationName} (${destinationCode})`,
        ]);
      });

      return {
        code: airport.code,
        name: airport.name,
        area:
          airport.country === "대한민국"
            ? airport.city
            : `${airport.city} · ${airport.country}`,
        routes: Array.from(groupedDestinations, ([type, cities]) => ({
          type,
          cities: [...new Set(cities)].join(" · "),
        })).sort(
          (firstRoute, secondRoute) =>
            airportRouteTypeOrder[firstRoute.type] -
            airportRouteTypeOrder[secondRoute.type],
        ),
      };
    })
    .filter(({ routes }) => routes.length > 0);
}

function getRouteAirlines(departure, arrival) {
  // 이전 항공사 매핑에 남아 있더라도 현재 노선 목록에 없으면 생성하지 않습니다.
  if (!directRouteKeySet.has([departure, arrival].sort().join("-"))) return [];
  if (worldScheduleData[departure] || worldScheduleData[arrival]) {
    if (!getDirectDestinationCodes(departure).includes(arrival)) return [];
    const carrier = getWorldRouteCarrier(departure, arrival);
    return airlines.filter(({ code }) => code === carrier);
  }
  const routeKey = [departure, arrival].sort().join("-");
  const exactCodes = airlineCodesByRoute[routeKey];
  const foreignCodes = foreignAirlineCodesByRoute[routeKey] ?? [];
  const routeCandidateCodes = directRouteKeySet.has(routeKey)
    ? [
        ...(airlineCodesByAirport[departure] ?? []),
        ...(airlineCodesByAirport[arrival] ?? []),
      ]
    : [];
  const allowedCodes = exactCodes
    ? [...new Set([...exactCodes, ...foreignCodes])]
    : [...new Set(routeCandidateCodes)].slice(0, 3);
  const routeAirlines = allowedCodes
    .map((code) => airlines.find((airline) => airline.code === code))
    .filter(Boolean);

  // 노선 코드로 만든 고정 시드로 운항사 순서를 섞습니다.
  // 같은 노선은 항상 같은 순서를 유지하지만 노선마다 첫 항공사와 배열 순서가 달라집니다.
  let seed = routeKey
    .split("")
    .reduce(
      (value, character) =>
        (Math.imul(value, 31) + character.charCodeAt(0)) >>> 0,
      2166136261,
    );
  const shuffledAirlines = [...routeAirlines];
  for (let index = shuffledAirlines.length - 1; index > 0; index -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const targetIndex = seed % (index + 1);
    [shuffledAirlines[index], shuffledAirlines[targetIndex]] = [
      shuffledAirlines[targetIndex],
      shuffledAirlines[index],
    ];
  }
  if (!foreignCodes.length || shuffledAirlines.length <= schedulesPerRoute) {
    return shuffledAirlines;
  }

  const foreignCodeSet = new Set(foreignCodes);
  const foreignAirlines = shuffledAirlines.filter(({ code }) =>
    foreignCodeSet.has(code),
  );
  const otherAirlines = shuffledAirlines.filter(
    ({ code }) => !foreignCodeSet.has(code),
  );
  return [...foreignAirlines, ...otherAirlines].slice(0, schedulesPerRoute);
}

// 좌석 등급별 운항사 제한을 검색창과 시간표 생성에서 함께 사용합니다.
function getCabinAirlines(departure, arrival, cabin, date) {
  if (!directRouteKeySet.has([departure, arrival].sort().join("-"))) return [];
  if (cabin === "first") {
    return getFirstClassCarriers(departure, arrival, date)
      .map((code) => airlines.find((airline) => airline.code === code))
      .filter(Boolean);
  }
  const candidates = getRouteAirlines(departure, arrival);
  return cabin === "business"
    ? candidates.filter(({ code }) => hasBusinessCabin(code))
    : candidates;
}

export function getSearchLegs(form) {
  const outbound = {
    departure: form.departure,
    arrival: form.arrival,
    departDate: form.departDate,
    cabin: form.cabin ?? "economy",
    tripType: "one-way",
  };
  if (form.tripType === "multi-city")
    return [
      { ...outbound, arrival: form.stopover },
      { ...outbound, departure: form.stopover, departDate: form.stopoverDate },
    ];
  if (form.tripType === "round-trip")
    return [
      outbound,
      {
        ...outbound,
        departure: form.arrival,
        arrival: form.departure,
        departDate: form.returnDate,
      },
    ];
  return [outbound];
}

export function getAvailableCabins(form) {
  const legs = getSearchLegs(form);
  if (legs.some((leg) => !leg.departure || !leg.arrival))
    return ["economy", "business"];
  return Object.keys(cabinLabels).filter((cabin) =>
    legs.every(
      (leg) =>
        getCabinAirlines(leg.departure, leg.arrival, cabin, leg.departDate)
          .length > 0,
    ),
  );
}

// 특정 순간의 해당 지역 UTC 시차를 밀리초 단위로 구합니다.
function timeZoneOffset(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return (
    Date.UTC(
      +values.year,
      +values.month - 1,
      +values.day,
      +values.hour,
      +values.minute,
      +values.second,
    ) - date.getTime()
  );
}

// 사용자가 입력한 공항 현지 출발 시각을 UTC 시각으로 변환합니다.
function localTimeToUtc(dateText, timeText, timeZone) {
  const [year, month, day] = dateText.split("-").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return new Date(guess.getTime() - timeZoneOffset(guess, timeZone));
}

// UTC 시각을 도착 공항의 날짜와 시각 문자열로 변환합니다.
function localParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

// 출발 공항 코드를 받아 국내 노선과 국가별 국제 노선을 분류합니다.
export function getArrivalCountries(departureCode) {
  const airport = airports.find(({ code }) => code === departureCode);
  if (!airport) return { domestic: [], international: [] };

  const domesticCities = airport.routes
    .filter(({ type }) => type === "국내")
    .flatMap(({ cities }) => cities.split(" · "));
  const internationalCities = airport.routes
    .filter(({ type }) => type !== "국내")
    .flatMap(({ cities }) => cities.split(" · "));

  const countries = new Map();
  internationalCities.forEach((city) => {
    const baseCity = city.replace(/\(.+\)/, "");
    const country = countryByCity[baseCity] ?? baseCity;
    countries.set(country, [...(countries.get(country) ?? []), city]);
  });

  return {
    domestic: domesticCities.map((city) => {
      const [airportName, airportCode] = domesticAirports[city] ?? [city, city];
      return { city, airportName, airportCode };
    }),
    international: Array.from(countries, ([country, cities]) => ({
      country,
      cities,
    })),
  };
}

// 검색 조건으로 발표용 항공편 목록을 생성합니다.
export function createFlightSchedules(searchForm) {
  const cabin = searchForm.cabin ?? "economy";
  if (!Object.hasOwn(cabinLabels, cabin)) return [];
  // 노선과 날짜를 기준으로 항공사, 가격, 출도착 시각이 포함된 샘플 스케줄을 만듭니다.
  const departureAirport = allRouteAirports.find(
    ({ code }) => code === searchForm.departure,
  );
  const arrivalAirport = allRouteAirports.find(
    ({ code }) => code === searchForm.arrival,
  );
  if (!departureAirport || !arrivalAirport) return [];
  const firstFareReference =
    cabin === "first"
      ? getFirstClassReferenceFare(
          searchForm.departure,
          searchForm.arrival,
          getRouteDistanceKm(searchForm.departure, searchForm.arrival),
          searchForm.fareTripType ?? searchForm.tripType,
        )
      : null;
  const startPrice = getRouteBaseFare(
    departureAirport,
    arrivalAirport,
    getRouteDistanceKm(searchForm.departure, searchForm.arrival),
  );
  // 직항 노선별로 8개의 서로 다른 출발 시간대를 표시합니다.
  const departureTimes = [
    "06:40",
    "08:15",
    "09:25",
    "10:30",
    "12:05",
    "13:20",
    "14:45",
    "16:10",
    "18:00",
    "19:25",
  ];
  if (searchForm.excludedDepartureTimes?.length) {
    const usedTimes = new Set(searchForm.excludedDepartureTimes);
    const routeSeed = `${searchForm.departure}-${searchForm.arrival}`
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    // 귀국편은 시간대별로 25~80분 이동한 별도 예상 스케줄을 사용합니다.
    for (let index = 0; index < departureTimes.length; index += 1) {
      const [hour, minute] = departureTimes[index].split(":").map(Number);
      let minutes =
        hour * 60 + minute + 25 + ((routeSeed + index * 7) % 12) * 5;
      let time;
      do {
        time = `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
        minutes += 5;
      } while (usedTimes.has(time));
      departureTimes[index] = time;
      usedTimes.add(time);
    }
    departureTimes.sort();
  }
  const marketFareRate = getMarketFareRate(searchForm.departDate);
  const { season, rate: seasonRate } = getSeasonPricing(searchForm.departDate);
  const routeAirlines = getCabinAirlines(
    searchForm.departure,
    searchForm.arrival,
    cabin,
    searchForm.departDate,
  );
  const baseDurationMinutes = getFlightDurationMinutes(
    searchForm.departure,
    searchForm.arrival,
  );
  // 발표용 예상 시간: 5분 단위 기준에서 최대 10분 차이를 두고 재검색에도 유지합니다.
  const roundedDurationMinutes = Math.round(baseDurationMinutes / 5) * 5;
  const durationOffsets = [-10, -5, 0, 5, 10];
  const durationSeed = `${searchForm.departure}-${searchForm.arrival}`
    .split("")
    .reduce(
      (value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0,
      0,
    );
  const departureZone = airportTimeZones[searchForm.departure] ?? "Asia/Seoul";
  const arrivalZone = airportTimeZones[searchForm.arrival] ?? "Asia/Seoul";

  // 취항사가 시간대 수보다 적으면 운항사 목록을 순환해 배치합니다.
  if (routeAirlines.length === 0) return [];
  const usedAutomaticPrices = new Set();
  // 왕복은 가는 편 전체 가격과 이미 생성한 오는 편 가격을 함께 피합니다.
  const usedRoundTripPrices = new Set(searchForm.excludedPrices ?? []);
  return departureTimes
    .slice(0, schedulesPerRoute)
    .map((departureTime, index) => {
      const durationMinutes =
        roundedDurationMinutes +
        durationOffsets[
          ((durationSeed % durationOffsets.length) + index * 3) %
            durationOffsets.length
        ];
      const airline = routeAirlines[index % routeAirlines.length];
      const customPrice =
        customFlightPrices[`${searchForm.departure}-${searchForm.arrival}`]?.[
          cabin
        ]?.[departureTime];
      const hasCustomPrice = Number.isFinite(customPrice) && customPrice > 0;
      const baseFare = firstFareReference
        ? firstFareReference.price
        : startPrice *
          marketFareRate *
          getCabinFareRate(cabin, baseDurationMinutes) *
          (airlineFareRate[airline.code] ?? 1);
      let price = hasCustomPrice
        ? customPrice
        : Math.round(
            (baseFare *
              getTimeFareRate(
                searchForm.departure,
                searchForm.arrival,
                cabin,
                index,
              )) /
              1000,
          ) * 1000;
      // 항공사 배율이나 천 원 단위 반올림 때문에 같은 가격이 되면 자동 가격만 조정합니다.
      if (!hasCustomPrice) {
        while (usedAutomaticPrices.has(price)) price += 1000;
        usedAutomaticPrices.add(price);
      }
      const basePrice = price;
      price = Math.round(basePrice * seasonRate);
      const specialFare = applyAirlinePromotion(
        price,
        airline.code,
        searchForm.departDate,
      );
      price = specialFare.price;
      if (searchForm.excludedPrices) {
        price = getReturnFare(
          price,
          searchForm.departure,
          searchForm.arrival,
          cabin,
          index,
          usedRoundTripPrices,
        );
        usedRoundTripPrices.add(price);
      }
      const departureUtc = localTimeToUtc(
        searchForm.departDate,
        departureTime,
        departureZone,
      );
      const arrival = localParts(
        new Date(departureUtc.getTime() + durationMinutes * 60000),
        arrivalZone,
      );
      const dayOffset = Math.round(
        (Date.parse(`${arrival.date}T00:00:00Z`) -
          Date.parse(`${searchForm.departDate}T00:00:00Z`)) /
          86400000,
      );
      return {
        id: `${airline.code}-${searchForm.departure}-${searchForm.arrival}-${searchForm.departDate}-${cabin}-${index}`,
        cabin,
        cabinLabel: cabinLabels[cabin],
        airline,
        flightNumber: `${airline.code}${120 + index * 17}`,
        departureTime,
        arrivalTime: arrival.time,
        departureUtc: departureUtc.toISOString(),
        arrivalUtc: new Date(
          departureUtc.getTime() + durationMinutes * 60000,
        ).toISOString(),
        durationMinutes,
        arrivalDayOffset: dayOffset,
        duration:
          `${Math.floor(durationMinutes / 60)}시간 ${durationMinutes % 60 ? `${durationMinutes % 60}분` : ""}`.trim(),
        seats: cabin === "first" ? null : 3 + index * 2,
        firstFareReference,
        basePrice,
        originalPrice: specialFare.originalPrice,
        promotion: specialFare.promotion,
        season,
        seasonRate,
        price,
        priceLabel: hasCustomPrice ? "직접 설정 가격" : "시간대별 예상 가격",
        tripType: searchForm.tripType,
        priceSource: hasCustomPrice
          ? "custom"
          : firstFareReference
            ? "reference-estimate"
            : "recent-estimate",
      };
    });
}

export function getAirportLabel(code) {
  // 공항 코드에 해당하는 한글 표시 이름을 국내·해외 데이터 전체에서 찾습니다.
  const departureAirport = airports.find((airport) => airport.code === code);
  if (departureAirport) return departureAirport.name;

  const allDestinations = [
    ...Object.entries(domesticAirports),
    ...Object.entries(destinationAirports),
  ];
  const destination = allDestinations.find(
    ([, [, airportCode]]) => airportCode === code,
  );
  return destination?.[1][0] ?? code;
}
import { applyAirlinePromotion } from "./airlinePromotions.js";
