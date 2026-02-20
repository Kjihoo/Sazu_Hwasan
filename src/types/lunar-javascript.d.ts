declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getLunar(): Lunar;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number, isLeapMonth?: boolean): Lunar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number, isLeapMonth?: boolean): Lunar;
    getSolar(): Solar;
    getEightChar(): EightChar;
  }

  export class EightChar {
    getYear(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getYearWuXing(): string;
    getYearNaYin(): string;
    getYearShiShenGan(): string;
    getYearShiShenZhi(): string[];
    getYearDiShi(): string;
    getYearHideGan(): string[];
    getMonth(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getMonthWuXing(): string;
    getMonthNaYin(): string;
    getMonthShiShenGan(): string;
    getMonthShiShenZhi(): string[];
    getMonthDiShi(): string;
    getMonthHideGan(): string[];
    getDay(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getDayWuXing(): string;
    getDayNaYin(): string;
    getDayShiShenGan(): string;
    getDayShiShenZhi(): string[];
    getDayDiShi(): string;
    getDayHideGan(): string[];
    getTime(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getTimeWuXing(): string;
    getTimeNaYin(): string;
    getTimeShiShenGan(): string;
    getTimeShiShenZhi(): string[];
    getTimeDiShi(): string;
    getTimeHideGan(): string[];
    getLunar(): Lunar;
  }

  export class LunarUtil {
    // Add as needed
  }
}
