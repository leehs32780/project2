import { useEffect, useRef } from "react";
import "../../css/promotion-details.css";
import BaggageRules from "./BaggageRules";

const details = {
  transfer: {
    icon: "🚆",
    title: ["SKY PASS · 공항 이동 안내", "SKY PASS · Airport transfers"],
    intro: [
      "출발 공항과 터미널에 맞춰 이동 방법을 준비해보세요.",
      "Plan your transfer for your departure airport and terminal.",
    ],
    items: [
      [
        "공항철도",
        "Airport rail",
        "출발역, 도착 터미널, 첫차·막차와 소요 시간을 운영사에서 확인해보세요. 열차 종류에 따라 정차역과 요금이 달라요.",
        "Check stations, terminals, operating hours and journey times with the operator. Stops and fares depend on the service.",
      ],
      [
        "리무진 버스",
        "Airport bus",
        "가까운 정류장과 터미널별 노선을 확인해보세요. 도로 상황을 고려해 이동 시간을 여유 있게 잡아주세요.",
        "Find your nearest stop and terminal route. Allow extra time for traffic.",
      ],
      [
        "출발 전 확인",
        "Before departure",
        "항공편의 터미널과 체크인 마감 시간을 먼저 확인한 뒤 교통편을 선택해보세요. 이 화면에서는 승차권을 판매하지 않습니다.",
        "Check your flight terminal and check-in deadline before choosing transport. Tickets are not sold here.",
      ],
    ],
  },
  lounge: {
    icon: "☕",
    title: ["SKY LOUNGE · 라운지 안내", "SKY LOUNGE · Lounge guide"],
    intro: [
      "탑승 전 잠깐 쉬어갈 공간을 찾아보세요.",
      "Find a place to relax before boarding.",
    ],
    items: [
      [
        "위치와 운영 시간",
        "Location and hours",
        "이용 터미널과 출국 심사 전·후 위치를 확인해보세요. 탑승구까지 이동할 시간도 남겨두세요.",
        "Check the terminal and whether the lounge is before or after security. Leave time to reach your gate.",
      ],
      [
        "입장 조건",
        "Entry requirements",
        "이용권, 항공권 등급 또는 제휴 카드별 조건이 다릅니다. 동반인 요금과 이용 가능 시간을 확인해보세요.",
        "Access depends on passes, cabin class or card benefits. Check guest fees and permitted hours.",
      ],
      [
        "제공 서비스",
        "Facilities",
        "식음료, 좌석, 샤워 시설 등은 라운지마다 달라요. 방문할 라운지의 실제 제공 서비스를 확인해보세요.",
        "Food, seating and showers vary by lounge. Check the facilities at your chosen location.",
      ],
    ],
  },
  baggage: {
    icon: "🧳",
    title: ["수하물 안내", "Baggage guide"],
    intro: [
      "짐을 준비하기 전에 항공권에 포함된 수하물 조건을 확인해보세요.",
      "Check the baggage allowance included with your fare before packing.",
    ],
    items: [
      [
        "기내 수하물",
        "Cabin baggage",
        "기내에 가지고 타는 짐입니다. 크기·무게·개수는 이용 항공사와 좌석에 따라 확인해보세요.",
        "Check your airline's size, weight and item limits for bags carried into the cabin.",
      ],
      [
        "위탁 수하물",
        "Checked baggage",
        "체크인할 때 맡기는 짐입니다. 항공권에 포함된 허용량과 추가 요금을 확인해보세요.",
        "Review the allowance and any extra charges for bags checked in at the airport.",
      ],
      [
        "추가 수하물 준비",
        "Extra baggage",
        "짐이 많다면 항공사에서 사전 구매 가능 여부와 공항 결제 요금을 비교해보세요.",
        "If you need extra baggage, compare advance purchase options with airport charges.",
      ],
    ],
  },
  stay: {
    icon: "🏨",
    title: ["여행지 숙소 안내", "Accommodation guide"],
    intro: [
      "여행 동선과 일정에 맞는 숙소를 고르는 데 필요한 정보를 살펴보세요.",
      "Find out what to consider when choosing a place to stay.",
    ],
    items: [
      [
        "위치와 이동",
        "Location",
        "공항에서의 이동 시간, 대중교통과 주요 여행지까지의 거리를 함께 확인해보세요.",
        "Consider airport transfers, public transport and distance to the places you plan to visit.",
      ],
      [
        "숙박 조건",
        "Room details",
        "숙박 인원, 체크인·체크아웃 시간, 조식과 편의시설 포함 여부를 확인해보세요.",
        "Check guest limits, check-in and check-out times, breakfast and amenities.",
      ],
      [
        "변경과 취소",
        "Changes and cancellations",
        "무료 취소 기한과 환불 조건은 숙소와 상품마다 달라요. 예약 전에 총 금액과 함께 확인해보세요.",
        "Cancellation deadlines and refunds vary by property and rate. Review these alongside the total price.",
      ],
    ],
  },
  esim: {
    icon: "📶",
    title: ["여행 eSIM 안내", "Travel eSIM guide"],
    intro: [
      "실물 유심을 바꾸지 않고 여행지에서 모바일 데이터를 이용하는 방식이에요.",
      "An eSIM lets you use mobile data abroad without swapping a physical SIM.",
    ],
    items: [
      [
        "기기 호환 확인",
        "Device compatibility",
        "휴대전화가 eSIM을 지원하는지, 통신사 잠금이 해제되어 있는지 먼저 확인해보세요.",
        "First check that your phone supports eSIM and is carrier unlocked.",
      ],
      [
        "국가·기간·데이터",
        "Coverage and data",
        "방문 국가, 이용 일수, 필요한 데이터 용량을 기준으로 선택해보세요. 통화·문자 포함 여부도 확인해보세요.",
        "Choose coverage, validity and data for your trip. Check whether calls and texts are included.",
      ],
      [
        "설치와 사용 시작",
        "Installation and activation",
        "판매처의 설치 안내를 따르고 사용 기간이 언제 시작되는지 확인해보세요. 설치와 개통 시점은 상품마다 달라요.",
        "Follow the provider's setup instructions and check when validity starts; installation and activation rules vary.",
      ],
    ],
  },
};

export default function PromotionDetails({ kind, language, onClose }) {
  const dialogRef = useRef(null);
  const en = language === "en";
  const data = details[kind];
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="promotion-details"
      aria-labelledby="promotion-details-title"
      onClose={(event) => {
        // StrictMode의 effect 재실행 중 예약된 close 이벤트는 다시 열린 창을 닫지 않습니다.
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          onClose();
      }}
    >
      <header>
        <span aria-hidden="true">{data.icon}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={en ? "Close" : "닫기"}
        >
          ×
        </button>
      </header>
      <h2 id="promotion-details-title">{data.title[en ? 1 : 0]}</h2>
      <p>{data.intro[en ? 1 : 0]}</p>
      {kind === "baggage" && <BaggageRules en={en} />}
      <div className="promotion-detail-items">
        {data.items
          .filter((_, index) => kind !== "baggage" || index > 1)
          .map((item) => (
            <section key={item[0]}>
              <h3>{item[en ? 1 : 0]}</h3>
              <p>{item[en ? 3 : 2]}</p>
            </section>
          ))}
      </div>
      {kind === "baggage" && (
        <small className="baggage-booking-note">
          {en
            ? "Detailed baggage rules vary by airline. Please check your airline’s policy before booking."
            : "자세한 수하물 규정은 항공사마다 다르므로, 예약 전 반드시 이용하실 항공사의 규정을 확인해보세요."}
        </small>
      )}
      <button className="primary-button" type="button" onClick={onClose}>
        {en ? "Done" : "확인"}
      </button>
    </dialog>
  );
}
