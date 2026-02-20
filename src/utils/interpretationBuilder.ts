import type { CharInfo, BirthInput, SajuResult } from '../types/saju';
import type { Lang } from '../context/LangContext';
import { CHEONGAN_DATA } from '../data/cheongan';
import { JIJI_DATA } from '../data/jiji';
import { OHANG_DATA } from '../data/ohang';
import { PILLAR_EXPLANATIONS, STEM_BRANCH_LABELS } from '../data/memoContent';
import { SIJI_DATA } from '../data/siji';

function getSijiName(hour: number): string {
  const siji = SIJI_DATA.find(s => {
    if (s.hourStart > s.hourEnd) {
      return hour >= s.hourStart || hour < s.hourEnd;
    }
    return hour >= s.hourStart && hour < s.hourEnd;
  });
  return siji ? siji.label : '';
}

function getPillarFromResult(result: SajuResult, position: string) {
  switch (position) {
    case '년주': return result.yearPillar;
    case '월주': return result.monthPillar;
    case '일주': return result.dayPillar;
    case '시주': return result.hourPillar;
    default: return null;
  }
}

export interface InterpretationResult {
  termTitle: string;
  termExplanation: string;
  symbolism: string;
  pillarExplanation: string;
  contextExplanation: string;
  ohangExplanation: string;
}

export function buildInterpretation(
  charInfo: CharInfo,
  birthInput: BirthInput,
  result: SajuResult,
  lang: Lang = 'ko'
): InterpretationResult {
  const { hanja, type, ohang, polarity, pillarPosition } = charInfo;
  const pillar = getPillarFromResult(result, pillarPosition);

  // 1. 용어 설명 / Term explanation
  let termTitle: string;
  let termExplanation: string;
  let symbolism: string;

  if (type === 'cheongan') {
    const entry = CHEONGAN_DATA[hanja];
    if (lang === 'en') {
      termTitle = `${entry.hangul}(${entry.hanja}) — ${STEM_BRANCH_LABELS.cheongan.titleEn}`;
      termExplanation = entry.meaningEn;
      symbolism = entry.symbolismEn + '\n\n' + entry.personalityEn;
    } else {
      termTitle = `${entry.hangul}(${entry.hanja}) — ${STEM_BRANCH_LABELS.cheongan.title}`;
      termExplanation = entry.meaning;
      symbolism = entry.symbolism + '\n\n' + entry.personality;
    }
  } else {
    const entry = JIJI_DATA[hanja];
    if (lang === 'en') {
      termTitle = `${entry.hangul}(${entry.hanja}) — ${STEM_BRANCH_LABELS.jiji.titleEn} · ${entry.animalEn}`;
      termExplanation = entry.meaningEn;
      symbolism = entry.symbolismEn;
    } else {
      termTitle = `${entry.hangul}(${entry.hanja}) — ${STEM_BRANCH_LABELS.jiji.title} · ${entry.animal}띠`;
      termExplanation = entry.meaning;
      symbolism = entry.symbolism;
    }
  }

  // 2. 기둥 설명 / Pillar explanation
  const pillarInfo = PILLAR_EXPLANATIONS[pillarPosition];
  const pillarExplanation = lang === 'en'
    ? `${pillarInfo.titleEn}: ${pillarInfo.meaningEn}`
    : `${pillarInfo.title}: ${pillarInfo.meaning}`;

  // 3. 왜 이 글자가 나왔는지 / Context explanation
  let contextExplanation: string;
  const { year, month, day, hour } = birthInput;
  const pillarHangul = pillar ? pillar.pillarHangul : '';
  const pillarHanja = pillar ? pillar.pillarHanja : '';

  if (lang === 'en') {
    switch (pillarPosition) {
      case '년주':
        contextExplanation = `You were born in the year ${year}. ` +
          `The Stem-Branch of ${year} is ${pillarHangul}(${pillarHanja}), ` +
          `and the ${type === 'cheongan' ? 'Heavenly Stem' : 'Earthly Branch'} is ${charInfo.hangul}(${hanja}).`;
        break;
      case '월주':
        contextExplanation = `You were born in month ${month} of ${year}. ` +
          `Based on the solar terms, the Stem-Branch of this month is ${pillarHangul}(${pillarHanja}), ` +
          `and the ${type === 'cheongan' ? 'Heavenly Stem' : 'Earthly Branch'} is ${charInfo.hangul}(${hanja}).`;
        break;
      case '일주':
        contextExplanation = `You were born on ${year}/${month}/${day}. ` +
          `The Day Stem-Branch (日辰) is ${pillarHangul}(${pillarHanja}), ` +
          `and the ${type === 'cheongan' ? 'Heavenly Stem' : 'Earthly Branch'} is ${charInfo.hangul}(${hanja}).` +
          (type === 'cheongan' ? ' The Day Stem (日干) is the most important character in BaZi — it represents "you."' : '');
        break;
      case '시주': {
        const sijiName = getSijiName(hour);
        contextExplanation = `You were born at hour ${hour} (${sijiName}). ` +
          `Based on your Day Stem ${result.dayPillar.stem.hangul}(${result.dayPillar.stem.hanja}), ` +
          `the Hour Pillar is determined as ${pillarHangul}(${pillarHanja}), ` +
          `and the ${type === 'cheongan' ? 'Heavenly Stem' : 'Earthly Branch'} is ${charInfo.hangul}(${hanja}).`;
        break;
      }
      default:
        contextExplanation = '';
    }
  } else {
    switch (pillarPosition) {
      case '년주':
        contextExplanation = `당신이 태어난 해는 ${year}년입니다. ` +
          `${year}년의 간지는 ${pillarHangul}(${pillarHanja})이며, ` +
          `${type === 'cheongan' ? '천간' : '지지'}이 ${charInfo.hangul}(${hanja})이 됩니다.`;
        break;
      case '월주':
        contextExplanation = `당신이 태어난 달은 ${year}년 ${month}월입니다. ` +
          `절기(節氣)를 기준으로 이 달의 간지는 ${pillarHangul}(${pillarHanja})이며, ` +
          `${type === 'cheongan' ? '천간' : '지지'}이 ${charInfo.hangul}(${hanja})이 됩니다.`;
        break;
      case '일주':
        contextExplanation = `당신이 태어난 날은 ${year}년 ${month}월 ${day}일입니다. ` +
          `이 날의 일진(日辰)은 ${pillarHangul}(${pillarHanja})이며, ` +
          `${type === 'cheongan' ? '천간' : '지지'}이 ${charInfo.hangul}(${hanja})이 됩니다.` +
          (type === 'cheongan' ? ' 일간(日干)은 사주에서 "나 자신"을 나타내는 가장 핵심적인 글자입니다.' : '');
        break;
      case '시주': {
        const sijiName = getSijiName(hour);
        contextExplanation = `당신이 태어난 시간은 ${hour}시(${sijiName})입니다. ` +
          `일간(日干) ${result.dayPillar.stem.hangul}(${result.dayPillar.stem.hanja})을 기준으로 ` +
          `시주가 ${pillarHangul}(${pillarHanja})로 정해지며, ` +
          `${type === 'cheongan' ? '천간' : '지지'}이 ${charInfo.hangul}(${hanja})이 됩니다.`;
        break;
      }
      default:
        contextExplanation = '';
    }
  }

  // 4. 오행 설명 / Element explanation
  const ohangEntry = OHANG_DATA[ohang];
  const ohangExplanation = lang === 'en'
    ? `This character's element is ${ohangEntry.hanja} (${ohang}), carrying ${polarity === '양' ? 'Yang (陽)' : 'Yin (陰)'} energy.\n\n${ohangEntry.meaningEn}`
    : `이 글자의 오행은 ${ohang}(${ohangEntry.hanja})이며, ${polarity}(${polarity === '양' ? '陽' : '陰'})의 기운입니다.\n\n${ohangEntry.meaning}`;

  return {
    termTitle,
    termExplanation,
    symbolism,
    pillarExplanation,
    contextExplanation,
    ohangExplanation,
  };
}
