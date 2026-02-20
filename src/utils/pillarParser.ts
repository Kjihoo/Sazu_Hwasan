import type { PillarInfo, PillarPosition, CharInfo } from '../types/saju';
import { CHEONGAN_DATA } from '../data/cheongan';
import { JIJI_DATA } from '../data/jiji';

export function parsePillar(
  ganZhi: string,
  position: PillarPosition
): PillarInfo {
  const stemHanja = ganZhi[0];
  const branchHanja = ganZhi[1];

  const stemEntry = CHEONGAN_DATA[stemHanja];
  const branchEntry = JIJI_DATA[branchHanja];

  const stem: CharInfo = {
    hanja: stemHanja,
    hangul: stemEntry.hangul,
    type: 'cheongan',
    ohang: stemEntry.ohang,
    polarity: stemEntry.polarity,
    pillarPosition: position,
  };

  const branch: CharInfo = {
    hanja: branchHanja,
    hangul: branchEntry.hangul,
    type: 'jiji',
    ohang: branchEntry.ohang,
    polarity: branchEntry.polarity,
    pillarPosition: position,
  };

  return {
    position,
    stem,
    branch,
    pillarHanja: ganZhi,
    pillarHangul: stemEntry.hangul + branchEntry.hangul,
  };
}
