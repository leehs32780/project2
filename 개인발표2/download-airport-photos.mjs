import fs from "node:fs/promises";
import path from "node:path";

// 각 공항의 위키백과 문서에 연결된 실사진과 Commons 저작자·라이선스 정보를 함께 저장합니다.
const pages = {
  FCO: "Rome Fiumicino Airport", MXP: "Milan Malpensa Airport", MAD: "Adolfo Suárez Madrid–Barajas Airport",
  BCN: "Josep Tarradellas Barcelona–El Prat Airport", ZRH: "Zurich Airport", VIE: "Vienna International Airport",
  MUC: "Munich Airport", PRG: "Václav Havel Airport Prague", WAW: "Warsaw Chopin Airport", HEL: "Helsinki Airport",
  LIS: "Humberto Delgado Airport", ATH: "Athens International Airport", GRU: "São Paulo/Guarulhos International Airport",
  GIG: "Rio de Janeiro/Galeão International Airport", EZE: "Ministro Pistarini International Airport",
  SCL: "Arturo Merino Benítez International Airport", LIM: "Jorge Chávez International Airport", BOG: "El Dorado International Airport",
  JNB: "O. R. Tambo International Airport", CPT: "Cape Town International Airport", CAI: "Cairo International Airport",
  ADD: "Addis Ababa Bole International Airport", NBO: "Jomo Kenyatta International Airport", CMN: "Mohammed V International Airport",
};
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));
const imageDir = path.join(decodeURIComponent(root), "images");
const headers = { "User-Agent": "SkyFinderAirportPhotos/1.0 (educational airport directory)" };
async function json(host, params) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`https://${host}/w/api.php?${new URLSearchParams({ action: "query", format: "json", ...params })}`, { headers, signal: AbortSignal.timeout(25000) });
    if (response.status === 429) { await new Promise(resolve => setTimeout(resolve, 10000)); continue; }
    if (!response.ok) throw new Error(`${host}: HTTP ${response.status}`);
    return response.json();
  }
  throw new Error(`${host}: rate limited`);
}
const result = [];
const allPages = await json("en.wikipedia.org", { titles: Object.values(pages).join("|"), redirects: "1", prop: "pageimages", pithumbsize: "640", piprop: "thumbnail|name" });
function resolvePage(title) {
  let resolved = title;
  for (const item of [...(allPages.query.normalized ?? []), ...(allPages.query.redirects ?? [])]) if (item.from === resolved) resolved = item.to;
  return Object.values(allPages.query.pages).find(page => page.title === resolved);
}
const overrides = {
  MAD: "MAD-LEMD T4 Satélite.jpg",
  FCO: "Aeroporto di Roma-Fiumicino (2024) 1.jpg",
  BCN: "Barcelona-T1-exterior.jpg",
  MUC: "Munich airport 2019 2.jpg",
  HEL: "Entrance to Helsinki Airport in early morning.jpg",
  ATH: "Athens International Airport Eleftherios Venizelos Διεθνής Αερολιμένας Αθηνών Ελευθέριος Βενιζέλος 2019-12-01 i.jpg",
  EZE: "Ezeizaaero.jpg",
  LIS: "PortelaAirport Terminal2.jpg",
  LIM: "Aeropuerto Internacional Jorge Chávez en 2024.jpg",
  PRG: "Check-in on terminal 2 of the Václav Havel Airport in Prague.jpg",
  SCL: "Terminal Aeropuerto Pudahuel.jpg",
  JNB: "Concourse in Terminal A of OR Tambo Airport June 2026.jpg",
};
const selected = Object.entries(pages).map(([code, title]) => ({ code, page: resolvePage(title), fileTitle: overrides[code] ?? resolvePage(title)?.pageimage }));
console.log(selected.map(({ code, fileTitle }) => `${code}: ${fileTitle}`).join("\n"));
const allInfo = await json("commons.wikimedia.org", { titles: selected.filter(x => x.fileTitle).map(x => `File:${x.fileTitle}`).join("|"), prop: "imageinfo", iiprop: "extmetadata|url", iiurlwidth: "640" });
const existing = JSON.parse(await fs.readFile(path.join(imageDir, "world-airport-photo-sources.json"), "utf8").catch(() => "[]"));
for (const [code, title] of Object.entries(pages)) {
  try {
    const { page, fileTitle } = selected.find(item => item.code === code);
    if (!fileTitle || /\.svg$/i.test(fileTitle)) throw new Error(`No photo: ${fileTitle}`);
    const metadata = Object.values(allInfo.query.pages).find(item => item.title.replaceAll("_", " ") === `File:${fileTitle}`.replaceAll("_", " "))?.imageinfo?.[0];
    if (!metadata) throw new Error("No Commons metadata");
    const image = metadata.thumburl ?? metadata.url;
    const saved = existing.find(item => item.code === code && item.source === metadata.descriptionurl);
    if (saved) { result.push(saved); console.log(`${code}: cached`); continue; }
    const response = await fetch(image, { headers, signal: AbortSignal.timeout(25000) });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`Image HTTP ${response.status}`);
    const ext = response.headers.get("content-type").includes("png") ? "png" : "jpg";
    const file = `airport-${code.toLowerCase()}.${ext}`;
    await fs.writeFile(path.join(imageDir, file), Buffer.from(await response.arrayBuffer()));
    result.push({ code, file, page: page.title, source: metadata.descriptionurl, image, metadata: metadata.extmetadata });
    console.log(`${code}: downloaded`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    const saved = existing.find(item => item.code === code);
    if (saved) result.push(saved);
    console.log(`${code}: ERROR ${error.message}`);
  }
}
await fs.writeFile(path.join(imageDir, "world-airport-photo-sources.json"), JSON.stringify(result, null, 2));
console.log(`Downloaded ${result.length}/${Object.keys(pages).length}`);
