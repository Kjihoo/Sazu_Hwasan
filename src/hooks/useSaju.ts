import { useState, useCallback } from 'react';
import { Solar } from 'lunar-javascript';
import type { BirthInput, SajuResult } from '../types/saju';
import { parsePillar } from '../utils/pillarParser';
import { countOhang } from '../utils/ohangMapper';

export interface BaziRawData {
  sipsung: { position: string; gan: string; zhi: string[] }[];
  unsung: { position: string; value: string }[];
}

export function useSaju() {
  const [birthInput, setBirthInput] = useState<BirthInput | null>(null);
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null);
  const [baziData, setBaziData] = useState<BaziRawData | null>(null);

  const calculate = useCallback((input: BirthInput) => {
    setBirthInput(input);

    const solar = input.unknownTime
      ? Solar.fromYmd(input.year, input.month, input.day)
      : Solar.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, 0);

    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar();

    const yearPillar = parsePillar(bazi.getYear(), '년주');
    const monthPillar = parsePillar(bazi.getMonth(), '월주');
    const dayPillar = parsePillar(bazi.getDay(), '일주');
    const hourPillar = input.unknownTime ? null : parsePillar(bazi.getTime(), '시주');

    const result: SajuResult = {
      birthInput: input,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      ohangCount: { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 },
    };

    result.ohangCount = countOhang(result);
    setSajuResult(result);

    // 십성 / 12운성 데이터 추출
    const sipsungData = [
      { position: '년주', gan: bazi.getYearShiShenGan(), zhi: bazi.getYearShiShenZhi() },
      { position: '월주', gan: bazi.getMonthShiShenGan(), zhi: bazi.getMonthShiShenZhi() },
      { position: '일주', gan: bazi.getDayShiShenGan(), zhi: bazi.getDayShiShenZhi() },
    ];
    if (!input.unknownTime) {
      sipsungData.push({ position: '시주', gan: bazi.getTimeShiShenGan(), zhi: bazi.getTimeShiShenZhi() });
    }

    const unsungData = [
      { position: '년주', value: bazi.getYearDiShi() },
      { position: '월주', value: bazi.getMonthDiShi() },
      { position: '일주', value: bazi.getDayDiShi() },
    ];
    if (!input.unknownTime) {
      unsungData.push({ position: '시주', value: bazi.getTimeDiShi() });
    }

    setBaziData({ sipsung: sipsungData, unsung: unsungData });
  }, []);

  return { birthInput, sajuResult, baziData, calculate };
}
