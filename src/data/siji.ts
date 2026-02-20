import type { SijiEntry } from '../types/saju';

export const SIJI_DATA: SijiEntry[] = [
  { name: '자시', branch: '子', branchHangul: '자', hourStart: 23, hourEnd: 1, label: '자시 (子時) 23:00 ~ 01:00', representativeHour: 0 },
  { name: '축시', branch: '丑', branchHangul: '축', hourStart: 1, hourEnd: 3, label: '축시 (丑時) 01:00 ~ 03:00', representativeHour: 2 },
  { name: '인시', branch: '寅', branchHangul: '인', hourStart: 3, hourEnd: 5, label: '인시 (寅時) 03:00 ~ 05:00', representativeHour: 4 },
  { name: '묘시', branch: '卯', branchHangul: '묘', hourStart: 5, hourEnd: 7, label: '묘시 (卯時) 05:00 ~ 07:00', representativeHour: 6 },
  { name: '진시', branch: '辰', branchHangul: '진', hourStart: 7, hourEnd: 9, label: '진시 (辰時) 07:00 ~ 09:00', representativeHour: 8 },
  { name: '사시', branch: '巳', branchHangul: '사', hourStart: 9, hourEnd: 11, label: '사시 (巳時) 09:00 ~ 11:00', representativeHour: 10 },
  { name: '오시', branch: '午', branchHangul: '오', hourStart: 11, hourEnd: 13, label: '오시 (午時) 11:00 ~ 13:00', representativeHour: 12 },
  { name: '미시', branch: '未', branchHangul: '미', hourStart: 13, hourEnd: 15, label: '미시 (未時) 13:00 ~ 15:00', representativeHour: 14 },
  { name: '신시', branch: '申', branchHangul: '신', hourStart: 15, hourEnd: 17, label: '신시 (申時) 15:00 ~ 17:00', representativeHour: 16 },
  { name: '유시', branch: '酉', branchHangul: '유', hourStart: 17, hourEnd: 19, label: '유시 (酉時) 17:00 ~ 19:00', representativeHour: 18 },
  { name: '술시', branch: '戌', branchHangul: '술', hourStart: 19, hourEnd: 21, label: '술시 (戌時) 19:00 ~ 21:00', representativeHour: 20 },
  { name: '해시', branch: '亥', branchHangul: '해', hourStart: 21, hourEnd: 23, label: '해시 (亥時) 21:00 ~ 23:00', representativeHour: 22 },
];
