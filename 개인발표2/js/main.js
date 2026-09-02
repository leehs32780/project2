const priceData = {
  tokyo: {
    country: "일본",
    city: "도쿄",
    prices: [238000, 219000, 198000, 225000, 247000],
  },
  paris: {
    country: "프랑스",
    city: "파리",
    prices: [965000, 928000, 892000, 910000, 948000],
  },
  newyork: {
    country: "미국",
    city: "뉴욕",
    prices: [1240000, 1185000, 1120000, 1168000, 1215000],
  },
};

const airportRoutes = {
  ICN: {
    일본: ["도쿄", "오사카", "후쿠오카", "삿포로"],
    아시아: ["베이징", "상하이", "홍콩", "타이베이", "방콕", "다낭"],
    장거리: ["뉴욕", "로스앤젤레스", "파리", "런던"],
  },
  GMP: {
    국내: [
      { city: "제주", airport: "제주국제공항", code: "CJU" },
      { city: "부산", airport: "김해국제공항", code: "PUS" },
      { city: "여수", airport: "여수공항", code: "RSU" },
    ],
    국제: ["도쿄(하네다)", "오사카", "베이징", "상하이", "타이베이(쑹산)"],
  },
  TAE: {
    국내: [{ city: "제주", airport: "제주국제공항", code: "CJU" }],
    국제: ["도쿄", "오사카", "타이베이", "다낭"],
  },
  PUS: {
    국내: [
      { city: "제주", airport: "제주국제공항", code: "CJU" },
      { city: "김포", airport: "김포국제공항", code: "GMP" },
    ],
    국제: ["도쿄", "오사카", "후쿠오카", "타이베이", "방콕", "다낭"],
  },
  CJU: {
    국내: [
      { city: "김포", airport: "김포국제공항", code: "GMP" },
      { city: "김해", airport: "김해국제공항", code: "PUS" },
      { city: "대구", airport: "대구국제공항", code: "TAE" },
      { city: "청주", airport: "청주국제공항", code: "CJJ" },
      { city: "광주", airport: "광주공항", code: "KWJ" },
    ],
    국제: ["도쿄", "오사카", "타이베이", "상하이", "홍콩"],
  },
  CJJ: {
    국내: [{ city: "제주", airport: "제주국제공항", code: "CJU" }],
    국제: ["도쿄", "오사카", "타이베이", "다낭", "나트랑"],
  },
};

const airportAddresses = {
  ICN: "인천광역시 영종구 공항로 271 (제1여객터미널)\n인천광역시 영종구 제2터미널대로 446 (제2여객터미널)",
  GMP: "서울 강서구 하늘길 38",
  TAE: "대구 동구 공항로 221",
  PUS: "부산 강서구 공항진입로 108",
  CJU: "제주 제주시 공항로 2 제주국제공항",
  CJJ: "충북 청주시 청원구 내수읍 오창대로 980 5-4",
};

const destinationCountries = {
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
};

const destinationAirports = {
  도쿄: ["나리타 국제공항", "NRT"],
  "도쿄(하네다)": ["도쿄 국제공항(하네다)", "HND"],
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
};

const cards = document.querySelectorAll(".destination-card");
const panel = document.querySelector("#price-chart-panel");
const chart = document.querySelector("#price-chart");
const popularSection = document.querySelector(".popular-section");
const popularToggle = document.querySelector(".popular-toggle");
const travelVideo = document.querySelector("#travel-video");
const tripType = document.querySelector("#trip-type");
const departureAirport = document.querySelector("#departure-airport");
const arrivalAirport = document.querySelector("#arrival-airport");
const returnDate = document.querySelector("#return-date");
travelVideo.disablePictureInPicture = true;

tripType.addEventListener("change", () => {
  const isOneWay = tripType.value === "one-way";
  returnDate.disabled = isOneWay;
  if (isOneWay) returnDate.value = "";
});

function updateAirportOptions() {
  const departure = departureAirport.value;
  const routes = airportRoutes[departure];

  arrivalAirport.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = routes
    ? "직항 도착지 선택"
    : "출발 공항을 먼저 선택해 주세요";
  arrivalAirport.append(placeholder);
  arrivalAirport.disabled = !routes;

  if (!routes) return;

  const domesticRoutes = routes.국내 ?? [];
  const internationalRoutes = Object.entries(routes)
    .filter(([type]) => type !== "국내")
    .flatMap(([, cities]) => cities);

  const appendRouteGroup = (label, destinations) => {
    if (destinations.length === 0) return;

    const group = document.createElement("optgroup");
    group.label = label;

    destinations.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      group.append(option);
    });

    arrivalAirport.append(group);
  };

  const appendRoutes = (destinations) => {
    destinations.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      arrivalAirport.append(option);
    });
  };

  const domesticDestinations = domesticRoutes.map(
    ({ city, airport, code }) => ({
      value: code,
      text: `${city} - ${airport} (${code})`,
    }),
  );

  const internationalCountries = new Map();
  internationalRoutes.forEach((city) => {
    const baseCity = city.replace(/\(.+\)/, "");
    const country = destinationCountries[baseCity] ?? baseCity;
    const cities = internationalCountries.get(country) ?? [];
    cities.push(city);
    internationalCountries.set(country, cities);
  });

  appendRoutes(domesticDestinations);
  internationalCountries.forEach((cities, country) => {
    appendRouteGroup(
      country,
      cities.map((city) => {
        const [airportName, airportCode] = destinationAirports[city] ?? [
          city,
          city,
        ];
        return {
          value: airportCode,
          text: `${city} – ${airportName} (${airportCode})`,
        };
      }),
    );
  });
}

departureAirport.addEventListener("change", updateAirportOptions);
updateAirportOptions();

document.querySelectorAll(".airport-route-card").forEach((card) => {
  const code = card.dataset.airport;
  const address = document.createElement("p");
  address.className = "airport-address";
  address.textContent = airportAddresses[code];
  address.hidden = true;
  card.querySelector(".airport-name > div").append(address);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");

  const toggleAddress = () => {
    const willOpen = address.hidden;
    address.hidden = !willOpen;
    card.classList.toggle("is-address-open", willOpen);
    card.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) {
      departureAirport.value = code;
      updateAirportOptions();
      arrivalAirport.focus();

      if (typeof arrivalAirport.showPicker === "function") {
        try {
          arrivalAirport.showPicker();
        } catch {
          // 일부 브라우저는 select 목록 자동 열기를 지원하지 않습니다.
        }
      }
    }
  };

  card.addEventListener("click", toggleAddress);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAddress();
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".airport-route-card")) return;

  document
    .querySelectorAll(".airport-route-card.is-address-open")
    .forEach((card) => {
      card.classList.remove("is-address-open");
      card.setAttribute("aria-expanded", "false");
      card.querySelector(".airport-address").hidden = true;
    });
});

const travelScenes = [
  "../videos/travel-resort.mp4",
  "../videos/travel-mountain.mp4",
  "../videos/travel-flight.mp4",
];

let currentScene = 0;
let isChangingScene = false;

travelVideo.addEventListener("timeupdate", () => {
  if (travelVideo.currentTime < 4 || isChangingScene) return;

  isChangingScene = true;
  travelVideo.classList.add("is-changing");
  currentScene = (currentScene + 1) % travelScenes.length;

  setTimeout(() => {
    travelVideo.src = travelScenes[currentScene];
    travelVideo.play();
  }, 200);
});

travelVideo.addEventListener("playing", () => {
  travelVideo.classList.remove("is-changing");
  isChangingScene = false;
});

popularToggle.addEventListener("click", () => {
  const isOpen = popularSection.classList.toggle("is-open");
  popularToggle.setAttribute("aria-expanded", String(isOpen));
});

function formatPrice(price) {
  return `${price.toLocaleString("ko-KR")}원`;
}

function showChart(cityKey) {
  const data = priceData[cityKey];
  const width = 340;
  const height = 240;
  const padding = { top: 42, right: 38, bottom: 44, left: 38 };
  const min = Math.min(...data.prices) * 0.92;
  const max = Math.max(...data.prices) * 1.05;
  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;
  const points = data.prices.map((price, index) => ({
    x: padding.left + (usableWidth / (data.prices.length - 1)) * index,
    y: padding.top + ((max - price) / (max - min)) * usableHeight,
  }));
  const pointText = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaText = `${padding.left},${height - padding.bottom} ${pointText} ${width - padding.right},${height - padding.bottom}`;

  document.querySelector("#chart-country").textContent = data.country;
  document.querySelector("#chart-city").textContent = data.city;
  document.querySelector("#chart-lowest").textContent =
    `최저 ${formatPrice(Math.min(...data.prices))}`;
  chart.innerHTML = `
    <svg class="price-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${data.city} 5주간 편도 가격 변화 그래프">
      <defs><linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#68b8f5" stop-opacity=".32"/><stop offset="1" stop-color="#68b8f5" stop-opacity="0"/></linearGradient></defs>
      <line class="chart-grid" x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}"/>
      <line class="chart-grid" x1="${padding.left}" y1="${height / 2}" x2="${width - padding.right}" y2="${height / 2}"/>
      <line class="chart-grid" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}"/>
      <polygon class="chart-area" points="${areaText}"/><polyline class="chart-line" points="${pointText}"/>
      ${points.map((point, index) => `<circle class="chart-point" cx="${point.x}" cy="${point.y}" r="6"/><text class="chart-price" x="${point.x}" y="${point.y - 15}">${Math.round(data.prices[index] / 10000)}만원</text><text class="chart-label" x="${point.x}" y="${height - 17}">${index + 1}주차</text>`).join("")}
    </svg>`;

  cards.forEach((card) =>
    card.classList.toggle("is-active", card.dataset.city === cityKey),
  );
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

cards.forEach((card) => {
  card.addEventListener("click", () => showChart(card.dataset.city));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showChart(card.dataset.city);
    }
  });
});
