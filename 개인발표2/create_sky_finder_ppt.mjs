import pptxgen from "pptxgenjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "SKY FINDER";
pptx.subject = "SKY FINDER 항공권 예매 웹앱 기획 발표";
pptx.title = "SKY FINDER 프로젝트 기획 발표";
pptx.company = "SKY FINDER";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  lang: "ko-KR",
};

const C = {
  navy: "071A2F",
  navy2: "0A3153",
  blue: "168DDD",
  cyan: "75CDFF",
  pale: "EAF7FF",
  bg: "F4F8FC",
  white: "FFFFFF",
  ink: "102B43",
  muted: "667E90",
  line: "D9E7F2",
  green: "159870",
  orange: "F59E42",
};

function base(slide, section, page) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.16,
    line: { color: C.blue, transparency: 100 },
    fill: { color: C.blue },
  });
  slide.addText(section, {
    x: 0.55,
    y: 0.28,
    w: 4.5,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    color: C.blue,
    charSpacing: 1.5,
    margin: 0,
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 12.2,
    y: 0.28,
    w: 0.55,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 9,
    color: "8AA0B2",
    align: "right",
    margin: 0,
  });
}

function title(slide, text, sub) {
  slide.addText(text, {
    x: 0.6,
    y: 0.75,
    w: 11.8,
    h: 0.58,
    fontSize: 26,
    bold: true,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  if (sub) {
    slide.addText(sub, {
      x: 0.62,
      y: 1.38,
      w: 11.3,
      h: 0.35,
      fontSize: 11,
      color: C.muted,
      margin: 0,
    });
  }
}

function card(slide, x, y, w, h, heading, body, accent = C.blue) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    line: { color: C.line, width: 1 },
    fill: { color: C.white },
    shadow: { type: "outer", color: "123B69", opacity: 0.1, blur: 2, angle: 45, distance: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.07, h,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  slide.addText(heading, {
    x: x + 0.28, y: y + 0.22, w: w - 0.48, h: 0.32,
    fontSize: 15, bold: true, color: C.ink, margin: 0,
  });
  slide.addText(body, {
    x: x + 0.28, y: y + 0.7, w: w - 0.48, h: h - 0.9,
    fontSize: 11, color: C.muted, breakLine: false, valign: "top", margin: 0,
    bullet: body.includes("\n") ? { type: "bullet" } : undefined,
  });
}

function pill(slide, x, y, w, text, fill = C.pale, color = C.blue) {
  slide.addText(text, {
    x, y, w, h: 0.36,
    fontSize: 10, bold: true, color, align: "center", valign: "mid",
    fill: { color: fill }, line: { color: fill }, margin: 0.03,
    radius: 0.08,
  });
}

// 1. 표지
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  s.addImage({ path: path.join(here, "images", "airport-icn.jpg"), x: 7.2, y: 0, w: 6.133, h: 7.5, transparency: 18 });
  s.addShape(pptx.ShapeType.rect, { x: 5.3, y: 0, w: 8.1, h: 7.5, line: { transparency: 100 }, fill: { color: C.navy, transparency: 24 } });
  s.addShape(pptx.ShapeType.ellipse, { x: 0.72, y: 0.68, w: 0.66, h: 0.66, line: { color: C.cyan, width: 1.2 }, fill: { color: C.blue } });
  s.addText("✈", { x: 0.83, y: 0.82, w: 0.44, h: 0.3, fontSize: 18, color: C.white, rotate: 338, margin: 0, align: "center" });
  s.addText("SKY FINDER", { x: 1.55, y: 0.81, w: 2.5, h: 0.35, fontFace: "Aptos Display", fontSize: 17, bold: true, color: C.white, charSpacing: 1.2, margin: 0 });
  s.addText("항공권 비교부터\n예약까지, 한 번에", { x: 0.75, y: 2.15, w: 6.3, h: 1.55, fontSize: 33, bold: true, color: C.white, breakLine: false, margin: 0 });
  s.addText("React 기반 항공권 검색·예약 웹 애플리케이션", { x: 0.78, y: 4.05, w: 5.7, h: 0.4, fontSize: 15, color: "BBD8EA", margin: 0 });
  pill(s, 0.78, 4.72, 1.25, "REACT", "123F65", C.cyan);
  pill(s, 2.18, 4.72, 1.55, "LOCAL STORAGE", "123F65", C.cyan);
  pill(s, 3.88, 4.72, 1.55, "RESPONSIVE", "123F65", C.cyan);
  s.addText("PROJECT PRESENTATION  ·  2026", { x: 0.78, y: 6.68, w: 4.2, h: 0.25, fontFace: "Aptos", fontSize: 9, bold: true, color: "7799B4", charSpacing: 1.6, margin: 0 });
}

// 2. 기획 배경
{
  const s = pptx.addSlide(); base(s, "01  PROJECT OVERVIEW", 2); title(s, "왜 SKY FINDER인가?", "복잡한 항공권 탐색 과정을 하나의 사용자 흐름으로 단순화합니다.");
  card(s, 0.65, 2.05, 3.75, 3.65, "문제", "항공사별 가격과 시간을\n여러 화면에서 비교해야 함\n\n예산에 맞는 목적지를\n사용자가 직접 찾아야 함", "E06B65");
  card(s, 4.8, 2.05, 3.75, 3.65, "해결", "출발지·목적지·날짜 기반\n항공 스케줄 통합 비교\n\n예산 입력만으로 가능한\n직항 여행지를 추천", C.blue);
  card(s, 8.95, 2.05, 3.75, 3.65, "기대 효과", "검색부터 예약까지\n끊김 없는 경험 제공\n\n사용자의 선택 시간과\n탐색 부담 감소", C.green);
  s.addText("핵심 가치  |  빠른 비교 · 쉬운 선택 · 자연스러운 예약", { x: 2.3, y: 6.3, w: 8.7, h: 0.45, fontSize: 16, bold: true, color: C.navy2, align: "center", margin: 0 });
}

// 3. 목표 사용자 및 목표
{
  const s = pptx.addSlide(); base(s, "02  USER & GOAL", 3); title(s, "누구를 위한 서비스인가?", "여행 계획이 구체적이지 않아도 예산과 일정만으로 출발할 수 있도록 설계했습니다.");
  s.addShape(pptx.ShapeType.ellipse, { x: 0.9, y: 2.0, w: 2.45, h: 2.45, line: { color: "B9DDF4", width: 2 }, fill: { color: C.pale } });
  s.addText("✈", { x: 1.5, y: 2.55, w: 1.2, h: 0.8, fontSize: 42, color: C.blue, align: "center", margin: 0, rotate: 342 });
  s.addText("여행을 계획하는 사용자", { x: 0.65, y: 4.75, w: 3, h: 0.42, fontSize: 17, bold: true, color: C.ink, align: "center", margin: 0 });
  const goals = [
    ["01", "비교", "다양한 항공사와 시간대의 가격을 한눈에 확인"],
    ["02", "발견", "정해진 예산 안에서 갈 수 있는 여행지를 탐색"],
    ["03", "예약", "왕복 선택, 탑승객 입력, 결제와 예약 조회 연결"],
  ];
  goals.forEach(([n, h, b], i) => {
    const y = 1.95 + i * 1.5;
    s.addText(n, { x: 4.35, y, w: 0.6, h: 0.45, fontFace: "Aptos", fontSize: 13, bold: true, color: C.blue, margin: 0 });
    s.addText(h, { x: 5.05, y: y - 0.05, w: 1.1, h: 0.45, fontSize: 18, bold: true, color: C.ink, margin: 0 });
    s.addText(b, { x: 6.25, y: y - 0.01, w: 5.55, h: 0.6, fontSize: 12, color: C.muted, margin: 0 });
    if (i < 2) s.addShape(pptx.ShapeType.line, { x: 4.35, y: y + 0.78, w: 7.45, h: 0, line: { color: C.line, width: 1 } });
  });
}

// 4. 사용자 흐름
{
  const s = pptx.addSlide(); base(s, "03  USER FLOW", 4); title(s, "한 번에 이어지는 예약 흐름", "상태 변화에 따라 필요한 다음 화면을 순서대로 제공합니다.");
  const steps = ["조건 입력", "항공편 비교", "가는 편 선택", "오는 편 선택", "정보·결제", "예약 확인"];
  steps.forEach((step, i) => {
    const x = 0.62 + i * 2.08;
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.48, y: 2.28, w: 0.78, h: 0.78, line: { color: i === 5 ? C.green : C.blue, width: 1.5 }, fill: { color: i === 5 ? "E4F7F1" : C.pale } });
    s.addText(i === 5 ? "✓" : String(i + 1), { x: x + 0.48, y: 2.47, w: 0.78, h: 0.28, fontFace: "Aptos", fontSize: 16, bold: true, color: i === 5 ? C.green : C.blue, align: "center", margin: 0 });
    s.addText(step, { x, y: 3.28, w: 1.75, h: 0.42, fontSize: 13, bold: true, color: C.ink, align: "center", margin: 0 });
    if (i < 5) s.addShape(pptx.ShapeType.chevron, { x: x + 1.62, y: 2.47, w: 0.42, h: 0.36, line: { color: C.line }, fill: { color: "B9D7E9" } });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.05, y: 4.45, w: 11.25, h: 1.25, line: { color: "B7DCF3" }, fill: { color: "EAF7FF" } });
  s.addText("왕복 검색에서는 가는 편을 먼저 저장한 뒤 출발·도착 공항을 반대로 바꿔 오는 편 목록을 생성합니다.", { x: 1.38, y: 4.83, w: 10.6, h: 0.42, fontSize: 14, bold: true, color: C.navy2, align: "center", margin: 0 });
}

// 5. 주요 기능
{
  const s = pptx.addSlide(); base(s, "04  CORE FEATURES", 5); title(s, "핵심 기능 구성", "사용자 여정에 필요한 기능을 React 상태와 조건부 렌더링으로 연결했습니다.");
  const items = [
    ["01", "항공권 검색", "노선·날짜별 10개 스케줄과 현지 도착 시각"],
    ["02", "예산별 여행지", "편도·왕복 예산 이하 직항 노선을 최저가순 추천"],
    ["03", "회원 관리", "회원가입, 생년월일, 로그인, 프로필과 계정 복구"],
    ["04", "결제와 예약", "결제수단·PIN 확인, 예약 저장·조회·취소"],
    ["05", "여행 정보", "공항별 직항 노선, 인기 여행지와 가격 차트"],
    ["06", "Q&A", "질문 등록, 전체·내 질문 구분과 삭제"],
  ];
  items.forEach(([n, h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.63 + col * 4.2, y = 1.95 + row * 2.25;
    card(s, x, y, 3.75, 1.75, `${n}  ${h}`, b, [C.blue, C.orange, C.green][col]);
  });
}

// 6. 예산별 여행지
{
  const s = pptx.addSlide(); base(s, "05  DIFFERENTIATOR", 6); title(s, "차별화 기능 — 예산별 여행지", "목적지를 정하지 못한 사용자에게 ‘갈 수 있는 곳’부터 제안합니다.");
  s.addShape(pptx.ShapeType.roundRect, { x: 0.72, y: 1.85, w: 4.25, h: 4.75, line: { color: "BBDCED" }, fill: { color: C.white }, shadow: { type: "outer", color: "123B69", opacity: 0.15, blur: 2, angle: 45, distance: 1 } });
  s.addShape(pptx.ShapeType.rect, { x: 0.72, y: 1.85, w: 4.25, h: 0.93, line: { transparency: 100 }, fill: { color: C.navy2 } });
  s.addText("✈  이 예산으로 어디까지?", { x: 1.05, y: 2.13, w: 3.6, h: 0.35, fontSize: 17, bold: true, color: C.white, margin: 0 });
  s.addText("항공권 예산", { x: 1.08, y: 3.05, w: 1.2, h: 0.25, fontSize: 10, bold: true, color: C.muted, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.05, y: 3.37, w: 3.58, h: 0.55, line: { color: "CBDDEA" }, fill: { color: C.white } });
  s.addText("300,000원", { x: 1.3, y: 3.52, w: 3.0, h: 0.25, fontSize: 14, bold: true, color: C.ink, align: "right", margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.05, y: 4.12, w: 3.58, h: 0.53, line: { transparency: 100 }, fill: { color: C.blue } });
  s.addText("예산으로 검색", { x: 1.05, y: 4.27, w: 3.58, h: 0.24, fontSize: 11, bold: true, color: C.white, align: "center", margin: 0 });
  s.addText("편도     |     왕복", { x: 1.35, y: 4.98, w: 3.0, h: 0.28, fontSize: 11, bold: true, color: C.blue, align: "center", margin: 0 });
  s.addText("2.5초간 가격 비교 후", { x: 1.15, y: 5.62, w: 3.35, h: 0.28, fontSize: 11, color: C.muted, align: "center", margin: 0 });
  const flow = [["1", "예산 입력"], ["2", "편도·왕복 선택"], ["3", "검색 및 로딩"], ["4", "최저가순 결과"], ["5", "검색창에 노선 반영"]];
  flow.forEach(([n,h], i) => {
    const y = 1.95 + i * 0.95;
    s.addShape(pptx.ShapeType.ellipse, { x: 6.05, y, w: 0.5, h: 0.5, line: { color: C.blue }, fill: { color: C.pale } });
    s.addText(n, { x: 6.05, y: y + 0.12, w: 0.5, h: 0.2, fontFace: "Aptos", fontSize: 10, bold: true, color: C.blue, align: "center", margin: 0 });
    s.addText(h, { x: 6.85, y: y + 0.06, w: 3.4, h: 0.32, fontSize: 15, bold: true, color: C.ink, margin: 0 });
    if (i < 4) s.addShape(pptx.ShapeType.line, { x: 6.3, y: y + 0.52, w: 0, h: 0.42, line: { color: "A9CFE7", width: 1.2, dash: "dash" } });
  });
}

// 7. 기술 구조
{
  const s = pptx.addSlide(); base(s, "06  TECH ARCHITECTURE", 7); title(s, "컴포넌트와 데이터 흐름", "화면·상태·데이터 역할을 분리해 기능을 확장하기 쉽게 구성했습니다.");
  const nodes = [
    [0.8, 2.05, 2.55, 1.05, "UI COMPONENTS", "Header · Search · Modal", C.blue],
    [5.0, 2.05, 3.3, 1.05, "APP STATE", "useState · useMemo · useEffect", C.orange],
    [9.95, 2.05, 2.55, 1.05, "DATA LOGIC", "appData.js", C.green],
    [5.0, 4.55, 3.3, 1.05, "BROWSER STORAGE", "Account · Booking · Q&A", C.navy2],
  ];
  nodes.forEach(([x,y,w,h,a,b,c]) => {
    s.addShape(pptx.ShapeType.roundRect, { x,y,w,h, line: { color:c, width:1.5 }, fill:{ color:C.white }, shadow:{ type:"outer",color:"123B69",opacity:0.1,blur:1,angle:45,distance:1 } });
    s.addText(a, { x:x+0.15,y:y+0.2,w:w-0.3,h:0.23,fontFace:"Aptos",fontSize:9,bold:true,color:c,align:"center",margin:0,charSpacing:1 });
    s.addText(b, { x:x+0.15,y:y+0.58,w:w-0.3,h:0.25,fontSize:11,bold:true,color:C.ink,align:"center",margin:0 });
  });
  s.addShape(pptx.ShapeType.chevron, { x: 3.72, y: 2.38, w: 0.65, h: 0.38, line:{color:C.line}, fill:{color:"A9CCE1"} });
  s.addShape(pptx.ShapeType.chevron, { x: 8.72, y: 2.38, w: 0.65, h: 0.38, line:{color:C.line}, fill:{color:"A9CCE1"} });
  s.addShape(pptx.ShapeType.downArrow, { x: 6.32, y: 3.46, w: 0.62, h: 0.7, line:{color:C.line}, fill:{color:"A9CCE1"} });
  s.addText("React 컴포넌트가 이벤트를 전달하면 App 상태가 변경되고, 데이터 함수가 계산한 결과를 다시 화면에 렌더링합니다.", { x: 1.2, y: 6.35, w: 10.9, h: 0.38, fontSize: 13, color: C.muted, align: "center", margin: 0 });
}

// 8. 데이터 및 한계
{
  const s = pptx.addSlide(); base(s, "07  DATA & LIMITATION", 8); title(s, "현재 구현 범위와 실제 서비스의 차이", "발표용 프론트엔드 프로토타입임을 명확히 구분합니다.");
  s.addText("현재 구현", { x: 0.8, y: 1.95, w: 5.4, h: 0.42, fontSize: 19, bold: true, color: C.blue, margin: 0 });
  s.addText("실제 서비스 확장", { x: 7.1, y: 1.95, w: 5.4, h: 0.42, fontSize: 19, bold: true, color: C.green, margin: 0 });
  const left = ["발표용 항공편·가격 데이터", "localStorage 계정 및 예약 저장", "프론트엔드 결제 PIN 확인", "브라우저 안에서 완성되는 사용자 흐름"];
  const right = ["항공사·여행 API 실시간 연동", "백엔드 API와 관계형 데이터베이스", "비밀번호 해시·토큰 기반 인증", "PG사 결제 및 개인정보 보호"];
  [left,right].forEach((arr,col) => arr.forEach((t,i) => {
    const x = col ? 7.1 : 0.8, y = 2.7 + i * 0.82;
    s.addText("✓", { x, y, w:0.35,h:0.28,fontSize:12,bold:true,color:col?C.green:C.blue,margin:0 });
    s.addText(t, { x:x+0.42,y:y-0.01,w:5.0,h:0.35,fontSize:13,color:C.ink,margin:0 });
  }));
  s.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 6.08, w: 11.72, h: 0.72, line:{color:"F1D18D"},fill:{color:"FFF7E5"} });
  s.addText("※ 현재 가격과 시간은 시연용 예상 데이터이며 실제 예약 정보가 아닙니다.", { x:1.15,y:6.31,w:11,h:0.26,fontSize:12,bold:true,color:"8A5A13",align:"center",margin:0 });
}

// 9. 발표 시연 순서
{
  const s = pptx.addSlide(); base(s, "08  LIVE DEMO", 9); title(s, "5분 발표 시연 순서", "기능 나열보다 실제 사용자의 예약 여정을 따라갑니다.");
  const demo = [
    ["00:00", "서비스 소개", "항공편 비교와 예산 기반 여행지 추천"],
    ["00:40", "예산별 여행지", "예산 입력 → 로딩 → 최저가순 노선"],
    ["01:30", "왕복 검색", "출발지·도착지·날짜 입력 후 검색"],
    ["02:30", "예약 진행", "가는 편·오는 편 선택과 결제"],
    ["03:40", "회원 기능", "회원가입·로그인·프로필·내 예약"],
    ["04:30", "기술 및 마무리", "React 상태 관리와 향후 API 확장"],
  ];
  demo.forEach(([time,h,b],i) => {
    const y=1.9+i*0.78;
    pill(s,0.75,y,1.15,time,i===5?"E4F7F1":C.pale,i===5?C.green:C.blue);
    s.addText(h,{x:2.2,y:y+0.03,w:2.1,h:0.3,fontSize:14,bold:true,color:C.ink,margin:0});
    s.addText(b,{x:4.45,y:y+0.04,w:7.4,h:0.3,fontSize:12,color:C.muted,margin:0});
    if(i<5)s.addShape(pptx.ShapeType.line,{x:2.2,y:y+0.57,w:9.65,h:0,line:{color:C.line,width:1}});
  });
}

// 10. 마무리
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  s.addShape(pptx.ShapeType.arc, { x: 8.55, y: 0.75, w: 4.1, h: 4.1, adjustPoint: 0.25, rotate: 25, line: { color: C.blue, transparency: 45, width: 2 }, fill: { color: C.navy, transparency: 100 } });
  s.addText("✈", { x: 10.2, y: 2.15, w: 1.1, h: 0.75, fontSize: 40, color: C.cyan, rotate: 340, margin: 0 });
  s.addText("검색에서 예약까지,\n하나의 흐름으로", { x: 0.82, y: 1.25, w: 7.1, h: 1.35, fontSize: 32, bold: true, color: C.white, margin: 0 });
  s.addText("SKY FINDER는 React의 상태 관리와 조건부 렌더링을\n실제 항공권 예약 사용자 경험으로 연결한 프로젝트입니다.", { x: 0.85, y: 3.0, w: 6.9, h: 0.85, fontSize: 15, color: "BBD8EA", breakLine: false, margin: 0 });
  const roadmap = ["실시간 항공 API", "백엔드·DB", "실결제 연동"];
  roadmap.forEach((t,i)=>pill(s,0.85+i*1.72,4.42,1.5,t,"123F65",C.cyan));
  s.addText("THANK YOU", { x: 0.85, y: 6.35, w: 3.4, h: 0.45, fontFace: "Aptos Display", fontSize: 20, bold: true, color: C.white, charSpacing: 2.2, margin: 0 });
  s.addText("Q & A", { x: 10.35, y: 6.32, w: 1.65, h: 0.45, fontFace: "Aptos Display", fontSize: 20, bold: true, color: C.cyan, align: "right", margin: 0 });
}

for (const slide of pptx._slides) {
  slide.addNotes("슬라이드의 핵심 문장만 설명하고, 실제 기능은 브라우저 시연으로 연결하세요.");
}

await pptx.writeFile({ fileName: path.join(here, "SKY_FINDER_프로젝트_기획발표.pptx") });
