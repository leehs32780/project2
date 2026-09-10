const source = "https://www.airport.kr/ap_en/1434/subview.do";
const airline = "https://www.koreanair.com/contents/plan-your-travel/baggage/restricted-item";

const rules = [
  {
    title: ["기내 수하물", "Cabin baggage"],
    groups: [
      ["조건부 허용", "Allowed with conditions", [
        ["노트북·태블릿: 배터리 규정을 확인하고 보안검색 때 별도로 꺼내세요.", "Laptops and tablets: check battery rules and remove for screening.", source],
        ["국제선 액체·젤: 용기당 100ml 이하, 1인당 투명한 1L 지퍼백 1개. 남은 양이 아닌 용기 크기 기준입니다.", "International liquids/gels: containers up to 100 ml, in one transparent 1 L bag per person. Container capacity counts.", source],
        ["필요한 액상 의약품·유아식: 비행 중 필요한 양에 한해 예외가 있으며, 의약품 증빙 등 별도 확인이 필요합니다.", "Essential liquid medicines and infant food have exceptions for flight needs; documentation and screening may apply.", source],
        ["보조배터리·여분 배터리: 위탁하지 말고 휴대해보세요. 용량·개수·항공사 승인 조건을 확인해보세요.", "Power banks and spare batteries: carry on only; check capacity, quantity and approval requirements.", airline],
      ]],
      ["반입 금지 / 위탁 필요", "Prohibited / check in instead", [
        ["칼: 칼날 길이와 관계없이 기내 금지, 위탁 가능.", "Knives: no cabin carriage regardless of blade length; checked carriage allowed.", source],
        ["인화성 물질·부탄가스·폭죽: 기내와 위탁 모두 금지.", "Flammable materials, butane gas and fireworks: prohibited in both.", airline],
      ]],
    ],
  },
  {
    title: ["위탁 수하물", "Checked baggage"],
    groups: [
      ["조건부 허용", "Allowed with conditions", [
        ["칼: 위탁 가능. 다치지 않도록 안전하게 포장해보세요.", "Knives: allowed in checked baggage; pack safely.", source],
        ["향수·헤어스프레이 등 일부 생활용품: 개별 500ml 이하, 1인당 합계 2L 이하. 모든 스프레이에 적용되는 허용 규정은 아닙니다.", "Certain toiletries such as perfume and hairspray: up to 500 ml each, 2 L total per person. This does not permit all aerosols.", airline],
        ["배터리 장착 전자기기: 위탁 시 완전히 끄고 용량 및 승인 조건을 확인해보세요. 귀중품은 휴대를 권장합니다.", "Devices with installed batteries: switch off fully and check capacity and approval conditions. Keep valuables with you.", airline],
      ]],
      ["위탁 금지", "Not allowed in checked baggage", [
        ["보조배터리·여분 리튬배터리·전자담배: 위탁 금지. 휴대 조건과 목적지 제한을 확인해보세요.", "Power banks, spare lithium batteries and vapes: no checked carriage. Check cabin and destination restrictions.", airline],
        ["라이터·성냥: 위탁 금지. 휴대도 종류와 출발 국가별 제한이 있습니다.", "Lighters and matches: no checked carriage; cabin restrictions depend on type and departure country.", airline],
        ["인화성 물질·부탄가스·폭죽: 위탁과 기내 모두 금지.", "Flammable materials, butane gas and fireworks: prohibited in both.", airline],
      ]],
    ],
  },
];

export default function BaggageRules({ en }) {
  return (
    <div className="baggage-rules">
      <p className="baggage-scope">{en ? "Korea departure guidance · Reviewed 2026-09-09. Liquid limits below apply to international flights. Airline, transfer airport and destination rules may differ." : "한국 출발 참고 안내 · 확인일 2026-09-09. 아래 액체 제한은 국제선 기준입니다. 항공사·환승 공항·목적지에 따라 규정이 달라질 수 있어요."}</p>
      {rules.map(({ title, groups }) => (
        <details className="baggage-rule-section" key={title[0]}>
          <summary>{title[en ? 1 : 0]}<span>{en ? "View rules" : "반입 규정 보기"}</span></summary>
          {groups.map(([ko, english, items], index) => (
            <section className={`baggage-rule-group ${index === 0 ? "allowed" : "restricted"}`} key={ko}>
              <h3>{en ? english : ko}</h3>
              <ul>{items.map(([text, translation]) => <li key={text}>{en ? translation : text}</li>)}</ul>
            </section>
          ))}
          <p className="baggage-scope">{en ? "Baggage size, weight and piece allowances depend on your airline, route and fare. Check your booking before packing." : "가방 크기·무게·개수는 항공사·노선·운임별로 다릅니다. 예약한 항공권의 허용량을 확인해보세요."}</p>
        </details>
      ))}
    </div>
  );
}
