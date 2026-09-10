import { messages } from './messages.js';
import { places } from './places.js';
import { attractions } from './attractions.js';
import { getLanguage, formatMoney } from './locale.js';
import { allRouteAirports, airportEnglishNames, airports } from '../data/appData.js';

const airportNames = Object.fromEntries([...allRouteAirports, ...airports]
  .filter(a => airportEnglishNames[a.code]).map(a => [a.name, airportEnglishNames[a.code]]));
export const englishCatalog = { ...messages, ...places, ...attractions, ...airportNames,
  '회원 정보를 확인해 주세요.': 'Please check your account details.',
  '이미 사용 중인 아이디입니다.': 'This username is already in use.',
  '아이디 또는 비밀번호가 올바르지 않습니다.': 'Incorrect username or password.',
  '아이디와 이름이 일치하는 계정을 찾을 수 없습니다.': 'No account matches this username and name.',
  '계정을 찾을 수 없습니다.': 'Account not found.',
  '데이터베이스 처리 중 오류가 발생했습니다.': 'Unable to process your request. Please try again.',
  '요청에 실패했습니다.': 'The request failed. Please try again.',
  '소요시간 미제공': 'Duration not provided',
  '참고 운임 기반 시간대별 예상가': 'Time-based estimate from reference fares',
  '공개 운임 기반 참고가': 'Reference based on published fares',
  '실시간 조회': 'Live results',
  'API 테스트 데이터': 'API test data',
  '예상 데이터': 'Estimated data',
  '항공편 응답 형식이 올바르지 않습니다.': 'Invalid flight response format.',
};
const keys = Object.keys(englishCatalog).filter(k => k.length > 1).sort((a,b) => b.length - a.length);
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fragments = new RegExp(keys.map(escape).join('|'), 'g');

// 렌더링되는 서비스 문구만 번역합니다. 사용자 이름·질문·카드 별명 등은 호출 대상에서 제외합니다.
export function t(value, language = getLanguage()) {
  if (typeof value !== 'string' || language !== 'en') return value;
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.startsWith('가입한 아이디: ')) return `Registered username: ${text.slice('가입한 아이디: '.length)}`;
  if (Object.hasOwn(englishCatalog, text)) return `${value.match(/^\s*/)[0]}${englishCatalog[text]}${value.match(/\s*$/)[0]}`;
  if (/^직항편 \d+개 ·/.test(text)) return `${text.match(/\d+/)[0]} nonstop flights · All times are local to each airport.`;
  if (/ 예약을 취소하시겠습니까\?$/.test(text)) return `Cancel booking ${text.split(' ')[0]}?`;
  if (/^잔여 \d+석$/.test(text)) return `${text.match(/\d+/)[0]} seats left`;
  if (/^\d+시간/.test(text)) return text.replace(/시간\s*/g, 'h ').replace(/분/g, 'm');
  if (/^\d+분$/.test(text)) return text.replace('분', 'm');
  if (/^\d+% 즉시 할인$/.test(text)) return `${text.split('%')[0]}% instant discount`;
  if (/^\d+만 원 즉시 할인$/.test(text)) return `${formatMoney(parseInt(text) * 10000, 'en')} instant discount`;
  if (/^최소 금액 없음 · 최대 \d+만 원$/.test(text)) return `No minimum · Up to ${formatMoney(parseInt(text.match(/\d+/)[0]) * 10000, 'en')}`;
  if (/^\d+만 원 이상 결제 시$/.test(text)) return `On bookings of ${formatMoney(parseInt(text) * 10000, 'en')} or more`;
  return value.replace(fragments, match => englishCatalog[match]);
}
