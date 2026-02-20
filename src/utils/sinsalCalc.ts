// 신살 계산 로직
import type { SajuResult } from '../types/saju';
import {
  YEOKMA_TABLE, DOHWA_TABLE, HWAGAE_TABLE, GWIMUN_PAIRS,
  CHEONUL_TABLE, MUNCHANG_TABLE, YANGIN_TABLE, GEOBSAL_TABLE,
} from '../data/sinsal';

export interface FoundSinsal {
  name: string;
  position: string;   // 어느 기둥에서 발견됐는지
  isGood: boolean;
}

export function findSinsals(result: SajuResult): FoundSinsal[] {
  const found: FoundSinsal[] = [];

  const dayBranch = result.dayPillar.branch.hanja;
  const dayStem = result.dayPillar.stem.hanja;

  // 사주의 모든 지지
  const allBranches: { char: string; pos: string }[] = [
    { char: result.yearPillar.branch.hanja, pos: '년지' },
    { char: result.monthPillar.branch.hanja, pos: '월지' },
    { char: result.dayPillar.branch.hanja, pos: '일지' },
  ];
  if (result.hourPillar) {
    allBranches.push({ char: result.hourPillar.branch.hanja, pos: '시지' });
  }

  // 역마살: 일지 기준, 다른 지지에 역마 글자가 있는지
  const yeokmaChar = YEOKMA_TABLE[dayBranch];
  if (yeokmaChar) {
    for (const b of allBranches) {
      if (b.char === yeokmaChar && b.pos !== '일지') {
        found.push({ name: '역마살', position: b.pos, isGood: false });
      }
    }
  }

  // 도화살: 일지 기준
  const dohwaChar = DOHWA_TABLE[dayBranch];
  if (dohwaChar) {
    for (const b of allBranches) {
      if (b.char === dohwaChar && b.pos !== '일지') {
        found.push({ name: '도화살', position: b.pos, isGood: false });
      }
    }
  }

  // 화개살: 일지 기준
  const hwagaeChar = HWAGAE_TABLE[dayBranch];
  if (hwagaeChar) {
    for (const b of allBranches) {
      if (b.char === hwagaeChar && b.pos !== '일지') {
        found.push({ name: '화개살', position: b.pos, isGood: true });
      }
    }
  }

  // 겁살: 일지 기준
  const geobsalChar = GEOBSAL_TABLE[dayBranch];
  if (geobsalChar) {
    for (const b of allBranches) {
      if (b.char === geobsalChar && b.pos !== '일지') {
        found.push({ name: '겁살', position: b.pos, isGood: false });
      }
    }
  }

  // 귀문관살: 특정 지지 쌍이 사주에 모두 있는지
  for (const [a, b] of GWIMUN_PAIRS) {
    const hasA = allBranches.find(x => x.char === a);
    const hasB = allBranches.find(x => x.char === b);
    if (hasA && hasB) {
      found.push({ name: '귀문관살', position: `${hasA.pos}↔${hasB.pos}`, isGood: false });
    }
  }

  // 천을귀인: 일간 기준, 다른 지지에 귀인 글자가 있는지
  const cheonulChars = CHEONUL_TABLE[dayStem];
  if (cheonulChars) {
    for (const b of allBranches) {
      if (cheonulChars.includes(b.char)) {
        found.push({ name: '천을귀인', position: b.pos, isGood: true });
      }
    }
  }

  // 문창귀인: 일간 기준
  const munchangChar = MUNCHANG_TABLE[dayStem];
  if (munchangChar) {
    for (const b of allBranches) {
      if (b.char === munchangChar) {
        found.push({ name: '문창귀인', position: b.pos, isGood: true });
      }
    }
  }

  // 양인살: 일간 기준
  const yanginChar = YANGIN_TABLE[dayStem];
  if (yanginChar) {
    for (const b of allBranches) {
      if (b.char === yanginChar) {
        found.push({ name: '양인살', position: b.pos, isGood: false });
      }
    }
  }

  return found;
}
