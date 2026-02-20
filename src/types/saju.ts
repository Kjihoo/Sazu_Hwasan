export type OhangType = '목' | '화' | '토' | '금' | '수';
export type PillarPosition = '년주' | '월주' | '일주' | '시주';
export type Polarity = '양' | '음';

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
  unknownTime: boolean;
}

export interface CharInfo {
  hanja: string;
  hangul: string;
  type: 'cheongan' | 'jiji';
  ohang: OhangType;
  polarity: Polarity;
  pillarPosition: PillarPosition;
}

export interface PillarInfo {
  position: PillarPosition;
  stem: CharInfo;
  branch: CharInfo;
  pillarHangul: string;
  pillarHanja: string;
}

export interface SajuResult {
  birthInput: BirthInput;
  yearPillar: PillarInfo;
  monthPillar: PillarInfo;
  dayPillar: PillarInfo;
  hourPillar: PillarInfo | null;
  ohangCount: OhangCount;
}

export interface OhangCount {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface MemoState {
  isOpen: boolean;
  charInfo: CharInfo | null;
}

export interface CheonganEntry {
  hanja: string;
  hangul: string;
  ohang: OhangType;
  polarity: Polarity;
  meaning: string;
  symbolism: string;
  personality: string;
}

export interface JijiEntry {
  hanja: string;
  hangul: string;
  ohang: OhangType;
  polarity: Polarity;
  animal: string;
  timeRange: string;
  meaning: string;
  symbolism: string;
}

export interface OhangEntry {
  name: OhangType;
  hanja: string;
  color: string;
  bgColor: string;
  textColor: string;
  meaning: string;
  generates: OhangType;
  overcomes: OhangType;
  season: string;
  direction: string;
}

export interface SijiEntry {
  name: string;
  branch: string;
  branchHangul: string;
  hourStart: number;
  hourEnd: number;
  label: string;
  representativeHour: number;
}
