import { useState, useCallback } from 'react';
import type { SajuResult, YunData, DaYunInfo } from '../../types/saju';
import { useLang } from '../../context/LangContext';
import type { Lang } from '../../context/LangContext';
import { SIPSUNG_DATA, SIPSUNG_GENERAL_DESC, SIPSUNG_GENERAL_DESC_EN, SIPSUNG_CATEGORY_DESC, SIPSUNG_CATEGORY_DESC_EN } from '../../data/sipsung';
import { UNSUNG_DATA, UNSUNG_GENERAL_DESC, UNSUNG_GENERAL_DESC_EN } from '../../data/unsung';
import { INTERACTION_DESC, HYUNGCHUNG_GENERAL_DESC, HYUNGCHUNG_GENERAL_DESC_EN } from '../../data/hyungchung';
import {
  SINSAL_DATA, SINSAL_GENERAL_DESC, SINSAL_GENERAL_DESC_EN,
  YEOKMA_TABLE, DOHWA_TABLE, HWAGAE_TABLE, GEOBSAL_TABLE,
  CHEONUL_TABLE, MUNCHANG_TABLE, YANGIN_TABLE,
} from '../../data/sinsal';
import { CHEONGAN_DATA } from '../../data/cheongan';
import { JIJI_DATA } from '../../data/jiji';
import { OHANG_DATA } from '../../data/ohang';
import { findInteractions, type FoundInteraction } from '../../utils/hyungchungCalc';
import { findSinsals, type FoundSinsal } from '../../utils/sinsalCalc';
import AnalysisModal from '../AnalysisModal/AnalysisModal';
import type { AnalysisModalContent } from '../AnalysisModal/AnalysisModal';
import styles from './AnalysisPanel.module.css';

interface AnalysisPanelProps {
  result: SajuResult;
  baziData: {
    sipsung: { position: string; gan: string; zhi: string[] }[];
    unsung: { position: string; value: string }[];
    yunData: YunData;
  };
}

type TabKey = 'sipsung' | 'unsung' | 'hyungchung' | 'sinsal' | 'dayun';
type ViewMode = 'my' | 'info';

const TABS: { key: TabKey; label: string; labelEn: string; hanja: string }[] = [
  { key: 'dayun', label: '대운/세운', labelEn: 'Fortune Flow', hanja: '大運歲運' },
  { key: 'sipsung', label: '십성', labelEn: 'Ten Gods', hanja: '十星' },
  { key: 'sinsal', label: '신살', labelEn: 'Spirit Stars', hanja: '神煞' },
  { key: 'unsung', label: '12운성', labelEn: '12 Life Stages', hanja: '十二運星' },
  { key: 'hyungchung', label: '형충회합', labelEn: 'Interactions', hanja: '刑沖會合' },
];

const DAYUN_GENERAL_DESC = `대운(大運)은 사주의 흐름을 10년 단위로 나눈 큰 운의 물결입니다.

태어난 사주를 바탕으로, 10년마다 바뀌는 대운의 영향을 받으며 인생의 큰 방향이 결정됩니다.

• 대운 천간: 그 10년 동안의 외적·사회적 환경의 기운
• 대운 지지: 그 10년 동안의 내적·심리적 변화의 기운

세운(歲運)은 매년 바뀌는 그해의 운을 뜻합니다. 대운이라는 큰 강물 위에 세운이라는 파도가 얹히는 것처럼, 대운의 틀 안에서 세운이 세부적인 흐름을 만들어냅니다.

• 대운은 방향, 세운은 속도
• 좋은 대운에 좋은 세운이 겹치면 크게 발복합니다
• 어려운 대운도 좋은 세운으로 버틸 수 있습니다

각 대운 카드를 클릭하면 그 시기의 상세한 기운과 추천 조치를 볼 수 있습니다.`;

const DAYUN_GENERAL_DESC_EN = `Major Fortune Cycles (大運) divide the flow of your destiny into 10-year periods.

Your BaZi chart is the foundation, and every 10 years, a new Major Fortune Cycle shapes the broad direction of your life journey.

• Cycle Stem: The external, social energy of those 10 years
• Cycle Branch: The internal, psychological energy of those 10 years

Annual Fortune (歲運) is the energy of each passing year — like waves riding atop the great river of your Major Fortune Cycle.

• Major Cycles set the direction; Annual Fortune sets the pace
• When a favorable cycle meets a favorable year, great fortune blooms
• Even a challenging cycle can be navigated through positive annual fortune

Click any cycle card to explore the detailed energy and recommended actions for that period.`;


const POSITION_EN: Record<string, string> = {
  '년주': 'Year', '월주': 'Month', '일주': 'Day', '시주': 'Hour',
};

export default function AnalysisPanel({ result, baziData }: AnalysisPanelProps) {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<TabKey>('dayun');
  const [viewMode, setViewMode] = useState<ViewMode>('my');
  const [modalContent, setModalContent] = useState<AnalysisModalContent | null>(null);
  const currentYear = new Date().getFullYear();

  const openModal = useCallback((content: AnalysisModalContent) => {
    setModalContent(content);
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab(tab.key); setViewMode('my'); }}
            type="button"
          >
            {lang === 'en' ? tab.labelEn : tab.label}
            <span className={styles.tabHanja}>{tab.hanja}</span>
          </button>
        ))}
      </div>

      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeBtn} ${viewMode === 'my' ? styles.modeBtnActive : ''}`}
          onClick={() => setViewMode('my')}
          type="button"
        >
          {lang === 'en'
            ? `My ${TABS.find(t => t.key === activeTab)!.labelEn}`
            : `나의 ${TABS.find(t => t.key === activeTab)!.label}`}
        </button>
        <button
          className={`${styles.modeBtn} ${viewMode === 'info' ? styles.modeBtnActive : ''}`}
          onClick={() => setViewMode('info')}
          type="button"
        >
          {lang === 'en'
            ? `About ${TABS.find(t => t.key === activeTab)!.labelEn}`
            : `${TABS.find(t => t.key === activeTab)!.label}이란?`}
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'sipsung' && (
          viewMode === 'my'
            ? <MySipsung baziData={baziData} result={result} onOpen={openModal} lang={lang} />
            : <InfoBox text={lang === 'en' ? SIPSUNG_GENERAL_DESC_EN : SIPSUNG_GENERAL_DESC} />
        )}
        {activeTab === 'unsung' && (
          viewMode === 'my'
            ? <MyUnsung baziData={baziData} result={result} onOpen={openModal} lang={lang} />
            : <InfoBox text={lang === 'en' ? UNSUNG_GENERAL_DESC_EN : UNSUNG_GENERAL_DESC} />
        )}
        {activeTab === 'hyungchung' && (
          viewMode === 'my'
            ? <MyHyungchung result={result} onOpen={openModal} lang={lang} />
            : <InfoBox text={lang === 'en' ? HYUNGCHUNG_GENERAL_DESC_EN : HYUNGCHUNG_GENERAL_DESC} />
        )}
        {activeTab === 'sinsal' && (
          viewMode === 'my'
            ? <MySinsal result={result} onOpen={openModal} lang={lang} />
            : <InfoBox text={lang === 'en' ? SINSAL_GENERAL_DESC_EN : SINSAL_GENERAL_DESC} />
        )}
        {activeTab === 'dayun' && (
          viewMode === 'my'
            ? <MyDaYun yunData={baziData.yunData} result={result} onOpen={openModal} lang={lang} currentYear={currentYear} />
            : <InfoBox text={lang === 'en' ? DAYUN_GENERAL_DESC_EN : DAYUN_GENERAL_DESC} />
        )}
      </div>

      <AnalysisModal isOpen={!!modalContent} content={modalContent} onClose={closeModal} />
    </section>
  );
}

/* === 헬퍼 === */

function InfoBox({ text }: { text: string }) {
  return (
    <div className={styles.infoBox}>
      {text.split('\n').map((line, i) => (
        <p key={i} className={line.startsWith('•') || line.startsWith('-') ? styles.listItem : styles.infoPara}>
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  );
}

function buildSipsungReason(result: SajuResult, position: string, type: 'gan' | 'zhi', sipsungName: string, lang: Lang): string {
  const dayStem = result.dayPillar.stem;
  const dayEntry = CHEONGAN_DATA[dayStem.hanja];

  const pillarMap: Record<string, typeof result.yearPillar> = {
    '년주': result.yearPillar, '월주': result.monthPillar, '일주': result.dayPillar,
  };
  if (result.hourPillar) pillarMap['시주'] = result.hourPillar;
  const pillar = pillarMap[position];
  if (!pillar) return '';

  const targetChar = type === 'gan' ? pillar.stem : pillar.branch;

  if (position === '일주' && type === 'gan') {
    return lang === 'en'
      ? `The Day Stem ${dayEntry.hangul}(${dayStem.hanja}) represents yourself — this is the Day Master (日主).`
      : `일간 ${dayEntry.hangul}(${dayStem.hanja})은 나 자신이므로 "일주(日主)"가 됩니다.`;
  }

  const me = dayStem.ohang;
  const target = targetChar.ohang;
  const dayOhang = OHANG_DATA[me];
  const targetOhang = OHANG_DATA[target];

  let relation = '';
  let relationEn = '';
  if (me === target) {
    relation = `나(${dayOhang.hanja})와 같은 오행(${targetOhang.hanja})`;
    relationEn = `the same element as you (${dayOhang.hanja})`;
  } else if (OHANG_DATA[me].generates === target) {
    relation = `내가(${dayOhang.hanja}) 생(生)하는 오행(${targetOhang.hanja})`;
    relationEn = `an element you generate (${dayOhang.hanja} → ${targetOhang.hanja})`;
  } else if (OHANG_DATA[me].overcomes === target) {
    relation = `내가(${dayOhang.hanja}) 극(剋)하는 오행(${targetOhang.hanja})`;
    relationEn = `an element you control (${dayOhang.hanja} → ${targetOhang.hanja})`;
  } else if (OHANG_DATA[target].generates === me) {
    relation = `나를(${dayOhang.hanja}) 극(剋)하는 오행(${targetOhang.hanja})`;
    relationEn = `an element that generates you (${targetOhang.hanja} → ${dayOhang.hanja})`;
  } else if (OHANG_DATA[target].overcomes === me) {
    relation = `나를(${dayOhang.hanja}) 생(生)해주는 오행(${targetOhang.hanja})`;
    relationEn = `an element that controls you (${targetOhang.hanja} → ${dayOhang.hanja})`;
  }

  const polarityText = dayStem.polarity === targetChar.polarity ? '같은 음양' : '다른 음양';
  const polarityTextEn = dayStem.polarity === targetChar.polarity ? 'same polarity' : 'opposite polarity';

  if (lang === 'en') {
    return `Your Day Stem is ${dayEntry.hangul}(${dayStem.hanja}·${me}), and the ${POSITION_EN[position]} ${type === 'gan' ? 'Stem' : 'Branch'} is ${targetChar.hangul}(${targetChar.hanja}·${target}).\nIt is ${relationEn} with ${polarityTextEn}, making it "${sipsungName}".`;
  }
  return `당신의 일간(나)은 ${dayEntry.hangul}(${dayStem.hanja}·${me})이고, ${position} ${type === 'gan' ? '천간' : '지지'}은 ${targetChar.hangul}(${targetChar.hanja}·${target})입니다.\n${relation}이면서 ${polarityText}이므로 "${sipsungName}"이 됩니다.`;
}

function buildUnsungReason(result: SajuResult, position: string, unsungName: string, lang: Lang): string {
  const dayStem = result.dayPillar.stem;
  const dayEntry = CHEONGAN_DATA[dayStem.hanja];

  const pillarMap: Record<string, typeof result.yearPillar> = {
    '년주': result.yearPillar, '월주': result.monthPillar, '일주': result.dayPillar,
  };
  if (result.hourPillar) pillarMap['시주'] = result.hourPillar;
  const pillar = pillarMap[position];
  if (!pillar) return '';

  const branchEntry = JIJI_DATA[pillar.branch.hanja];
  const branchLabel = branchEntry?.hangul || pillar.branch.hangul;

  if (lang === 'en') {
    return `Your Day Stem is ${dayEntry.hangul}(${dayStem.hanja}·${dayStem.ohang}), and the ${POSITION_EN[position]} Branch is ${branchLabel}(${pillar.branch.hanja}).\nThe 12 Life Stages show what energy phase your Day Stem is in at each Earthly Branch.\nYour Day Stem ${dayEntry.hangul}(${dayStem.hanja}) is in the "${unsungName}" stage at the ${branchLabel}(${pillar.branch.hanja}) Branch.`;
  }
  return `당신의 일간(나)은 ${dayEntry.hangul}(${dayStem.hanja}·${dayStem.ohang})이고, ${position} 지지는 ${branchLabel}(${pillar.branch.hanja})입니다.\n12운성은 일간이 각 지지에서 어떤 에너지 단계에 있는지를 나타냅니다.\n${dayEntry.hangul}(${dayStem.hanja}) 일간이 ${branchLabel}(${pillar.branch.hanja}) 지지에서 "${unsungName}"의 단계에 해당합니다.`;
}

function buildHyungchungReason(item: FoundInteraction, lang: Lang): string {
  const branchText = item.branchesKorean.map((k, i) => `${k}(${item.branches[i]})`).join(', ');

  const typeDescMap: Record<string, string> = {
    '육합': '서로 끌어당기며 결합하는 합(合)',
    '삼합': '세 지지가 모여 강한 오행을 이루는 합(合)',
    '방합': '같은 계절(방위)의 세 지지가 모여 이루는 합(合)',
    '충': '정반대 방향에서 서로 부딪치는 충돌',
    '형': '서로 형벌을 가하듯 갈등을 일으키는 관계',
    '해': '서로 해치며 은밀하게 손상을 주는 관계',
    '파': '깨뜨리고 허물어지는 관계',
  };
  const typeDescMapEn: Record<string, string> = {
    '육합': 'Six Harmonies — two branches that attract and unite',
    '삼합': 'Triple Harmony — three branches uniting into a strong element',
    '방합': 'Directional Harmony — three same-direction branches uniting',
    '충': 'Clash — two branches colliding from opposite directions',
    '형': 'Punishment — branches creating conflict and stress',
    '해': 'Harm — branches subtly damaging each other',
    '파': 'Break — branches gradually disrupting each other',
  };

  if (lang === 'en') {
    const positionTextEn = item.positions.join(' and ');
    let reason = `In your chart, ${positionTextEn} contain ${branchText} respectively.\nThese characters meet the conditions for ${typeDescMapEn[item.type] || item.type}.`;
    if (item.resultElement) {
      reason += `\nAs a result, the ${item.resultElement}(${OHANG_DATA[item.resultElement as keyof typeof OHANG_DATA]?.hanja || ''}) element becomes stronger.`;
    }
    return reason;
  }

  const positionText = item.positions.join('과 ');
  let reason = `당신의 사주에서 ${positionText}에 각각 ${branchText}이(가) 있습니다.\n이 글자들은 ${typeDescMap[item.type] || item.type}의 조건에 해당합니다.`;
  if (item.resultElement) {
    reason += `\n결과적으로 ${item.resultElement}(${OHANG_DATA[item.resultElement as keyof typeof OHANG_DATA]?.hanja || ''}) 오행의 기운이 강해집니다.`;
  }
  return reason;
}

function buildSinsalReason(result: SajuResult, item: FoundSinsal, lang: Lang): string {
  const dayBranch = result.dayPillar.branch;
  const dayStem = result.dayPillar.stem;
  const dayBranchEntry = JIJI_DATA[dayBranch.hanja];
  const dayStemEntry = CHEONGAN_DATA[dayStem.hanja];
  const posEn = POSITION_EN[item.position] || item.position;

  const dayBranchBased = ['역마살', '도화살', '화개살', '겁살'];
  const dayStemBased = ['천을귀인', '문창귀인', '양인살'];

  if (dayBranchBased.includes(item.name)) {
    const tableMap: Record<string, Record<string, string>> = {
      '역마살': YEOKMA_TABLE, '도화살': DOHWA_TABLE, '화개살': HWAGAE_TABLE, '겁살': GEOBSAL_TABLE,
    };
    const table = tableMap[item.name];
    const targetChar = table?.[dayBranch.hanja];
    if (!targetChar) return '';
    const targetEntry = JIJI_DATA[targetChar];
    const targetLabel = targetEntry?.hangul || targetChar;
    if (lang === 'en') {
      return `Your Day Branch is ${dayBranchEntry?.hangul}(${dayBranch.hanja}).\nAccording to the ${item.name} table, when the Day Branch is ${dayBranchEntry?.hangul}(${dayBranch.hanja}), ${targetLabel}(${targetChar}) marks the ${item.name} position.\n${targetLabel}(${targetChar}) appears in your ${posEn} Pillar, activating ${item.name}.`;
    }
    return `당신의 일지는 ${dayBranchEntry?.hangul}(${dayBranch.hanja})입니다.\n${item.name} 조건표에 따르면, 일지가 ${dayBranchEntry?.hangul}(${dayBranch.hanja})일 때 ${targetLabel}(${targetChar})이 ${item.name}의 위치입니다.\n${item.position}에 ${targetLabel}(${targetChar})이 있으므로 ${item.name}이 됩니다.`;
  }

  if (dayStemBased.includes(item.name)) {
    if (item.name === '천을귀인') {
      const chars = CHEONUL_TABLE[dayStem.hanja];
      const charsText = chars?.map(c => `${JIJI_DATA[c]?.hangul || c}(${c})`).join(', ');
      if (lang === 'en') {
        return `Your Day Stem is ${dayStemEntry.hangul}(${dayStem.hanja}).\nAccording to the Heavenly Noble table, when the Day Stem is ${dayStemEntry.hangul}(${dayStem.hanja}), ${charsText} are the noble positions.\nOne of these appears in your ${posEn} Pillar, making it Heavenly Noble (天乙貴人).`;
      }
      return `당신의 일간은 ${dayStemEntry.hangul}(${dayStem.hanja})입니다.\n천을귀인 조건표에 따르면, 일간이 ${dayStemEntry.hangul}(${dayStem.hanja})일 때 ${charsText}이 귀인 위치입니다.\n${item.position}에 해당 글자가 있으므로 천을귀인이 됩니다.`;
    }
    if (item.name === '문창귀인') {
      const targetChar = MUNCHANG_TABLE[dayStem.hanja];
      if (!targetChar) return '';
      const targetEntry = JIJI_DATA[targetChar];
      const targetLabel = targetEntry?.hangul || targetChar;
      if (lang === 'en') {
        return `Your Day Stem is ${dayStemEntry.hangul}(${dayStem.hanja}).\nAccording to the Literary Star table, when the Day Stem is ${dayStemEntry.hangul}(${dayStem.hanja}), ${targetLabel}(${targetChar}) marks the Literary Star position.\n${targetLabel}(${targetChar}) appears in your ${posEn} Pillar, making it Literary Star (文昌貴人).`;
      }
      return `당신의 일간은 ${dayStemEntry.hangul}(${dayStem.hanja})입니다.\n문창귀인 조건표에 따르면, 일간이 ${dayStemEntry.hangul}(${dayStem.hanja})일 때 ${targetLabel}(${targetChar})이 문창 위치입니다.\n${item.position}에 ${targetLabel}(${targetChar})이 있으므로 문창귀인이 됩니다.`;
    }
    if (item.name === '양인살') {
      const targetChar = YANGIN_TABLE[dayStem.hanja];
      if (!targetChar) return '';
      const targetEntry = JIJI_DATA[targetChar];
      const targetLabel = targetEntry?.hangul || targetChar;
      if (lang === 'en') {
        return `Your Day Stem is ${dayStemEntry.hangul}(${dayStem.hanja}).\nAccording to the Goat Blade table, when the Day Stem is ${dayStemEntry.hangul}(${dayStem.hanja}), ${targetLabel}(${targetChar}) marks the Goat Blade position.\n${targetLabel}(${targetChar}) appears in your ${posEn} Pillar, making it Goat Blade Star (羊刃殺).`;
      }
      return `당신의 일간은 ${dayStemEntry.hangul}(${dayStem.hanja})입니다.\n양인살 조건표에 따르면, 일간이 ${dayStemEntry.hangul}(${dayStem.hanja})일 때 ${targetLabel}(${targetChar})이 양인 위치입니다.\n${item.position}에 ${targetLabel}(${targetChar})이 있으므로 양인살이 됩니다.`;
    }
  }

  if (item.name === '귀문관살') {
    if (lang === 'en') {
      return `In your chart, the specific Branch pair required for Ghost Gate Star (鬼門關殺) appears at ${posEn}.\nThis character combination meets the conditions for Ghost Gate Star.`;
    }
    return `당신의 사주에서 ${item.position}에 귀문관살의 조건인 특정 지지 쌍이 모두 존재합니다.\n이 글자 조합이 귀문관(鬼門關)의 조건에 해당하여 귀문관살이 됩니다.`;
  }

  return '';
}

/* === 섹션 컴포넌트 === */

function MySipsung({ baziData, result, onOpen, lang }: {
  baziData: AnalysisPanelProps['baziData']; result: SajuResult; onOpen: (c: AnalysisModalContent) => void; lang: Lang;
}) {
  const POSITIONS = ['시주', '일주', '월주', '년주'];

  const handleClick = (position: string, chinese: string, type: 'gan' | 'zhi') => {
    const entry = SIPSUNG_DATA[chinese];
    if (!entry) return;
    onOpen({
      title: `${entry.korean} (${entry.hanja})`,
      badge: lang === 'en'
        ? `${POSITION_EN[position]} · ${type === 'gan' ? 'Stem' : 'Branch'}`
        : `${position} · ${type === 'gan' ? '천간' : '지지'}`,
      badgeColor: type === 'gan' ? '#5c534a' : '#8b7d6b',
      sections: [
        {
          heading: lang === 'en' ? 'Description' : '용어 설명',
          text: lang === 'en' ? `${entry.meaningEn}\n\n${entry.personalityEn}` : `${entry.meaning}\n\n${entry.personality}`,
        },
        {
          heading: lang === 'en' ? 'Category' : '카테고리',
          text: lang === 'en'
            ? `[${entry.category}] ${SIPSUNG_CATEGORY_DESC_EN[entry.category]}`
            : `[${entry.category}] ${SIPSUNG_CATEGORY_DESC[entry.category]}`,
        },
        {
          heading: lang === 'en' ? 'Why this Ten God?' : '왜 이 십성이 나왔나요?',
          text: buildSipsungReason(result, position, type, entry.korean, lang),
        },
      ],
    });
  };

  return (
    <div className={styles.resultGrid}>
      {POSITIONS.map(pos => {
        const data = baziData.sipsung.find(s => s.position === pos);
        if (!data) return null;
        const ganEntry = SIPSUNG_DATA[data.gan];

        return (
          <div key={pos} className={styles.resultCard}>
            <div className={styles.resultCardHeader}>
              {lang === 'en' ? POSITION_EN[pos] : pos}
            </div>
            <button className={styles.resultItem} onClick={() => handleClick(pos, data.gan, 'gan')} type="button">
              <span className={styles.resultLabel}>{lang === 'en' ? 'Stem' : '천간'}</span>
              <span className={`${styles.resultValue} ${ganEntry ? styles[`cat_${ganEntry.category}`] : ''}`}>
                {ganEntry?.korean || data.gan}
              </span>
            </button>
            {data.zhi.map((zhiChinese, i) => {
              const zhiEntry = SIPSUNG_DATA[zhiChinese];
              return (
                <button key={i} className={styles.resultItem} onClick={() => handleClick(pos, zhiChinese, 'zhi')} type="button">
                  <span className={styles.resultLabel}>
                    {lang === 'en' ? `Branch${data.zhi.length > 1 ? ` (${i + 1})` : ''}` : `지지${data.zhi.length > 1 ? ` (${i + 1})` : ''}`}
                  </span>
                  <span className={`${styles.resultValue} ${zhiEntry ? styles[`cat_${zhiEntry.category}`] : ''}`}>
                    {zhiEntry?.korean || zhiChinese}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function MyUnsung({ baziData, result, onOpen, lang }: {
  baziData: AnalysisPanelProps['baziData']; result: SajuResult; onOpen: (c: AnalysisModalContent) => void; lang: Lang;
}) {
  const POSITIONS = ['시주', '일주', '월주', '년주'];

  return (
    <div className={styles.resultGrid}>
      {POSITIONS.map(pos => {
        const data = baziData.unsung.find(u => u.position === pos);
        if (!data) return null;
        const entry = UNSUNG_DATA[data.value];

        return (
          <button
            key={pos}
            className={styles.unsungCard}
            onClick={() => {
              if (!entry) return;
              onOpen({
                title: `${entry.korean} (${entry.hanja})`,
                badge: lang === 'en' ? POSITION_EN[pos] : pos,
                sections: [
                  {
                    heading: lang === 'en' ? 'Description' : '용어 설명',
                    text: lang === 'en' ? entry.meaningEn : entry.meaning,
                  },
                  {
                    heading: lang === 'en' ? 'Interpretation' : '상세 해석',
                    text: lang === 'en' ? entry.descriptionEn : entry.description,
                  },
                  {
                    heading: lang === 'en' ? 'Why this Life Stage?' : '왜 이 12운성이 나왔나요?',
                    text: buildUnsungReason(result, pos, entry.korean, lang),
                  },
                ],
              });
            }}
            type="button"
          >
            <div className={styles.unsungHeader}>{lang === 'en' ? POSITION_EN[pos] : pos}</div>
            <div className={styles.unsungValue}>{entry?.korean || data.value}</div>
            <div className={styles.unsungHanja}>{entry?.hanja || ''}</div>
          </button>
        );
      })}
    </div>
  );
}

function MyHyungchung({ result, onOpen, lang }: { result: SajuResult; onOpen: (c: AnalysisModalContent) => void; lang: Lang }) {
  const interactions = findInteractions(result);

  if (interactions.length === 0) {
    return <div className={styles.emptyState}>
      {lang === 'en' ? 'No Branch Interactions found in your chart.' : '사주 내 형충회합이 발견되지 않았습니다.'}
    </div>;
  }

  const haps = interactions.filter(i => ['육합', '삼합', '방합'].includes(i.type));
  const clashes = interactions.filter(i => ['충', '형', '해', '파'].includes(i.type));

  const handleClick = (item: typeof interactions[0]) => {
    const desc = INTERACTION_DESC[item.type];
    const isHap = ['육합', '삼합', '방합'].includes(item.type);
    onOpen({
      title: lang === 'en' ? desc.titleEn : (item.detail || item.type),
      badge: item.type,
      badgeColor: isHap ? '#2d8a4e' : '#c62828',
      sections: [
        {
          heading: lang === 'en' ? 'Description' : '용어 설명',
          text: lang === 'en' ? desc.meaningEn : desc.meaning,
        },
        ...(item.resultElement
          ? [{
              heading: lang === 'en' ? 'Details' : '상세 해석',
              text: lang === 'en'
                ? `Found at ${item.positions.join(', ')}. The resulting element ${item.resultElement}(${OHANG_DATA[item.resultElement as keyof typeof OHANG_DATA]?.hanja || ''}) becomes stronger.`
                : `${item.positions.join(', ')}에서 발견되었으며, 합의 결과로 ${item.resultElement}(${OHANG_DATA[item.resultElement as keyof typeof OHANG_DATA]?.hanja || ''})의 기운이 강해집니다.`,
            }]
          : [{
              heading: lang === 'en' ? 'Details' : '상세 해석',
              text: lang === 'en'
                ? `Found at ${item.positions.join(', ')}.`
                : `${item.positions.join(', ')}에서 발견되었습니다.`,
            }]
        ),
        {
          heading: lang === 'en' ? 'Why this Interaction?' : '왜 이 형충회합이 나왔나요?',
          text: buildHyungchungReason(item, lang),
        },
      ],
    });
  };

  return (
    <div>
      {haps.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>
            {lang === 'en' ? 'Harmony (合) — Balance' : '합 (合) — 조화'}
          </h4>
          {haps.map((item, i) => (
            <button key={`hap-${i}`} className={`${styles.interactionItem} ${styles.interactionGood}`} onClick={() => handleClick(item)} type="button">
              <span className={styles.interactionType}>{item.type}</span>
              <span className={styles.interactionDetail}>{item.detail}</span>
            </button>
          ))}
        </div>
      )}
      {clashes.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>
            {lang === 'en' ? 'Clash & Conflict — Change' : '충·형 — 변화'}
          </h4>
          {clashes.map((item, i) => (
            <button key={`clash-${i}`} className={`${styles.interactionItem} ${styles.interactionBad}`} onClick={() => handleClick(item)} type="button">
              <span className={styles.interactionType}>{item.type}</span>
              <span className={styles.interactionDetail}>{item.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* === 대운 십성 계산 === */

function calcDaYunSipsung(dayStemHanja: string, yunStemHanja: string): { korean: string; category: string } | null {
  const dayEntry = CHEONGAN_DATA[dayStemHanja];
  const yunEntry = CHEONGAN_DATA[yunStemHanja];
  if (!dayEntry || !yunEntry) return null;

  const dayOhang = dayEntry.ohang;
  const yunOhang = yunEntry.ohang;
  const samePolarity = dayEntry.polarity === yunEntry.polarity;

  if (dayOhang === yunOhang) {
    return samePolarity ? { korean: '비견', category: '비겁' } : { korean: '겁재', category: '비겁' };
  }
  if (OHANG_DATA[dayOhang].generates === yunOhang) {
    return samePolarity ? { korean: '식신', category: '식상' } : { korean: '상관', category: '식상' };
  }
  if (OHANG_DATA[dayOhang].overcomes === yunOhang) {
    return samePolarity ? { korean: '편재', category: '재성' } : { korean: '정재', category: '재성' };
  }
  if (OHANG_DATA[yunOhang].overcomes === dayOhang) {
    return samePolarity ? { korean: '편관', category: '관성' } : { korean: '정관', category: '관성' };
  }
  if (OHANG_DATA[yunOhang].generates === dayOhang) {
    return samePolarity ? { korean: '편인', category: '인성' } : { korean: '정인', category: '인성' };
  }
  return null;
}

function openDaYunModal(
  dy: DaYunInfo,
  result: SajuResult,
  onOpen: (c: AnalysisModalContent) => void,
  lang: Lang,
  currentYear: number,
) {
  const stemChar = dy.ganZhi[0];
  const branchChar = dy.ganZhi[1];
  const stemEntry = CHEONGAN_DATA[stemChar];
  const branchEntry = JIJI_DATA[branchChar];
  const dayStem = result.dayPillar.stem;

  const sipsung = calcDaYunSipsung(dayStem.hanja, stemChar);
  const isCurrent = dy.startYear <= currentYear && currentYear <= dy.endYear;
  const isPast = dy.endYear < currentYear;

  const currentLiuNian = dy.liuNian.find(ln => ln.year === currentYear);

  const sections: AnalysisModalContent['sections'] = [];

  // 1. 십성 관계 + 천간/지지 기본 정보
  let detailText = '';
  if (lang === 'en') {
    detailText = `Stem ${stemEntry?.hangul || ''}(${stemChar}) · ${stemEntry?.ohang || ''} · ${stemEntry?.polarity || ''}\n${stemEntry?.meaningEn || ''}\n\nBranch ${branchEntry?.hangul || ''}(${branchChar}) · ${branchEntry?.ohang || ''} · ${branchEntry?.polarity || ''}\n${branchEntry?.meaningEn || ''}`;
    if (sipsung) {
      detailText += `\n\nDay Master ${dayStem.hanja} → Cycle Stem ${stemChar} = ${sipsung.korean} (${sipsung.category})`;
    }
  } else {
    detailText = `천간 ${stemEntry?.hangul || ''}(${stemChar}) · ${stemEntry?.ohang || ''} · ${stemEntry?.polarity || ''}\n${stemEntry?.meaning || ''}\n\n지지 ${branchEntry?.hangul || ''}(${branchChar}) · ${branchEntry?.ohang || ''} · ${branchEntry?.polarity || ''}\n${branchEntry?.meaning || ''}`;
    if (sipsung) {
      detailText += `\n\n일간 ${dayStem.hanja} → 대운 천간 ${stemChar} = ${sipsung.korean} (${sipsung.category})`;
    }
  }
  sections.push({ heading: lang === 'en' ? 'Cycle Details' : '대운 정보', text: detailText });

  // 2. 올해 세운 (현재 대운에만)
  if (isCurrent && currentLiuNian) {
    const lnStem = CHEONGAN_DATA[currentLiuNian.ganZhi[0]];
    const lnBranch = JIJI_DATA[currentLiuNian.ganZhi[1]];
    const lnText = lang === 'en'
      ? `${currentYear} · Age ${currentLiuNian.age} · ${currentLiuNian.ganZhi}\n\nStem ${lnStem?.hangul || ''}(${currentLiuNian.ganZhi[0]}) · ${lnStem?.ohang || ''}: ${lnStem?.meaningEn || ''}\nBranch ${lnBranch?.hangul || ''}(${currentLiuNian.ganZhi[1]}) · ${lnBranch?.ohang || ''}: ${lnBranch?.meaningEn || ''}`
      : `${currentYear}년 · 만 ${currentLiuNian.age}세 · ${currentLiuNian.ganZhi}\n\n천간 ${lnStem?.hangul || ''}(${currentLiuNian.ganZhi[0]}) · ${lnStem?.ohang || ''}: ${lnStem?.meaning || ''}\n지지 ${lnBranch?.hangul || ''}(${currentLiuNian.ganZhi[1]}) · ${lnBranch?.ohang || ''}: ${lnBranch?.meaning || ''}`;
    sections.push({
      heading: lang === 'en' ? `This Year (${currentYear})` : `올해 세운 (${currentYear}년)`,
      text: lnText,
    });
  }

  // 3. 세운 흐름 목록
  const liuNianText = dy.liuNian.map(ln => {
    const marker = ln.year === currentYear ? (lang === 'en' ? ' ◀ Now' : ' ◀ 현재') : '';
    return lang === 'en'
      ? `${ln.year}  Age ${ln.age}  ${ln.ganZhi}${marker}`
      : `${ln.year}년  만 ${ln.age}세  ${ln.ganZhi}${marker}`;
  }).join('\n');
  sections.push({
    heading: lang === 'en' ? 'Annual Fortune (歲運)' : '세운 (歲運) 흐름',
    text: liuNianText,
  });

  onOpen({
    title: lang === 'en' ? `${dy.ganZhi} Major Fortune Cycle` : `${dy.ganZhi} 대운 (大運)`,
    badge: lang === 'en'
      ? `Age ${dy.startAge}–${dy.endAge} · ${dy.startYear}–${dy.endYear}`
      : `${dy.startAge}~${dy.endAge}세 · ${dy.startYear}~${dy.endYear}년`,
    badgeColor: isCurrent ? '#c62828' : (isPast ? '#888888' : '#2d6a4f'),
    sections,
  });
}

/* === 대운 타임라인 컴포넌트 === */

function MyDaYun({ yunData, result, onOpen, lang, currentYear }: {
  yunData: YunData;
  result: SajuResult;
  onOpen: (c: AnalysisModalContent) => void;
  lang: Lang;
  currentYear: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentDaYun = yunData.daYun.find(dy => dy.startYear <= currentYear && currentYear <= dy.endYear);
  const displayedDaYun = selectedIndex !== null
    ? yunData.daYun.find(dy => dy.index === selectedIndex)
    : currentDaYun;

  const isDisplayedCurrent = displayedDaYun
    ? displayedDaYun.startYear <= currentYear && currentYear <= displayedDaYun.endYear
    : false;

  const handleCardClick = (dy: DaYunInfo) => {
    if (selectedIndex === dy.index) {
      openDaYunModal(dy, result, onOpen, lang, currentYear);
    } else {
      setSelectedIndex(dy.index);
    }
  };

  return (
    <div>
      {/* 현재/선택 위치 요약 */}
      {displayedDaYun && (
        <div className={styles.yunCurrentInfo}>
          <div className={styles.yunCurrentInfoLabel}>
            {isDisplayedCurrent
              ? (lang === 'en' ? 'You are currently in' : '현재 나의 대운')
              : (lang === 'en' ? 'Selected cycle' : '선택한 대운')}
          </div>
          <div className={styles.yunCurrentInfoValue}>
            {displayedDaYun.ganZhi} {lang === 'en' ? 'Major Fortune Cycle' : '대운'}
          </div>
          <div className={styles.yunCurrentInfoSub}>
            {lang === 'en'
              ? `Age ${displayedDaYun.startAge}–${displayedDaYun.endAge} · ${displayedDaYun.startYear}–${displayedDaYun.endYear}`
              : `${displayedDaYun.startAge}~${displayedDaYun.endAge}세 · ${displayedDaYun.startYear}~${displayedDaYun.endYear}년`}
          </div>
          {selectedIndex !== null && (
            <div className={styles.yunCurrentInfoHint}>
              {lang === 'en' ? 'Click the card again to see full details' : '카드를 한 번 더 클릭하면 상세 정보를 볼 수 있습니다'}
            </div>
          )}
        </div>
      )}

      {/* 타임라인 */}
      <div className={styles.yunTimeline}>
        {yunData.daYun.map(dy => {
          const isCurrent = dy.startYear <= currentYear && currentYear <= dy.endYear;
          const isPast = dy.endYear < currentYear;
          const isSelected = selectedIndex === dy.index;
          return (
            <button
              key={dy.index}
              className={`${styles.yunCard} ${isCurrent ? styles.yunCardCurrent : ''} ${isPast && !isSelected ? styles.yunCardPast : ''} ${isSelected && !isCurrent ? styles.yunCardSelected : ''}`}
              onClick={() => handleCardClick(dy)}
              type="button"
            >
              {isCurrent && (
                <div className={styles.yunCurrentBadge}>
                  {lang === 'en' ? 'NOW' : '현재'}
                </div>
              )}
              {isSelected && !isCurrent && (
                <div className={styles.yunSelectedBadge}>
                  {lang === 'en' ? '▶' : '▶'}
                </div>
              )}
              <div className={styles.yunGanZhi}>{dy.ganZhi}</div>
              <div className={styles.yunAge}>
                {lang === 'en' ? `${dy.startAge}–${dy.endAge}` : `${dy.startAge}~${dy.endAge}세`}
              </div>
              <div className={styles.yunYear}>{dy.startYear}</div>
              <div className={styles.yunYear}>~{dy.endYear}</div>
            </button>
          );
        })}
      </div>

      <p className={styles.yunHint}>
        {selectedIndex !== null
          ? (lang === 'en' ? 'Click the highlighted card again to open details.' : '선택된 카드를 한 번 더 클릭하면 상세 정보가 열립니다.')
          : (lang === 'en' ? 'Click any cycle to explore.' : '각 대운 카드를 클릭해 살펴보세요.')}
      </p>
    </div>
  );
}

function MySinsal({ result, onOpen, lang }: { result: SajuResult; onOpen: (c: AnalysisModalContent) => void; lang: Lang }) {
  const sinsals = findSinsals(result);

  if (sinsals.length === 0) {
    return <div className={styles.emptyState}>
      {lang === 'en' ? 'No notable Spirit Stars found in your chart.' : '사주 내 주요 신살이 발견되지 않았습니다.'}
    </div>;
  }

  const good = sinsals.filter(s => s.isGood);
  const bad = sinsals.filter(s => !s.isGood);

  const handleClick = (item: typeof sinsals[0]) => {
    const entry = SINSAL_DATA[item.name];
    if (!entry) return;
    onOpen({
      title: `${entry.name} (${entry.hanja})`,
      badge: lang === 'en' ? (item.isGood ? 'Auspicious' : 'Inauspicious') : (item.isGood ? '길신' : '흉살'),
      badgeColor: item.isGood ? '#2d8a4e' : '#c62828',
      sections: [
        {
          heading: lang === 'en' ? 'Description' : '용어 설명',
          text: lang === 'en' ? entry.meaningEn : entry.meaning,
        },
        {
          heading: lang === 'en' ? 'Interpretation' : '상세 해석',
          text: lang === 'en' ? entry.descriptionEn : entry.description,
        },
        {
          heading: lang === 'en' ? 'Why this Spirit Star?' : '왜 이 신살이 나왔나요?',
          text: buildSinsalReason(result, item, lang),
        },
      ],
    });
  };

  return (
    <div>
      {good.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>
            {lang === 'en' ? 'Auspicious Stars (吉神) — Positive Energy' : '길신 (吉神) — 좋은 기운'}
          </h4>
          {good.map((item, i) => (
            <button key={`good-${i}`} className={`${styles.interactionItem} ${styles.interactionGood}`} onClick={() => handleClick(item)} type="button">
              <span className={styles.interactionType}>{item.name}</span>
              <span className={styles.interactionDetail}>{lang === 'en' ? POSITION_EN[item.position] || item.position : item.position}</span>
            </button>
          ))}
        </div>
      )}
      {bad.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>
            {lang === 'en' ? 'Inauspicious Stars (凶煞) — Intense Energy' : '흉살 (凶煞) — 강한 기운'}
          </h4>
          {bad.map((item, i) => (
            <button key={`bad-${i}`} className={`${styles.interactionItem} ${styles.interactionBad}`} onClick={() => handleClick(item)} type="button">
              <span className={styles.interactionType}>{item.name}</span>
              <span className={styles.interactionDetail}>{lang === 'en' ? POSITION_EN[item.position] || item.position : item.position}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
