import { worldAirports } from "./worldAirports";

// 로컬 사진을 Vite 빌드에 포함합니다. 외부 이미지 서버에 접속하지 않아도 카드가 표시됩니다.
const files = import.meta.glob("../../images/airport-*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

export const worldAirportPhotos = Object.fromEntries(
  worldAirports.map(({ code }) => [
    code,
    files[`../../images/airport-${code.toLowerCase()}.jpg`],
  ]),
);
