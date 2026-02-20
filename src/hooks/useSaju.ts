import { useState, useCallback } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import type { BirthInput, SajuResult, YunData } from '../types/saju';
import { parsePillar } from '../utils/pillarParser';
import { countOhang } from '../utils/ohangMapper';

export interface BaziRawData {
  sipsung: { position: string; gan: string; zhi: string[] }[];
  unsung: { position: string; value: string }[];
  yunData: YunData;
}

export function useSaju() {
  const [birthInput, setBirthInput] = useState<BirthInput | null>(null);
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null);
  const [baziData, setBaziData] = useState<BaziRawData | null>(null);

  const calculate = useCallback((input: BirthInput) => {
    setBirthInput(input);

    const solar = input.calendarType === 'lunar'
      ? (input.unknownTime
          ? Lunar.fromYmd(input.year, input.month, input.day, input.isLeapMonth).getSolar()
          : Lunar.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, 0, input.isLeapMonth).getSolar())
      : (input.unknownTime
          ? Solar.fromYmd(input.year, input.month, input.day)
          : Solar.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, 0));

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

    // 대운/세운 계산
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yun = (bazi as any).getYun(input.gender === 'male' ? 1 : 0, 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const daYunArr: any[] = yun.getDaYun(10);

    const yunData: YunData = {
      isForward: yun.isForward(),
      startAge: yun.getStartYear(),
      daYun: daYunArr
        .filter((dy: any) => dy.getIndex() >= 1)
        .map((dy: any) => ({
          index: dy.getIndex(),
          ganZhi: dy.getGanZhi(),
          startAge: dy.getStartAge(),
          endAge: dy.getEndAge(),
          startYear: dy.getStartYear(),
          endYear: dy.getEndYear(),
          liuNian: dy.getLiuNian(10).map((ln: any) => ({
            year: ln.getYear(),
            age: ln.getAge(),
            ganZhi: ln.getGanZhi(),
          })),
        })),
    };

    setBaziData({ sipsung: sipsungData, unsung: unsungData, yunData });
  }, []);

  return { birthInput, sajuResult, baziData, calculate };
}
