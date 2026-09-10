import { t } from "../i18n/translate.js";
import { useSyncExternalStore } from "react";
import { getLanguage, subscribeLanguage } from "../i18n/locale.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { calculatePayment } from "../data/paymentPromotions";
import ContinentIcon from "./ContinentIcon";
import AirportCard from "./AirportCard";
import AppOverlays from "./AppOverlays";
import BudgetRoutePopup from "./BudgetRoutePopup";
import Header from "./Header";
import AboutPage from "./AboutPage";
import PromotionDetails from "./PromotionDetails";
import AirlineSpecials, { AirlineSpecialDialog } from "./AirlineSpecials";
import AirlineLogo from "./AirlineLogo";
import AirlineCountry from "./AirlineCountry";
import TravelSidePromotions from "./TravelSidePromotions";
import MyBookingsModal from "./MyBookingsModal";
import PriceChart from "./PriceChart";
import FlightSearchForm from "./FlightSearchForm";
import { worldAirports } from "../data/worldAirports";
import MultiCityResults from "./MultiCityResults";
import {
  createFlightSchedules,
  getAvailableCabins,
  getSearchLegs,
} from "../data/appData";
import { databaseApi } from "../../DB/databaseApi.js";
import { profileAvatarGroups, profileAvatars } from "../data/profileAvatars";
import {
  airports,
  allRouteAirports,
  airportEnglishNames,
  destinationAttractions,
  destinationCityNames,
  destinations,
  airportAddresses,
  formatPrice,
  travelScenes,
  getDirectDestinationCodes,
  getAirportRouteCards,
  getAirportLabel,
} from "../data/appData";

// 국가명을 대륙으로 연결해 공항 카드를 대륙별로 분류하는 기준입니다.
const continentByCountry = {
  ...Object.fromEntries(
    worldAirports.map(({ country, continent }) => [country, continent]),
  ),
  대한민국: "아시아",
  일본: "아시아",
  중국: "아시아",
  홍콩: "아시아",
  대만: "아시아",
  태국: "아시아",
  베트남: "아시아",
  싱가포르: "아시아",
  말레이시아: "아시아",
  필리핀: "아시아",
  아랍에미리트: "아시아",
  프랑스: "유럽",
  영국: "유럽",
  독일: "유럽",
  네덜란드: "유럽",
  미국: "북아메리카",
  호주: "오세아니아",
  뉴질랜드: "오세아니아",
};

const continentOrder = [
  "아시아",
  "유럽",
  "북아메리카",
  "남아메리카",
  "아프리카",
  "오세아니아",
];

// ============================================================
// 7. 메인 애플리케이션 컴포넌트
// ============================================================
export default function App() {
  const [specialAirline, setSpecialAirline] = useState(null);
  const [promotionKind, setPromotionKind] = useState(null);
  const [pageHash, setPageHash] = useState(() => window.location.hash);
  const isAboutPage = pageHash === "#about";
  useEffect(() => {
    const onHashChange = () => setPageHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    if (isAboutPage) window.scrollTo({ top: 0 });
    else if (pageHash)
      document.getElementById(pageHash.slice(1))?.scrollIntoView();
  }, [pageHash, isAboutPage]);
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguage,
    () => "ko",
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "en"
        ? "SKY ROUTE · Flights, simplified"
        : "SKY ROUTE · 항공권 검색";
  }, [language]);
  // 항공권 검색 폼 상태
  const [form, setForm] = useState({
    tripType: "round-trip",
    cabin: "economy",
    departure: "",
    arrival: "",
    departDate: "",
    returnDate: "",
    stopover: "",
    stopoverDate: "",
  });

  // 인기 여행지, 영상, 공항 카드 화면 상태
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isPopularOpen, setIsPopularOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [activeDiscovery, setActiveDiscovery] = useState("popular");
  const [selectedContinent, setSelectedContinent] = useState(null);
  const popularSectionRef = useRef(null);
  const seasonSectionRef = useRef(null);
  // 검색 안내와 로딩, 일반·다구간·왕복 조회 결과 및 선택 항공편을 관리합니다.
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);
  const [flightResults, setFlightResults] = useState([]);
  const [multiCityResults, setMultiCityResults] = useState(null);
  const [returnFlightResults, setReturnFlightResults] = useState([]);
  const [searchedTrip, setSearchedTrip] = useState(null);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  // 탑승객 입력과 결제수단, 등록 카드, 결제 PIN 확인에 필요한 상태를 관리합니다.
  const [bookingForm, setBookingForm] = useState({
    passengerName: "",
    phone: "",
    email: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    method: "kakao",
    agreed: false,
  });
  const [savedCards, setSavedCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);
  const [sitePaymentPin, setSitePaymentPin] = useState("");
  const [sitePinForm, setSitePinForm] = useState({
    current: "",
    newPin: "",
    confirm: "",
  });
  const [cardForm, setCardForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [paymentPinOpen, setPaymentPinOpen] = useState(false);
  const [paymentPin, setPaymentPin] = useState("");
  // 예약 완료 화면과 내 예약 목록, 여행 영상 및 펼쳐진 공항 카드를 관리합니다.
  const [bookingComplete, setBookingComplete] = useState(null);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [travelScene, setTravelScene] = useState(0);
  const [openAirport, setOpenAirport] = useState(null);

  // 로그인 창, 로그인 정보, 성공 안내 상태
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [signupForm, setSignupForm] = useState({
    id: "",
    name: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [signupError, setSignupError] = useState("");
  const [findIdName, setFindIdName] = useState("");
  const [resetForm, setResetForm] = useState({
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const accountDeletedDialogRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", avatar: "pilot" });

  // Q & A 입력, 목록, 탭, 안내 메시지 상태
  const [qnaOpen, setQnaOpen] = useState(false);
  const [qnaForm, setQnaForm] = useState({ title: "", content: "" });
  const [qnaTab, setQnaTab] = useState("all");
  const [questionNotice, setQuestionNotice] = useState("");
  const [questions, setQuestions] = useState(() => [
    {
      id: 1,
      title: "항공권 가격은 실시간인가요?",
      content: "표시된 가격의 기준이 궁금합니다.",
      answer:
        "퍼스트는 공개 평균 운임·공시 운임을 활용한 참고 가격입니다. 출처와 환산 방법은 검색 결과에서 확인할 수 있습니다. 날짜별 실제 예약 가격이 아니며 시간표는 발표용 예시입니다.",
      ownerId: null,
    },
    {
      id: 2,
      title: "왕복에서 편도로 변경할 수 있나요?",
      content: "검색 중간에도 변경 가능한가요?",
      answer:
        "여행 유형에서 편도를 선택하면 귀국일 입력이 자동으로 비활성화됩니다.",
      ownerId: null,
    },
    {
      id: 3,
      title: "예약한 항공권을 취소할 수 있나요?",
      content: "결제까지 완료한 항공권의 취소 방법이 궁금합니다.",
      answer:
        "로그인 후 상단의 내 예약 메뉴에서 예약 내역을 확인하고 취소할 수 있습니다.",
      ownerId: null,
    },
  ]);

  // 브라우저에 저장된 사용자가 있으면 로그인 상태를 복원합니다.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("skyfinder-user");
    if (!savedUser) return null;

    return JSON.parse(savedUser);
  });

  // 저장된 로그인 계정이 DB에도 있는지 확인하고 조회 실패 시 로그인 상태를 해제합니다.
  useEffect(() => {
    if (!user) return;
    databaseApi.getAccount(user.id).catch(() => {
      localStorage.removeItem("skyfinder-user");
      setUser(null);
    });
  }, []);

  // 앱 실행 시 예약과 질문을 함께 읽고 기본 Q&A 예시에 DB 질문을 합칩니다.
  useEffect(() => {
    Promise.all([databaseApi.getBookings(), databaseApi.getQuestions()])
      .then(([bookingData, questionData]) => {
        setBookings(bookingData.bookings);
        setQuestions((current) => [
          ...questionData.questions,
          ...current.filter(({ ownerId }) => !ownerId),
        ]);
      })
      .catch((error) => console.error("DB 불러오기 실패:", error));
  }, []);

  // 로그인 사용자가 바뀌면 해당 사용자의 카드·PIN을 복원하고 로그아웃 시 화면 상태를 비웁니다.
  useEffect(() => {
    if (!user) {
      setSavedCards([]);
      setSitePaymentPin("");
      return;
    }
    const stored = JSON.parse(
      localStorage.getItem(`skyfinder-payment-${user.id}`) ?? "[]",
    );
    const cards = Array.isArray(stored)
      ? stored
      : stored
        ? [{ ...stored, id: stored.id ?? Date.now() }]
        : [];
    const storedPin =
      localStorage.getItem(`skyfinder-site-pin-${user.id}`) ??
      cards.find(({ pin }) => pin)?.pin ??
      "";
    setSavedCards(cards.map(({ pin, ...card }) => card));
    setSitePaymentPin(storedPin);
    if (storedPin)
      localStorage.setItem(`skyfinder-site-pin-${user.id}`, storedPin);
  }, [user]);

  // 공항 카드 바깥을 클릭하면 열려 있던 상세 주소를 닫습니다.
  useEffect(() => {
    const closeAirportCard = (event) => {
      if (!event.target.closest(".airport-route-card")) {
        setOpenAirport(null);
      }
    };

    document.addEventListener("click", closeAirportCard);
    return () => document.removeEventListener("click", closeAirportCard);
  }, []);

  // 인기 여행지 목록을 연 동안 바깥 클릭과 Escape를 감지하고 닫힐 때 이벤트를 해제합니다.
  useEffect(() => {
    if (!isPopularOpen) return undefined;

    const closePopularSection = (event) => {
      if (event.clientX >= document.documentElement.clientWidth) return;
      if (!popularSectionRef.current?.contains(event.target)) {
        setIsPopularOpen(false);
      }
    };
    const closePopularSectionWithEscape = (event) => {
      if (event.key === "Escape") setIsPopularOpen(false);
    };

    document.addEventListener("mousedown", closePopularSection);
    document.addEventListener("keydown", closePopularSectionWithEscape);
    return () => {
      document.removeEventListener("mousedown", closePopularSection);
      document.removeEventListener("keydown", closePopularSectionWithEscape);
    };
  }, [isPopularOpen]);

  // 성수기 안내를 연 동안 바깥 클릭과 Escape로 닫습니다.
  useEffect(() => {
    if (!isSeasonOpen) return undefined;
    const closeSeasonSection = (event) => {
      // 우측 브라우저 스크롤바 클릭은 팝업 바깥 클릭으로 처리하지 않습니다.
      if (event.clientX >= document.documentElement.clientWidth) return;
      if (!seasonSectionRef.current?.contains(event.target))
        setIsSeasonOpen(false);
    };
    const closeSeasonSectionWithEscape = (event) => {
      if (event.key === "Escape") setIsSeasonOpen(false);
    };
    document.addEventListener("mousedown", closeSeasonSection);
    document.addEventListener("keydown", closeSeasonSectionWithEscape);
    return () => {
      document.removeEventListener("mousedown", closeSeasonSection);
      document.removeEventListener("keydown", closeSeasonSectionWithEscape);
    };
  }, [isSeasonOpen]);

  useEffect(() => () => clearTimeout(searchTimerRef.current), []);

  // 오늘 날짜와 선택한 출발 공항의 도착지 목록을 계산합니다.
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const airportRouteCards = useMemo(() => getAirportRouteCards(), []);
  // 국가별 대륙 분류를 이용해 각 대륙 팝업에 표시할 공항 카드 목록을 계산합니다.
  const airportCardsByContinent = useMemo(() => {
    const airportCountryByCode = new Map(
      allRouteAirports.map(({ code, country }) => [code, country]),
    );

    return continentOrder.map((continent) => ({
      continent,
      airports: airportRouteCards.filter(
        ({ code }) =>
          continentByCountry[airportCountryByCode.get(code)] === continent,
      ),
    }));
  }, [airportRouteCards]);

  // 대륙 공항 팝업을 열면 배경 스크롤을 막고 Escape로 닫을 수 있게 합니다.
  useEffect(() => {
    if (!selectedContinent) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedContinent(null);
        setOpenAirport(null);
      }
    };
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [selectedContinent]);

  // 공항·날짜 변경으로 선택 등급을 제공하지 않게 되면 일반석으로 되돌립니다.
  useEffect(() => {
    if (
      !getAvailableCabins(form).includes(form.cabin) &&
      form.cabin !== "economy"
    ) {
      setForm((current) => ({ ...current, cabin: "economy" }));
      setMessage(
        "변경한 여정에서 해당 좌석 유형을 제공하지 않아 일반석으로 변경했습니다.",
      );
    }
  }, [form]);

  // 항공권 검색 폼 입력 처리
  const updateForm = ({ target }) =>
    setForm((current) => ({ ...current, [target.name]: target.value }));
  // 여행 유형이 바뀌면 도착지·경유지 정보를 초기화하고 편도에서는 귀국일을 비웁니다.
  const updateTripType = (tripType) =>
    setForm((current) => ({
      ...current,
      tripType,
      arrival: "",
      stopover: "",
      stopoverDate: "",
      returnDate: tripType === "one-way" ? "" : current.returnDate,
    }));
  // 앞 구간의 공항이 바뀌면 뒤 구간의 선택을 초기화해 잘못 연결된 경로를 방지합니다.
  const updateAirport = ({ target }) => {
    if (target.name === "departure") {
      setForm((current) => ({
        ...current,
        departure: target.value,
        stopover: "",
        arrival: "",
      }));
      return;
    }

    if (target.name === "stopover") {
      setForm((current) => ({
        ...current,
        stopover: target.value,
        arrival: "",
      }));
      return;
    }

    setForm((current) => ({ ...current, arrival: target.value }));
  };

  // 항공권 검색 버튼 처리
  const searchFlights = async (event) => {
    event.preventDefault();
    if (isSearching) return;
    clearTimeout(searchTimerRef.current);
    setMultiCityResults(null);
    const isComplete =
      form.departure &&
      form.arrival &&
      form.departDate &&
      (form.tripType === "round-trip"
        ? form.returnDate
        : form.tripType === "multi-city"
          ? form.stopover && form.stopoverDate
          : true);

    if (!isComplete) {
      setIsSearching(false);
      setMessage("출발지, 도착지와 여행 날짜를 모두 입력해 주세요.");
      setSearchedTrip(null);
      setFlightResults([]);
      setReturnFlightResults([]);
      return;
    }

    const submittedForm = { ...form };
    if (!getAvailableCabins(submittedForm).includes(submittedForm.cabin)) {
      setMessage("이 여정에서 제공하는 좌석 유형을 선택해 주세요.");
      return;
    }
    if (
      form.tripType === "multi-city" &&
      (form.departDate < today ||
        form.stopoverDate < form.departDate ||
        !getDirectDestinationCodes(form.departure).includes(form.stopover) ||
        !getDirectDestinationCodes(form.stopover).includes(form.arrival))
    ) {
      setMessage(
        "연결 가능한 경유지와 도착지를 선택하고, 구간별 출발일을 순서대로 입력해 주세요.",
      );
      setSearchedTrip(null);
      setFlightResults([]);
      setReturnFlightResults([]);
      return;
    }
    setIsSearching(true);
    setMessage("");
    setFlightResults([]);
    setReturnFlightResults([]);
    setSelectedOutbound(null);
    setSelectedFlight(null);
    // 공개 운임 자료를 포함한 로컬 참고 시간표를 생성합니다. API 키가 필요하지 않습니다.
    setSearchedTrip(null);
    try {
      // 매 검색마다 로딩 화면을 먼저 그린 뒤 3초 후 결과를 표시합니다.
      await new Promise((resolve) => {
        searchTimerRef.current = setTimeout(resolve, 3000);
      });
      if (submittedForm.tripType === "multi-city") {
        const legs = getSearchLegs(submittedForm);
        const results = legs.map((leg) => createFlightSchedules(leg));
        setSearchedTrip(submittedForm);
        setMultiCityResults(results);
        setMessage(
          "구간별 항공편을 선택해 주세요. 출도착 시각은 각 공항의 현지시간입니다.",
        );
      } else {
        const schedules = createFlightSchedules(submittedForm);
        setSearchedTrip(submittedForm);
        setFlightResults(schedules);
        setMessage(
          schedules.length
            ? `직항편 ${schedules.length}개 · 출도착 시각은 각 공항의 현지시간입니다.`
            : "선택 날짜에 조회된 해당 등급의 직항편이 없습니다.",
        );
      }
    } catch (error) {
      setMessage(
        error.message || "항공편을 조회하지 못했습니다. 다시 검색해 주세요.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const selectOutboundFlight = async (flight) => {
    // 편도는 예매 창을 열고 왕복은 귀국일의 역방향 시간표를 생성합니다.
    if (searchedTrip.tripType === "one-way") {
      setSelectedFlight(flight);
      return;
    }
    if (isSearching) return;
    setSelectedOutbound(flight);
    setReturnFlightResults([]);
    setIsSearching(true);
    setMessage("");
    try {
      // 왕복의 오는 편 검색에도 같은 로딩 시간을 적용합니다.
      await new Promise((resolve) => {
        searchTimerRef.current = setTimeout(resolve, 3000);
      });
      const returnSearch = {
        departure: searchedTrip.arrival,
        arrival: searchedTrip.departure,
        departDate: searchedTrip.returnDate,
        cabin: searchedTrip.cabin,
        fareTripType: searchedTrip.tripType,
        excludedPrices: flightResults.map(({ price }) => price),
        excludedDepartureTimes: flightResults.map(
          ({ departureTime }) => departureTime,
        ),
        tripType: "one-way",
      };
      const schedules = createFlightSchedules(returnSearch);
      setReturnFlightResults(schedules);
      if (!schedules.length)
        setMessage("귀국 구간에 등록된 직항 노선이 없습니다.");
      setTimeout(
        () =>
          document
            .querySelector("#return-flights")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const requestPaymentPin = (event) => {
    // 탑승객 정보와 결제수단 선택이 끝나면 최종 비밀번호 확인 창을 엽니다.
    event.preventDefault();
    if (!user || !sitePaymentPin) {
      window.alert(
        t("결제 전에 프로필에서 SKY ROUTE 결제 PIN 6자리를 설정해 주세요."),
      );
      return;
    }
    setPaymentPin("");
    setPaymentPinOpen(true);
  };

  const reserveFlight = async (event) => {
    // 결제 승인 후 예약 객체를 SQLite 데이터베이스에 저장합니다.
    event.preventDefault();
    if (paymentPin.length !== 6) return;
    const selectedCard = paymentForm.method.startsWith("card:")
      ? savedCards.find(({ id }) => `card:${id}` === paymentForm.method)
      : savedCards[0];
    if (paymentPin !== sitePaymentPin) {
      window.alert(t("결제 PIN이 일치하지 않습니다."));
      setPaymentPin("");
      return;
    }
    const reservationNumber = `SF${Date.now().toString().slice(-8)}`;
    const totalAmount = (selectedOutbound?.price ?? 0) + selectedFlight.price;
    const reservation = {
      number: reservationNumber,
      flight: selectedFlight,
      outboundFlight: selectedOutbound ?? selectedFlight,
      returnFlight: selectedOutbound ? selectedFlight : null,
      trip: searchedTrip,
      passenger: { ...bookingForm },
      payment: {
        status: "결제 완료",
        ...calculatePayment(totalAmount, paymentForm.method),
        methodId: paymentForm.method,
        method: paymentForm.method.startsWith("card:")
          ? selectedCard.cardName
          : {
              kakao: "카카오페이",
              naver: "네이버페이",
              toss: "토스페이",
              payco: "페이코",
            }[paymentForm.method],
        lastFour: paymentForm.method.startsWith("card:")
          ? selectedCard.lastFour
          : "",
      },
      ownerId: user?.id ?? "guest",
    };
    try {
      await databaseApi.createBooking(reservation);
    } catch (error) {
      window.alert(t(error.message));
      return;
    }
    setBookingComplete(reservation);
    setBookings((current) => [reservation, ...current]);
    setPaymentPinOpen(false);
    setPaymentPin("");
    setSelectedFlight(null);
    setBookingForm({ passengerName: "", phone: "", email: "" });
    setPaymentForm({ method: "kakao", agreed: false });
  };

  // 로그인 및 로그아웃 처리
  const login = async (event) => {
    // SQLite에 저장된 계정 정보로 로그인합니다.
    event.preventDefault();
    let loggedInUser;
    try {
      ({ user: loggedInUser } = await databaseApi.login(loginForm));
    } catch (error) {
      setLoginError(error.message);
      return;
    }
    localStorage.setItem("skyfinder-user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setLoginForm({ id: "", password: "" });
    setLoginError("");
    setLoginOpen(false);
    setLoginSuccess(true);
  };
  const signup = async (event) => {
    // 아이디와 비밀번호 조건을 검사한 뒤 새 계정을 SQLite에 저장합니다.
    event.preventDefault();
    if (!signupForm.birthDate) {
      setSignupError("생년월일을 입력해 주세요.");
      return;
    }
    const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const [birthYear, birthMonth, birthDay] = signupForm.birthDate
      .split("-")
      .map(Number);
    const parsedBirthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const isValidBirthDate =
      birthDatePattern.test(signupForm.birthDate) &&
      parsedBirthDate.getFullYear() === birthYear &&
      parsedBirthDate.getMonth() === birthMonth - 1 &&
      parsedBirthDate.getDate() === birthDay;
    if (!isValidBirthDate) {
      setSignupError("생년월일을 YYYY-MM-DD 형식으로 정확히 입력해 주세요.");
      return;
    }
    if (signupForm.birthDate > today) {
      setSignupError("생년월일은 오늘 이후로 입력할 수 없습니다.");
      return;
    }
    if (signupForm.password.length < 4) {
      setSignupError("비밀번호는 4자리 이상 입력해 주세요.");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    const newAccount = {
      id: signupForm.id.trim(),
      name: signupForm.name.trim(),
      birthDate: signupForm.birthDate,
      password: signupForm.password,
    };
    try {
      await databaseApi.signup(newAccount);
    } catch (error) {
      setSignupError(error.message);
      return;
    }
    setLoginForm({ id: newAccount.id, password: "" });
    setSignupForm({
      id: "",
      name: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    });
    setSignupError("");
    setAuthMode("login");
    setLoginError(
      "회원가입이 완료되었습니다. 비밀번호를 입력해 로그인해보세요.",
    );
  };
  const findId = async (event) => {
    // 가입할 때 사용한 이름이 같은 모든 아이디를 찾아 안내합니다.
    event.preventDefault();
    let matchedIds;
    try {
      ({ ids: matchedIds } = await databaseApi.findId(findIdName.trim()));
    } catch (error) {
      setRecoveryMessage(error.message);
      return;
    }

    setRecoveryMessage(
      matchedIds.length
        ? `가입한 아이디: ${matchedIds.join(", ")}`
        : "입력한 이름으로 가입된 아이디가 없습니다.",
    );
  };
  const resetPassword = async (event) => {
    // 아이디와 이름으로 본인을 확인한 뒤 해당 계정의 비밀번호만 교체합니다.
    event.preventDefault();
    if (resetForm.password.length < 4) {
      setRecoveryMessage("새 비밀번호는 4자리 이상 입력해 주세요.");
      return;
    }
    if (resetForm.password !== resetForm.confirmPassword) {
      setRecoveryMessage("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      await databaseApi.resetPassword({
        id: resetForm.id.trim(),
        name: resetForm.name.trim(),
        password: resetForm.password,
      });
    } catch (error) {
      setRecoveryMessage(error.message);
      return;
    }
    setLoginForm({ id: resetForm.id.trim(), password: "" });
    setResetForm({ id: "", name: "", password: "", confirmPassword: "" });
    setRecoveryMessage("");
    setAuthMode("login");
    setLoginError("비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해보세요.");
  };
  const logout = () => {
    // 저장된 로그인 세션을 지우고 사용자 전용 화면을 닫습니다.
    localStorage.removeItem("skyfinder-user");
    setUser(null);
    setProfileOpen(false);
  };
  const openProfile = () => {
    // 현재 프로필과 사용자별 등록 카드를 불러온 뒤 설정 창을 엽니다.
    setProfileForm({ name: user.name, avatar: user.avatar ?? "pilot" });
    const stored = JSON.parse(
      localStorage.getItem(`skyfinder-payment-${user.id}`) ?? "[]",
    );
    const cards = Array.isArray(stored)
      ? stored
      : stored
        ? [{ ...stored, id: stored.id ?? Date.now() }]
        : [];
    const storedPin =
      localStorage.getItem(`skyfinder-site-pin-${user.id}`) ??
      cards.find(({ pin }) => pin)?.pin ??
      "";
    setSavedCards(cards.map(({ pin, ...card }) => card));
    setSitePaymentPin(storedPin);
    setSitePinForm({ current: "", newPin: "", confirm: "" });
    setEditingCardId(null);
    setCardForm({ cardName: "", cardNumber: "", expiry: "", cvc: "" });
    setProfileOpen(true);
  };
  const savePaymentMethod = (event) => {
    // 카드 형식을 검사하고 민감한 전체 번호 대신 끝 네 자리만 저장합니다.
    event.preventDefault();
    event.stopPropagation();
    const digits = cardForm.cardNumber.replace(/\D/g, "");
    const isEditing = editingCardId !== null;
    if (
      !cardForm.cardName.trim() ||
      (!isEditing && digits.length !== 16) ||
      (isEditing && digits.length !== 0 && digits.length !== 16) ||
      !/^\d{2}\/\d{2}$/.test(cardForm.expiry) ||
      (!isEditing && cardForm.cvc.length !== 3) ||
      (isEditing && cardForm.cvc.length !== 0 && cardForm.cvc.length !== 3)
    ) {
      window.alert(
        t("카드 이름, 카드번호, 유효기간과 CVC를 모두 확인해 주세요."),
      );
      return;
    }
    const previousCard = savedCards.find(({ id }) => id === editingCardId);
    const card = {
      id: editingCardId ?? Date.now(),
      cardName: cardForm.cardName.trim(),
      lastFour: digits ? digits.slice(-4) : previousCard?.lastFour,
      expiry: cardForm.expiry,
    };
    const updatedCards = isEditing
      ? savedCards.map((savedCard) =>
          savedCard.id === editingCardId ? card : savedCard,
        )
      : [...savedCards, card];
    localStorage.setItem(
      `skyfinder-payment-${user.id}`,
      JSON.stringify(updatedCards),
    );
    setSavedCards(updatedCards);
    setEditingCardId(null);
    setCardForm({ cardName: "", cardNumber: "", expiry: "", cvc: "" });
  };
  // 선택한 카드의 이름과 유효기간을 수정 폼에 넣고 번호·CVC 입력은 비워 둡니다.
  const editPaymentMethod = (card) => {
    setEditingCardId(card.id);
    setCardForm({
      cardName: card.cardName,
      cardNumber: "",
      expiry: card.expiry,
      cvc: "",
    });
  };
  // 카드 수정 대상을 해제하고 카드 입력 폼을 초기화합니다.
  const cancelPaymentEdit = () => {
    setEditingCardId(null);
    setCardForm({ cardName: "", cardNumber: "", expiry: "", cvc: "" });
  };
  // 기존 PIN과 새 PIN 확인값을 검사한 뒤 사용자별 PIN을 브라우저에 저장합니다.
  const saveSitePaymentPin = () => {
    if (sitePaymentPin && sitePinForm.current !== sitePaymentPin) {
      window.alert(t("현재 결제 PIN이 일치하지 않습니다."));
      return;
    }
    if (
      sitePinForm.newPin.length !== 6 ||
      sitePinForm.newPin !== sitePinForm.confirm
    ) {
      window.alert(t("새 PIN 6자리와 PIN 확인 값을 동일하게 입력해 주세요."));
      return;
    }
    localStorage.setItem(`skyfinder-site-pin-${user.id}`, sitePinForm.newPin);
    setSitePaymentPin(sitePinForm.newPin);
    setSitePinForm({ current: "", newPin: "", confirm: "" });
    window.alert(
      t(
        sitePaymentPin
          ? "결제 PIN이 변경되었습니다."
          : "결제 PIN이 등록되었습니다.",
      ),
    );
  };
  const removePaymentMethod = (cardId) => {
    // 선택한 카드만 삭제하고 나머지 등록 결제수단은 그대로 유지합니다.
    const updatedCards = savedCards.filter(({ id }) => id !== cardId);
    localStorage.setItem(
      `skyfinder-payment-${user.id}`,
      JSON.stringify(updatedCards),
    );
    setSavedCards(updatedCards);
    setPaymentForm((current) => ({
      ...current,
      method: current.method === `card:${cardId}` ? "kakao" : current.method,
    }));
    if (editingCardId === cardId) cancelPaymentEdit();
  };
  const deleteAccount = async () => {
    // 재확인 후 계정과 연결된 예약·질문을 SQLite에서 함께 제거합니다.
    if (
      !window.confirm(
        t(
          "정말 계정을 탈퇴하시겠습니까? 예약과 질문, 결제수단이 모두 삭제됩니다.",
        ),
      )
    )
      return;
    const userId = user.id;
    try {
      await databaseApi.deleteAccount(userId);
    } catch (error) {
      window.alert(t(error.message));
      return;
    }
    const remainingBookings = bookings.filter(
      ({ ownerId }) => ownerId !== userId,
    );
    const remainingQuestions = questions.filter(
      ({ ownerId }) => ownerId !== userId,
    );
    localStorage.removeItem(`skyfinder-payment-${userId}`);
    localStorage.removeItem(`skyfinder-site-pin-${userId}`);
    localStorage.removeItem("skyfinder-user");
    setBookings(remainingBookings);
    setQuestions(remainingQuestions);
    setSavedCards([]);
    setSitePaymentPin("");
    setProfileOpen(false);
    setUser(null);
    accountDeletedDialogRef.current?.showModal();
  };
  const saveProfile = async (event) => {
    // 이름과 아바타 변경 내용을 현재 로그인 세션에도 반영합니다.
    event.preventDefault();
    const updatedUser = {
      ...user,
      name: profileForm.name.trim() || user.name,
      avatar: profileForm.avatar,
    };
    try {
      await databaseApi.updateProfile(user.id, {
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      });
    } catch (error) {
      window.alert(t(error.message));
      return;
    }
    localStorage.setItem("skyfinder-user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfileOpen(false);
  };
  // 사용자의 아바타 ID에 맞는 표시 이미지를 찾고 없으면 기본 아바타를 사용합니다.
  const selectedAvatar =
    profileAvatars.find(({ id }) => id === user?.avatar) ?? profileAvatars[0];

  // Q & A 질문 등록 및 삭제 처리
  // 로그인 및 빈 입력 여부를 확인한 뒤 질문을 저장하고 내 질문 탭에 표시합니다.
  const submitQuestion = async (event) => {
    event.preventDefault();
    if (!user) {
      setQuestionNotice("로그인 후 질문을 등록할 수 있습니다.");
      return;
    }
    const title = qnaForm.title.trim();
    const content = qnaForm.content.trim();
    if (!title || !content) return;
    try {
      const { question } = await databaseApi.createQuestion({
        title,
        content,
        ownerId: user.id,
        author: user.name,
      });
      setQuestions((current) => [question, ...current]);
    } catch (error) {
      setQuestionNotice(error.message);
      return;
    }
    setQnaForm({ title: "", content: "" });
    setQuestionNotice("질문 작성이 완료되어 업로드되었습니다.");
    setQnaTab("mine");
  };
  // 질문 삭제 API가 성공하면 화면 목록에서도 해당 질문을 제거합니다.
  const deleteQuestion = async (questionId) => {
    try {
      await databaseApi.deleteQuestion(questionId);
    } catch (error) {
      setQuestionNotice(error.message);
      return;
    }
    setQuestions((current) => current.filter(({ id }) => id !== questionId));
    setQuestionNotice("질문이 삭제되었습니다.");
  };

  // 전체 질문과 현재 사용자가 작성한 질문을 탭에 맞게 분류합니다.
  const currentOwnerId = user?.id ?? "guest";
  const myQuestions = questions.filter(
    ({ ownerId }) => ownerId === currentOwnerId,
  );
  const visibleQuestions = qnaTab === "mine" ? myQuestions : questions;
  // 현재 사용자 소유의 예약만 내 예약 창에 전달합니다.
  const myBookings = bookings.filter(
    ({ ownerId }) => ownerId === (user?.id ?? "guest"),
  );
  const cancelBooking = async (reservationNumber) => {
    // 사용자 확인을 받은 뒤 선택한 예약을 SQLite에서 제거합니다.
    if (!window.confirm(t(`${reservationNumber} 예약을 취소하시겠습니까?`)))
      return;
    try {
      await databaseApi.deleteBooking(reservationNumber);
      setBookings((current) =>
        current.filter(({ number }) => number !== reservationNumber),
      );
    } catch (error) {
      window.alert(t(error.message));
    }
  };

  return (
    <>
      {/* 8-1. 상단 로고, 메뉴, 로그인 프로필 */}
      {/* 계정 삭제에 성공한 경우에만 표시하는 작은 완료 안내 */}
      <dialog
        className="account-deleted-dialog"
        ref={accountDeletedDialogRef}
        aria-labelledby="account-deleted-title"
      >
        <span aria-hidden="true">✓</span>
        <h2 id="account-deleted-title">{t("탈퇴가 완료되었습니다")}</h2>
        <form method="dialog">
          <button type="submit" autoFocus>
            {t("확인")}
          </button>
        </form>
      </dialog>
      <Header
        user={user}
        avatarIcon={selectedAvatar.icon}
        bookingCount={myBookings.length}
        onBookings={() => setBookingsOpen(true)}
        onLogin={() => setLoginOpen(true)}
        onLogout={logout}
        onProfile={openProfile}
        onQna={() => setQnaOpen(true)}
      />
      {/* 내 예약 창을 열었을 때 사용자별 예약 목록과 취소 함수를 전달합니다. */}
      {bookingsOpen && (
        <MyBookingsModal
          bookings={myBookings}
          onClose={() => setBookingsOpen(false)}
          onCancel={cancelBooking}
          formatPrice={formatPrice}
          getAirportLabel={getAirportLabel}
        />
      )}

      {/* 각 팝업에 필요한 상태와 처리 함수를 ui 객체로 전달합니다. */}
      <AppOverlays
        ui={{
          loginOpen,
          setLoginOpen,
          loginForm,
          setLoginForm,
          loginError,
          setLoginError,
          authMode,
          setAuthMode,
          signupForm,
          setSignupForm,
          signupError,
          setSignupError,
          signup,
          login,
          findIdName,
          setFindIdName,
          resetForm,
          setResetForm,
          recoveryMessage,
          setRecoveryMessage,
          findId,
          resetPassword,
          loginSuccess,
          setLoginSuccess,
          user,
          profileOpen,
          setProfileOpen,
          profileForm,
          setProfileForm,
          profileAvatars,
          profileAvatarGroups,
          saveProfile,
          savedCards,
          editingCardId,
          sitePaymentPin,
          sitePinForm,
          setSitePinForm,
          cardForm,
          setCardForm,
          savePaymentMethod,
          editPaymentMethod,
          cancelPaymentEdit,
          saveSitePaymentPin,
          removePaymentMethod,
          deleteAccount,
          qnaOpen,
          setQnaOpen,
          qnaForm,
          setQnaForm,
          submitQuestion,
          questionNotice,
          qnaTab,
          setQnaTab,
          visibleQuestions,
          myQuestions,
          currentOwnerId,
          deleteQuestion,
          selectedFlight,
          setSelectedFlight,
          searchedTrip,
          selectedOutbound,
          formatPrice,
          bookingForm,
          setBookingForm,
          requestPaymentPin,
          paymentForm,
          setPaymentForm,
          paymentPinOpen,
          setPaymentPinOpen,
          paymentPin,
          setPaymentPin,
          reserveFlight,
          bookingComplete,
          setBookingComplete,
        }}
      />
      {isAboutPage && <AboutPage language={language} />}
      <main className="container" id="flight-search" hidden={isAboutPage}>
        <section className="flight-search-hero" aria-label={t("항공권 검색")}>
          {/* 검색 폼의 높이에 맞춰 여행 영상 배경도 함께 늘어납니다. */}
          <aside
            className="travel-video-popup"
            aria-label={t("여행지 미리보기 영상")}
          >
            <video
              key={travelScene}
              src={travelScenes[travelScene]}
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              onTimeUpdate={(event) => {
                if (event.currentTarget.currentTime >= 4) {
                  setTravelScene((scene) => (scene + 1) % travelScenes.length);
                }
              }}
            />
          </aside>
          <div className="container flight-search-hero-content">
            <h1>{t("어디로 떠나시나요?")}</h1>
            <p className="sub-title">
              {t("여러 항공사의 항공권을 한눈에 비교해 보세요.")}
            </p>
            {/* 항공권 검색 입력 영역 */}
            <FlightSearchForm
              form={form}
              today={today}
              isSearching={isSearching}
              updateTripType={updateTripType}
              updateAirport={updateAirport}
              updateForm={updateForm}
              searchFlights={searchFlights}
            />
          </div>
        </section>
        {/* 검색 결과나 입력 오류 안내를 표시합니다. */}
        {message && <p role="status">{t(message)}</p>}
        {/* 다구간 검색 결과가 준비되면 구간별 선택 컴포넌트를 표시합니다. */}
        {!isSearching && multiCityResults && searchedTrip && (
          <MultiCityResults
            key={JSON.stringify(searchedTrip)}
            trip={searchedTrip}
            results={multiCityResults}
            onAirlineSelect={setSpecialAirline}
            onBook={setSelectedFlight}
          />
        )}
        {/* 항공편을 조회하는 동안 로딩 안내를 표시합니다. */}
        {isSearching && (
          <div
            className="flight-search-loading"
            role="status"
            aria-live="polite"
          >
            <span className="loading-plane" aria-hidden="true">
              ✈
            </span>
            <div>
              <strong>{t("최적의 항공편을 찾고 있어요")}</strong>
              <small>{t("항공사별 스케줄과 가격을 비교 중입니다.")}</small>
            </div>
            <i aria-hidden="true"></i>
          </div>
        )}
        {!isSearching &&
          searchedTrip &&
          !multiCityResults &&
          flightResults.length === 0 && (
            <section
              className="flight-no-route"
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">✈</span>
              <div>
                <small>NO DIRECT FLIGHTS</small>
                <strong>{t("선택 날짜에 조회되는 직항편이 없습니다")}</strong>
                <p>
                  {t("선택한 공항이나 여행 날짜를 변경해 다시 검색해 주세요.")}
                </p>
              </div>
            </section>
          )}
        {/* 일반 검색 결과의 노선·관광지·항공편 목록을 표시하고 예매 선택을 연결합니다. */}
        {flightResults.length > 0 && (
          <section
            className="flight-results"
            aria-labelledby="flight-results-title"
          >
            <div className="flight-results-heading">
              <div>
                <span>AVAILABLE FLIGHTS</span>
                <h2 id="flight-results-title">{t("항공 스케줄")}</h2>
              </div>
              <b>
                {t(searchedTrip.tripType === "round-trip" ? "왕복" : "편도")}
              </b>
            </div>
            {destinationAttractions[searchedTrip.arrival]?.length > 0 && (
              <aside
                className="destination-attractions"
                aria-label={t("도착지 대표 관광지")}
              >
                <div className="destination-attractions-title">
                  <span>DESTINATION HIGHLIGHTS</span>
                  <h3>
                    {t(destinationCityNames[searchedTrip.arrival])}
                    {t(" 대표 관광지")}
                  </h3>
                  <p>{t("도착 후 둘러보기 좋은 명소를 확인해 보세요.")}</p>
                </div>
                <ul>
                  {(destinationAttractions[searchedTrip.arrival] ?? []).map(
                    (attraction, index) => (
                      <li key={attraction}>
                        <b aria-hidden="true">{t(index + 1)}</b>
                        <span>{t(attraction)}</span>
                      </li>
                    ),
                  )}
                </ul>
              </aside>
            )}
            <div className="flight-list">
              {flightResults.map((flight) => {
                const totalPrice = flight.price;
                return (
                  <article className="flight-card" key={flight.id}>
                    <div className="airline-info">
                      <AirlineLogo airline={flight.airline} />
                      <div>
                        <button
                          type="button"
                          className="airline-special-link"
                          onClick={() => setSpecialAirline(flight.airline)}
                        >
                          {t(flight.airline.name)}
                        </button>
                        <AirlineCountry airline={flight.airline} />
                        {flight.promotion && (
                          <small className="airline-special-badge">
                            {t("특가")} −
                            {Math.round(flight.promotion.discountRate * 100)}% ·{" "}
                            <del>{t(formatPrice(flight.originalPrice))}</del>
                          </small>
                        )}
                        <small>
                          {t(flight.cabinLabel)} · {t(flight.flightNumber)}
                          {t(" · 운항사")}
                          {t(" ")}
                          {t(flight.airline.name)}
                        </small>
                      </div>
                    </div>
                    <div className="flight-time">
                      <strong>{t(flight.departureTime)}</strong>
                      <div>
                        <small>
                          {t("예정 ")}
                          {t(flight.duration)}
                        </small>
                        <i></i>
                        <span>{t("직항 · 현지시간")}</span>
                      </div>
                      <strong>
                        {t(flight.arrivalTime)}
                        {flight.arrivalDayOffset !== 0 && (
                          <sup>
                            {t(flight.arrivalDayOffset > 0 ? "+" : "")}
                            {t(flight.arrivalDayOffset)}
                            {t("일")}
                          </sup>
                        )}
                      </strong>
                    </div>
                    <div className="flight-airports">
                      <span>{t(searchedTrip.departure)}</span>
                      <span>{t(searchedTrip.arrival)}</span>
                    </div>
                    <div className="flight-price">
                      <small>
                        {t(
                          searchedTrip.tripType === "round-trip"
                            ? "가는 편 1인"
                            : "1인 편도",
                        )}
                      </small>
                      <strong>{t(formatPrice(totalPrice))}</strong>
                      <small>{t(flight.priceLabel)}</small>
                      <span>
                        {t(
                          flight.seats == null
                            ? "좌석 수 미제공"
                            : `잔여 ${flight.seats}석`,
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectOutboundFlight(flight)}
                      disabled={isSearching}
                    >
                      {t(
                        searchedTrip.tripType === "round-trip"
                          ? "가는 편 선택"
                          : "예매하기",
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        {/* 왕복에서 가는 편을 고른 뒤 오는 편의 조회 결과와 선택 버튼을 표시합니다. */}
        {returnFlightResults.length > 0 && selectedOutbound && (
          <section
            className="flight-results return-flight-results"
            id="return-flights"
            aria-labelledby="return-flights-title"
          >
            <div className="selected-outbound">
              <span>{t("가는 편 선택 완료")}</span>
              <strong>
                {t(selectedOutbound.airline.name)}{" "}
                {t(selectedOutbound.flightNumber)}
              </strong>
              <p>
                {t(searchedTrip.departure)} {t(selectedOutbound.departureTime)}{" "}
                →{t(" ")}
                {t(searchedTrip.arrival)} {t(selectedOutbound.arrivalTime)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedOutbound(null);
                  setReturnFlightResults([]);
                }}
              >
                {t("다시 선택")}
              </button>
            </div>
            <div className="flight-results-heading">
              <div>
                <span>RETURN FLIGHTS</span>
                <h2 id="return-flights-title">{t("오는 편을 선택해보세요")}</h2>
              </div>
              <b>{t("2단계")}</b>
            </div>
            <div className="flight-list">
              {returnFlightResults.map((flight) => (
                <article className="flight-card" key={flight.id}>
                  <div className="airline-info">
                    <AirlineLogo airline={flight.airline} />
                    <div>
                      <button
                        type="button"
                        className="airline-special-link"
                        onClick={() => setSpecialAirline(flight.airline)}
                      >
                        {t(flight.airline.name)}
                      </button>
                      <AirlineCountry airline={flight.airline} />
                      {flight.promotion && (
                        <small className="airline-special-badge">
                          {t("특가")} −
                          {Math.round(flight.promotion.discountRate * 100)}% ·{" "}
                          <del>{t(formatPrice(flight.originalPrice))}</del>
                        </small>
                      )}
                      <small>
                        {t(flight.cabinLabel)} · {t(flight.flightNumber)}
                      </small>
                    </div>
                  </div>
                  <div className="flight-time">
                    <strong>{t(flight.departureTime)}</strong>
                    <div>
                      <small>
                        {t("예정 ")}
                        {t(flight.duration)}
                      </small>
                      <i></i>
                      <span>{t("직항 · 현지시간")}</span>
                    </div>
                    <strong>
                      {t(flight.arrivalTime)}
                      {flight.arrivalDayOffset !== 0 && (
                        <sup>
                          {t(flight.arrivalDayOffset > 0 ? "+" : "")}
                          {t(flight.arrivalDayOffset)}
                          {t("일")}
                        </sup>
                      )}
                    </strong>
                  </div>
                  <div className="flight-airports">
                    <span>{t(searchedTrip.arrival)}</span>
                    <span>{t(searchedTrip.departure)}</span>
                  </div>
                  <div className="flight-price">
                    <small>{t("오는 편 1인")}</small>
                    <strong>{t(formatPrice(flight.price))}</strong>
                    <small>{t(flight.priceLabel)}</small>
                    <span>
                      {t(
                        flight.seats == null
                          ? "좌석 수 미제공"
                          : `잔여 ${flight.seats}석`,
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFlight(flight)}
                  >
                    {t("오는 편 선택")}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {/* 인기 여행지 가격과 공항별 직항 노선 영역 */}
        <section className="route-section" id="direct-routes">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DIRECT ROUTES</span>
              <h2>{t("공항별 주요 직항 노선")}</h2>
            </div>
            <div className="route-heading-side">
              <div
                className="route-discovery-switch"
                data-active={activeDiscovery}
              >
                <section
                  className={`popular-section${isPopularOpen ? " is-open" : ""}`}
                  ref={popularSectionRef}
                >
                  <button
                    className="popular-toggle"
                    type="button"
                    aria-expanded={isPopularOpen}
                    aria-pressed={activeDiscovery === "popular"}
                    onClick={() => {
                      setActiveDiscovery("popular");
                      setIsBudgetOpen(false);
                      setIsSeasonOpen(false);
                      setIsPopularOpen((open) => !open);
                    }}
                  >
                    <span>POPULAR</span>
                    <strong>
                      {t("인기")}
                      <br />
                      {t("여행지")}
                    </strong>
                  </button>
                  <div className="destination-list">
                    {destinations.map((destination) => (
                      <button
                        type="button"
                        className={`destination-card${selectedDestination?.id === destination.id ? " is-active" : ""}`}
                        key={destination.id}
                        onClick={() => setSelectedDestination(destination)}
                      >
                        <span>{t(destination.country)}</span>
                        <strong>{t(destination.city)}</strong>
                        <p>
                          {t(formatPrice(destination.from))}
                          {t("부터")}
                        </p>
                      </button>
                    ))}
                  </div>
                  {selectedDestination && (
                    <PriceChart
                      destination={selectedDestination}
                      formatPrice={formatPrice}
                    />
                  )}
                </section>
                <BudgetRoutePopup
                  isOpen={isBudgetOpen}
                  setIsOpen={setIsBudgetOpen}
                  isActive={activeDiscovery === "budget"}
                  onActivate={() => {
                    setActiveDiscovery("budget");
                    setIsPopularOpen(false);
                    setIsSeasonOpen(false);
                  }}
                  date={today}
                  onSelectRoute={({ departure, arrival, tripType }) => {
                    setForm((current) => ({
                      ...current,
                      departure,
                      arrival,
                      tripType,
                      returnDate:
                        tripType === "one-way" ? "" : current.returnDate,
                    }));
                    setMessage(
                      "선택한 노선을 검색창에 담았습니다. 여행 날짜를 선택해 주세요.",
                    );
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
                <section
                  className={`season-section${isSeasonOpen ? " is-open" : ""}`}
                  ref={seasonSectionRef}
                >
                  <button
                    className="season-toggle"
                    type="button"
                    aria-expanded={isSeasonOpen}
                    aria-pressed={activeDiscovery === "season"}
                    aria-controls="season-guide"
                    onClick={() => {
                      setActiveDiscovery("season");
                      setIsPopularOpen(false);
                      setIsBudgetOpen(false);
                      setIsSeasonOpen((open) => !open);
                    }}
                  >
                    <strong>
                      <span>{t("성수기 &")}</span>
                      <span>{t("비수기")}</span>
                    </strong>
                  </button>
                  {isSeasonOpen && (
                    <aside
                      id="season-guide"
                      className="season-guide"
                      aria-labelledby="season-guide-title"
                    >
                      <header>
                        <div>
                          <small>TRAVEL CALENDAR</small>
                          <h3 id="season-guide-title">
                            {t("성수기 & 비수기")}
                          </h3>
                        </div>
                        <button
                          type="button"
                          aria-label={t("성수기 & 비수기 안내 닫기")}
                          onClick={() => setIsSeasonOpen(false)}
                        >
                          ×
                        </button>
                      </header>
                      <div className="season-period peak">
                        <b>{t("성수기")}</b>
                        <div className="season-dates">
                          <strong>{t("7월 1일 ~ 8월 31일")}</strong>
                          <strong>{t("12월 20일 ~ 1월 10일")}</strong>
                        </div>
                      </div>
                      <div className="season-period off-peak">
                        <b>{t("비수기")}</b>
                        <div className="season-dates">
                          <strong>{t("3월 1일 ~ 5월 31일")}</strong>
                          <strong>{t("9월 1일 ~ 11월 30일")}</strong>
                        </div>
                      </div>
                      <div className="season-period regular">
                        <b>{t("나머지 기간")}</b>
                        <div className="season-dates">
                          <strong>{t("성수기·비수기 외 기간")}</strong>
                        </div>
                      </div>
                      <small className="season-note">
                        {t("각 구간의 출발일을 기준으로 가격이 적용됩니다.")}
                      </small>
                      <small className="season-note">
                        {t(
                          "연휴와 목적지의 날씨·행사에 따라 날짜와 항공권 가격은 달라질 수 있습니다.",
                        )}
                      </small>
                    </aside>
                  )}
                </section>
              </div>
            </div>
          </div>
          <div className="continent-picker" aria-label={t("대륙별 공항 목록")}>
            {airportCardsByContinent.map(({ continent, airports }) => (
              <button
                type="button"
                className={`continent-card continent-${continent}`}
                onClick={() => {
                  setSelectedContinent(continent);
                  setOpenAirport(null);
                }}
                key={continent}
              >
                {(() => {
                  return (
                    <ContinentIcon
                      continent={continent}
                      className="continent-icon"
                      aria-hidden="true"
                    />
                  );
                })()}
                <span>{t(continent)}</span>
                <strong>
                  {t(airports.length)}
                  {t("개 공항")}
                </strong>
                <small>{t("공항 카드 전체 보기 →")}</small>
              </button>
            ))}
          </div>
          {selectedContinent && (
            <div
              className="continent-airport-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedContinent(null);
                  setOpenAirport(null);
                }
              }}
            >
              <section
                className="continent-airport-popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby="continent-airport-title"
              >
                <header>
                  <div>
                    <span>CONTINENT AIRPORTS</span>
                    <h3 id="continent-airport-title">
                      {t(selectedContinent)}
                      {t(" 공항")}
                    </h3>
                    <p>
                      {t("공항 카드를 누르면 상세 주소를 확인할 수 있습니다.")}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={t("대륙별 공항 팝업 닫기")}
                    onClick={() => {
                      setSelectedContinent(null);
                      setOpenAirport(null);
                    }}
                  >
                    ×
                  </button>
                </header>
                <div className="airport-route-list continent-airport-list">
                  {airportCardsByContinent
                    .find(({ continent }) => continent === selectedContinent)
                    ?.airports.map((airport) => (
                      <AirportCard
                        airport={airport}
                        englishName={airportEnglishNames[airport.code]}
                        address={airportAddresses[airport.code]}
                        isOpen={openAirport === airport.code}
                        onToggle={() => {
                          setOpenAirport((current) =>
                            current === airport.code ? null : airport.code,
                          );
                          setForm((current) => ({
                            ...current,
                            departure: airport.code,
                            stopover: "",
                            arrival: "",
                          }));
                        }}
                        key={airport.code}
                      />
                    ))}
                </div>
              </section>
            </div>
          )}
          <AirlineSpecials onSelect={setSpecialAirline} language={language} />
          <aside
            className="route-promotion-strip"
            aria-label={t("여행 프로모션 예시")}
          >
            <article className="route-promotion route-promotion-baggage">
              <button
                type="button"
                className="promotion-card-trigger"
                aria-label={
                  language === "en"
                    ? "Baggage details"
                    : "수하물 광고 자세히 보기"
                }
                onClick={() => setPromotionKind("baggage")}
              />
              <div className="promotion-copy">
                <small>SKY BAGGAGE</small>
                <strong>
                  {t("수하물 걱정 없이")}
                  <br />
                  {t("가볍게 출발해보세요")}
                </strong>
                <p>{t("추가 수하물 사전 예약 시 최대 20% 혜택")}</p>
              </div>
              <b className="promotion-icon" aria-hidden="true">
                🧳
              </b>
            </article>
            <article className="route-promotion route-promotion-stay">
              <button
                type="button"
                className="promotion-card-trigger"
                aria-label={
                  language === "en"
                    ? "Accommodation details"
                    : "숙소 광고 자세히 보기"
                }
                onClick={() => setPromotionKind("stay")}
              />
              <div className="promotion-copy">
                <small>SKY STAY</small>
                <strong>
                  {t("항공권 다음은")}
                  <br />
                  {t("여행지 숙소 찾기")}
                </strong>
                <p>{t("예약 변경이 자유로운 숙소를 모아보세요")}</p>
              </div>
              <b className="promotion-icon" aria-hidden="true">
                🏨
              </b>
            </article>
            <article className="route-promotion route-promotion-esim">
              <button
                type="button"
                className="promotion-card-trigger"
                aria-label={
                  language === "en" ? "eSIM details" : "이심 광고 자세히 보기"
                }
                onClick={() => setPromotionKind("esim")}
              />
              <div className="promotion-copy">
                <small>TRAVEL eSIM</small>
                <strong>
                  {t("도착하는 순간")}
                  <br />
                  {t("바로 연결되는 여행")}
                </strong>
                <p>{t("아시아 7일 데이터 플랜을 간편하게 준비해보세요")}</p>
              </div>
              <b className="promotion-icon" aria-hidden="true">
                📶
              </b>
            </article>
          </aside>
          <TravelSidePromotions
            language={language}
            onSelect={setPromotionKind}
          />
          <p className="promotion-disclaimer">
            {t("위 프로모션은 화면 구성을 위한 시연용 광고입니다.")}
          </p>
          <p className="route-notice">
            {t(
              "주요 직항 노선 예시이며 실제 운항지는 계절과 항공사 일정에 따라 변경될 수 있습니다.",
            )}
          </p>
        </section>
      </main>
      {specialAirline && (
        <AirlineSpecialDialog
          airline={specialAirline}
          language={language}
          onClose={() => setSpecialAirline(null)}
        />
      )}
      {promotionKind && (
        <PromotionDetails
          kind={promotionKind}
          language={language}
          onClose={() => setPromotionKind(null)}
        />
      )}
    </>
  );
}
