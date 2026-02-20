// 형충회합 계산 로직
import type { SajuResult } from '../types/saju';
import type { InteractionType } from '../data/hyungchung';
import { YUKAP, SAMHAP, BANGHAP, CHUNG, HYUNG, HAE, PA } from '../data/hyungchung';
import { JIJI_DATA } from '../data/jiji';

export interface FoundInteraction {
  type: InteractionType;
  branches: string[];
  branchesKorean: string[];
  positions: string[];
  resultElement?: string;
  detail?: string;
}

function bk(b: string): string {
  return JIJI_DATA[b]?.hangul || b;
}

export function findInteractions(result: SajuResult): FoundInteraction[] {
  const found: FoundInteraction[] = [];

  // 사주의 지지 추출 (위치 포함)
  const branches: { char: string; pos: string }[] = [
    { char: result.yearPillar.branch.hanja, pos: '년지' },
    { char: result.monthPillar.branch.hanja, pos: '월지' },
    { char: result.dayPillar.branch.hanja, pos: '일지' },
  ];
  if (result.hourPillar) {
    branches.push({ char: result.hourPillar.branch.hanja, pos: '시지' });
  }

  const branchChars = branches.map(b => b.char);

  // 육합 검사
  for (const [a, b, element] of YUKAP) {
    const idxA = branchChars.indexOf(a);
    const idxB = branchChars.indexOf(b);
    if (idxA !== -1 && idxB !== -1) {
      found.push({
        type: '육합',
        branches: [a, b],
        branchesKorean: [bk(a), bk(b)],
        positions: [branches[idxA].pos, branches[idxB].pos],
        resultElement: element,
        detail: `${bk(a)}${bk(b)}합${element} (${branches[idxA].pos}↔${branches[idxB].pos})`,
      });
    }
  }

  // 삼합 검사
  for (const [a, b, c, element] of SAMHAP) {
    const idxA = branchChars.indexOf(a);
    const idxB = branchChars.indexOf(b);
    const idxC = branchChars.indexOf(c);
    if (idxA !== -1 && idxB !== -1 && idxC !== -1) {
      found.push({
        type: '삼합',
        branches: [a, b, c],
        branchesKorean: [bk(a), bk(b), bk(c)],
        positions: [branches[idxA].pos, branches[idxB].pos, branches[idxC].pos],
        resultElement: element,
        detail: `${bk(a)}${bk(b)}${bk(c)} 삼합 ${element}국`,
      });
    }
    // 반삼합 (2개만 있는 경우)
    const pairs: [number, number, string][] = [
      [idxA, idxB, `${bk(a)}${bk(b)}`],
      [idxB, idxC, `${bk(b)}${bk(c)}`],
      [idxA, idxC, `${bk(a)}${bk(c)}`],
    ];
    if (!(idxA !== -1 && idxB !== -1 && idxC !== -1)) {
      for (const [i1, i2, label] of pairs) {
        if (i1 !== -1 && i2 !== -1) {
          found.push({
            type: '삼합',
            branches: [branchChars[i1], branchChars[i2]],
            branchesKorean: [bk(branchChars[i1]), bk(branchChars[i2])],
            positions: [branches[i1].pos, branches[i2].pos],
            resultElement: element,
            detail: `${label} 반삼합 ${element}국 (${branches[i1].pos}↔${branches[i2].pos})`,
          });
        }
      }
    }
  }

  // 방합 검사
  for (const [a, b, c, element] of BANGHAP) {
    const idxA = branchChars.indexOf(a);
    const idxB = branchChars.indexOf(b);
    const idxC = branchChars.indexOf(c);
    if (idxA !== -1 && idxB !== -1 && idxC !== -1) {
      found.push({
        type: '방합',
        branches: [a, b, c],
        branchesKorean: [bk(a), bk(b), bk(c)],
        positions: [branches[idxA].pos, branches[idxB].pos, branches[idxC].pos],
        resultElement: element,
        detail: `${bk(a)}${bk(b)}${bk(c)} 방합 ${element}국`,
      });
    }
  }

  // 충 검사
  for (const [a, b] of CHUNG) {
    for (let i = 0; i < branchChars.length; i++) {
      for (let j = i + 1; j < branchChars.length; j++) {
        if ((branchChars[i] === a && branchChars[j] === b) ||
            (branchChars[i] === b && branchChars[j] === a)) {
          found.push({
            type: '충',
            branches: [branchChars[i], branchChars[j]],
            branchesKorean: [bk(branchChars[i]), bk(branchChars[j])],
            positions: [branches[i].pos, branches[j].pos],
            detail: `${bk(branchChars[i])}${bk(branchChars[j])}충 (${branches[i].pos}↔${branches[j].pos})`,
          });
        }
      }
    }
  }

  // 형 검사
  for (const [a, b] of HYUNG) {
    for (let i = 0; i < branchChars.length; i++) {
      for (let j = 0; j < branchChars.length; j++) {
        if (i === j && a !== b) continue;
        if (i >= j && a === b) continue; // 자형은 중복 방지
        if (branchChars[i] === a && branchChars[j] === b) {
          const alreadyExists = found.some(f =>
            f.type === '형' &&
            f.positions.includes(branches[i].pos) &&
            f.positions.includes(branches[j].pos)
          );
          if (!alreadyExists) {
            found.push({
              type: '형',
              branches: [a, b],
              branchesKorean: [bk(a), bk(b)],
              positions: [branches[i].pos, branches[j].pos],
              detail: `${bk(a)}${bk(b)}형 (${branches[i].pos}↔${branches[j].pos})`,
            });
          }
        }
      }
    }
  }

  // 해 검사
  for (const [a, b] of HAE) {
    for (let i = 0; i < branchChars.length; i++) {
      for (let j = i + 1; j < branchChars.length; j++) {
        if ((branchChars[i] === a && branchChars[j] === b) ||
            (branchChars[i] === b && branchChars[j] === a)) {
          found.push({
            type: '해',
            branches: [branchChars[i], branchChars[j]],
            branchesKorean: [bk(branchChars[i]), bk(branchChars[j])],
            positions: [branches[i].pos, branches[j].pos],
            detail: `${bk(branchChars[i])}${bk(branchChars[j])}해 (${branches[i].pos}↔${branches[j].pos})`,
          });
        }
      }
    }
  }

  // 파 검사
  for (const [a, b] of PA) {
    for (let i = 0; i < branchChars.length; i++) {
      for (let j = i + 1; j < branchChars.length; j++) {
        if ((branchChars[i] === a && branchChars[j] === b) ||
            (branchChars[i] === b && branchChars[j] === a)) {
          found.push({
            type: '파',
            branches: [branchChars[i], branchChars[j]],
            branchesKorean: [bk(branchChars[i]), bk(branchChars[j])],
            positions: [branches[i].pos, branches[j].pos],
            detail: `${bk(branchChars[i])}${bk(branchChars[j])}파 (${branches[i].pos}↔${branches[j].pos})`,
          });
        }
      }
    }
  }

  return found;
}
