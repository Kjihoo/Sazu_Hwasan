import type { OhangType, SajuResult, OhangCount } from '../types/saju';
import { CHEONGAN_DATA } from '../data/cheongan';
import { JIJI_DATA } from '../data/jiji';

export function getOhangForHanja(hanja: string): OhangType | null {
  if (CHEONGAN_DATA[hanja]) return CHEONGAN_DATA[hanja].ohang;
  if (JIJI_DATA[hanja]) return JIJI_DATA[hanja].ohang;
  return null;
}

export function countOhang(result: SajuResult): OhangCount {
  const count: OhangCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const pillars = [result.yearPillar, result.monthPillar, result.dayPillar];
  if (result.hourPillar) pillars.push(result.hourPillar);

  for (const pillar of pillars) {
    count[pillar.stem.ohang]++;
    count[pillar.branch.ohang]++;
  }

  return count;
}
