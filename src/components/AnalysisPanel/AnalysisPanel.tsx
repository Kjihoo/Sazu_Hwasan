import { useState, useCallback } from 'react';
import type { SajuResult } from '../../types/saju';
import { SIPSUNG_DATA, SIPSUNG_GENERAL_DESC, SIPSUNG_CATEGORY_DESC } from '../../data/sipsung';
import { UNSUNG_DATA, UNSUNG_GENERAL_DESC } from '../../data/unsung';
import { INTERACTION_DESC, HYUNGCHUNG_GENERAL_DESC } from '../../data/hyungchung';
import {
  SINSAL_DATA, SINSAL_GENERAL_DESC,
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
  };
}

type TabKey = 'sipsung' | 'unsung' | 'hyungchung' | 'sinsal';
type ViewMode = 'my' | 'info';

const TABS: { key: TabKey; label: string; hanja: string }[] = [
  { key: 'sipsung', label: '십성', hanja: '十星' },
  { key: 'unsung', label: '12운성', hanja: '十二運星' },
  { key: 'hyungchung', label: '형충회합', hanja: '刑沖會合' },
  { key: 'sinsal', label: '신살', hanja: '神煞' },
];

export default function AnalysisPanel({ result, baziData }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('sipsung');
  const [viewMode, setViewMode] = useState<ViewMode>('my');
  const [modalContent, setModalContent] = useState<AnalysisModalContent | null>(null);

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
            {tab.label}
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
          나의 {TABS.find(t => t.key === activeTab)!.label}
        </button>
        <button
          className={`${styles.modeBtn} ${viewMode === 'info' ? styles.modeBtnActive : ''}`}
          onClick={() => setViewMode('info')}
          type="button"
        >
          {TABS.find(t => t.key === activeTab)!.label}이란?
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'sipsung' && (
          viewMode === 'my'
            ? <MySipsung baziData={baziData} result={result} onOpen={openModal} />
            : <InfoBox text={SIPSUNG_GENERAL_DESC} />
        )}
        {activeTab === 'unsung' && (
          viewMode === 'my'
            ? <MyUnsung baziData={baziData} result={result} onOpen={openModal} />
            : <InfoBox text={UNSUNG_GENERAL_DESC} />
        )}
        {activeTab === 'hyungchung' && (
          viewMode === 'my'
            ? <MyHyungchung result={result} onOpen={openModal} />
            : <InfoBox text={HYUNGCHUNG_GENERAL_DESC} />
        )}
        {activeTab === 'sinsal' && (
          viewMode === 'my'
            ? <MySinsal result={result} onOpen={openModal} />
            : <InfoBox text={SINSAL_GENERAL_DESC} />
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

function buildSipsungReason(result: SajuResult, position: string, type: 'gan' | 'zhi', sipsungName: string): string {
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
    return `일간 ${dayEntry.hangul}(${dayStem.hanja})은 나 자신이므로 "일주(日主)"가 됩니다.`;
  }

  const me = dayStem.ohang;
  const target = targetChar.ohang;
  const dayOhang = OHANG_DATA[me];
  const targetOhang = OHANG_DATA[target];

  let relation = '';
  if (me === target) relation = `나(${dayOhang.hanja})와 같은 오행(${targetOhang.hanja})`;
  else if (OHANG_DATA[me].generates === target) relation = `내가(${dayOhang.hanja}) 생(生)하는 오행(${targetOhang.hanja})`;
  else if (OHANG_DATA[me].overcomes === target) relation = `내가(${dayOhang.hanja}) 극(剋)하는 오행(${targetOhang.hanja})`;
  else if (OHANG_DATA[target].generates === me) relation = `나를(${dayOhang.hanja}) 극(剋)하는 오행(${targetOhang.hanja})`;
  else if (OHANG_DATA[target].overcomes === me) relation = `나를(${dayOhang.hanja}) 생(生)해주는 오행(${targetOhang.hanja})`;

  const polarityText = dayStem.polarity === targetChar.polarity ? '같은 음양' : '다른 음양';
  return `당신의 일간(나)은 ${dayEntry.hangul}(${dayStem.hanja}·${me})이고, ${position} ${type === 'gan' ? '천간' : '지지'}은 ${targetChar.hangul}(${targetChar.hanja}·${target})입니다.\n${relation}이면서 ${polarityText}이므로 "${sipsungName}"이 됩니다.`;
}

function buildUnsungReason(result: SajuResult, position: string, unsungName: string): string {
  const dayStem = result.dayPillar.stem;
  const dayEntry = CHEONGAN_DATA[dayStem.hanja];

  const pillarMap: Record<string, typeof result.yearPillar> = {
    '년주': result.yearPillar, '월주': result.monthPillar, '일주': result.dayPillar,
  };
  if (result.hourPillar) pillarMap['시주'] = result.hourPillar;
  const pillar = pillarMap[position];
  if (!pillar) return '';

  const branchEntry = JIJI_DATA[pillar.branch.hanja];
  return `당신의 일간(나)은 ${dayEntry.hangul}(${dayStem.hanja}·${dayStem.ohang})이고, ${position} 지지는 ${branchEntry?.hangul || pillar.branch.hangul}(${pillar.branch.hanja})입니다.\n12운성은 일간이 각 지지에서 어떤 에너지 단계에 있는지를 나타냅니다.\n${dayEntry.hangul}(${dayStem.hanja}) 일간이 ${branchEntry?.hangul || pillar.branch.hangul}(${pillar.branch.hanja}) 지지에서 "${unsungName}"의 단계에 해당합니다.`;
}

function buildHyungchungReason(item: FoundInteraction): string {
  const positionText = item.positions.join('과 ');
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

  let reason = `당신의 사주에서 ${positionText}에 각각 ${branchText}이(가) 있습니다.\n이 글자들은 ${typeDescMap[item.type] || item.type}의 조건에 해당합니다.`;

  if (item.resultElement) {
    reason += `\n결과적으로 ${item.resultElement}(${OHANG_DATA[item.resultElement as keyof typeof OHANG_DATA]?.hanja || ''}) 오행의 기운이 강해집니다.`;
  }

  return reason;
}

function buildSinsalReason(result: SajuResult, item: FoundSinsal): string {
  const dayBranch = result.dayPillar.branch;
  const dayStem = result.dayPillar.stem;
  const dayBranchEntry = JIJI_DATA[dayBranch.hanja];
  const dayStemEntry = CHEONGAN_DATA[dayStem.hanja];

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
    return `당신의 일지는 ${dayBranchEntry?.hangul}(${dayBranch.hanja})입니다.\n${item.name} 조건표에 따르면, 일지가 ${dayBranchEntry?.hangul}(${dayBranch.hanja})일 때 ${targetEntry?.hangul || targetChar}(${targetChar})이 ${item.name}의 위치입니다.\n${item.position}에 ${targetEntry?.hangul || targetChar}(${targetChar})이 있으므로 ${item.name}이 됩니다.`;
  }

  if (dayStemBased.includes(item.name)) {
    if (item.name === '천을귀인') {
      const chars = CHEONUL_TABLE[dayStem.hanja];
      const charsText = chars?.map(c => `${JIJI_DATA[c]?.hangul || c}(${c})`).join(', ');
      return `당신의 일간은 ${dayStemEntry.hangul}(${dayStem.hanja})입니다.\n천을귀인 조건표에 따르면, 일간이 ${dayStemEntry.hangul}(${dayStem.hanja})일 때 ${charsText}이 귀인 위치입니다.\n${item.position}에 해당 글자가 있으므로 천을귀인이 됩니다.`;
    }
    if (item.name === '문창귀인') {
      const targetChar = MUNCHANG_TABLE[dayStem.hanja];
      if (!targetChar) return '';
      const targetEntry = JIJI_DATA[targetChar];
      return `당신의 일간은 ${dayStemEntry.hangul}(${dayStem.hanja})입니다.\n문창귀인 조건표에 따르면, 일간이 ${dayStemEntry.hangul}(${dayStem.hanja})일 때 ${targetEntry?.hangul || targetChar}(${targetChar})이 문창 위치입니다.\n${item.position}에 ${targetEntry?.hangul || targetChar}(${targetChar})이 있으므로 문창귀인이 됩니다.`;
    }
    if (item.name === '양인살') {
      const targetChar = YANGIN_TABLE[dayStem.hanja];
      if (!targetChar) return '';
      const targetEntry = JIJI_DATA[targetChar];
      return `당신의 일간은 ${dayStemEntry.hangul}(${dayStem.hanja})입니다.\n양인살 조건표에 따르면, 일간이 ${dayStemEntry.hangul}(${dayStem.hanja})일 때 ${targetEntry?.hangul || targetChar}(${targetChar})이 양인 위치입니다.\n${item.position}에 ${targetEntry?.hangul || targetChar}(${targetChar})이 있으므로 양인살이 됩니다.`;
    }
  }

  if (item.name === '귀문관살') {
    return `당신의 사주에서 ${item.position}에 귀문관살의 조건인 특정 지지 쌍이 모두 존재합니다.\n이 글자 조합이 귀문관(鬼門關)의 조건에 해당하여 귀문관살이 됩니다.`;
  }

  return '';
}

/* === 섹션 컴포넌트 === */

function MySipsung({ baziData, result, onOpen }: {
  baziData: AnalysisPanelProps['baziData']; result: SajuResult; onOpen: (c: AnalysisModalContent) => void;
}) {
  const POSITIONS = ['시주', '일주', '월주', '년주'];

  const handleClick = (position: string, chinese: string, type: 'gan' | 'zhi') => {
    const entry = SIPSUNG_DATA[chinese];
    if (!entry) return;
    onOpen({
      title: `${entry.korean} (${entry.hanja})`,
      badge: `${position} · ${type === 'gan' ? '천간' : '지지'}`,
      badgeColor: type === 'gan' ? '#5c534a' : '#8b7d6b',
      sections: [
        { heading: '용어 설명', text: `${entry.meaning}\n\n${entry.personality}` },
        { heading: '카테고리', text: `[${entry.category}] ${SIPSUNG_CATEGORY_DESC[entry.category]}` },
        { heading: '왜 이 십성이 나왔나요?', text: buildSipsungReason(result, position, type, entry.korean) },
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
            <div className={styles.resultCardHeader}>{pos}</div>
            <button className={styles.resultItem} onClick={() => handleClick(pos, data.gan, 'gan')} type="button">
              <span className={styles.resultLabel}>천간</span>
              <span className={`${styles.resultValue} ${ganEntry ? styles[`cat_${ganEntry.category}`] : ''}`}>
                {ganEntry?.korean || data.gan}
              </span>
            </button>
            {data.zhi.map((zhiChinese, i) => {
              const zhiEntry = SIPSUNG_DATA[zhiChinese];
              return (
                <button key={i} className={styles.resultItem} onClick={() => handleClick(pos, zhiChinese, 'zhi')} type="button">
                  <span className={styles.resultLabel}>지지{data.zhi.length > 1 ? ` (${i + 1})` : ''}</span>
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

function MyUnsung({ baziData, result, onOpen }: {
  baziData: AnalysisPanelProps['baziData']; result: SajuResult; onOpen: (c: AnalysisModalContent) => void;
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
                badge: pos,
                sections: [
                  { heading: '용어 설명', text: entry.meaning },
                  { heading: '상세 해석', text: entry.description },
                  { heading: '왜 이 12운성이 나왔나요?', text: buildUnsungReason(result, pos, entry.korean) },
                ],
              });
            }}
            type="button"
          >
            <div className={styles.unsungHeader}>{pos}</div>
            <div className={styles.unsungValue}>{entry?.korean || data.value}</div>
            <div className={styles.unsungHanja}>{entry?.hanja || ''}</div>
          </button>
        );
      })}
    </div>
  );
}

function MyHyungchung({ result, onOpen }: { result: SajuResult; onOpen: (c: AnalysisModalContent) => void }) {
  const interactions = findInteractions(result);

  if (interactions.length === 0) {
    return <div className={styles.emptyState}>사주 내 형충회합이 발견되지 않았습니다.</div>;
  }

  const haps = interactions.filter(i => ['육합', '삼합', '방합'].includes(i.type));
  const clashes = interactions.filter(i => ['충', '형', '해', '파'].includes(i.type));

  const handleClick = (item: typeof interactions[0]) => {
    const desc = INTERACTION_DESC[item.type];
    onOpen({
      title: item.detail || item.type,
      badge: item.type,
      badgeColor: ['육합', '삼합', '방합'].includes(item.type) ? '#2d8a4e' : '#c62828',
      sections: [
        { heading: '용어 설명', text: desc.meaning },
        ...(item.resultElement ? [{ heading: '상세 해석', text: `${item.positions.join(', ')}에서 발견되었으며, 합의 결과로 ${item.resultElement}(${OHANG_DATA[item.resultElement as keyof typeof OHANG_DATA]?.hanja || ''})의 기운이 강해집니다.` }] : [{ heading: '상세 해석', text: `${item.positions.join(', ')}에서 발견되었습니다.` }]),
        { heading: '왜 이 형충회합이 나왔나요?', text: buildHyungchungReason(item) },
      ],
    });
  };

  return (
    <div>
      {haps.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>합 (合) — 조화</h4>
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
          <h4 className={styles.groupTitle}>충·형 — 변화</h4>
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

function MySinsal({ result, onOpen }: { result: SajuResult; onOpen: (c: AnalysisModalContent) => void }) {
  const sinsals = findSinsals(result);

  if (sinsals.length === 0) {
    return <div className={styles.emptyState}>사주 내 주요 신살이 발견되지 않았습니다.</div>;
  }

  const good = sinsals.filter(s => s.isGood);
  const bad = sinsals.filter(s => !s.isGood);

  const handleClick = (item: typeof sinsals[0]) => {
    const entry = SINSAL_DATA[item.name];
    if (!entry) return;
    onOpen({
      title: `${entry.name} (${entry.hanja})`,
      badge: item.isGood ? '길신' : '흉살',
      badgeColor: item.isGood ? '#2d8a4e' : '#c62828',
      sections: [
        { heading: '용어 설명', text: entry.meaning },
        { heading: '상세 해석', text: entry.description },
        { heading: '왜 이 신살이 나왔나요?', text: buildSinsalReason(result, item) },
      ],
    });
  };

  return (
    <div>
      {good.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>길신 (吉神) — 좋은 기운</h4>
          {good.map((item, i) => (
            <button key={`good-${i}`} className={`${styles.interactionItem} ${styles.interactionGood}`} onClick={() => handleClick(item)} type="button">
              <span className={styles.interactionType}>{item.name}</span>
              <span className={styles.interactionDetail}>{item.position}</span>
            </button>
          ))}
        </div>
      )}
      {bad.length > 0 && (
        <div className={styles.interactionGroup}>
          <h4 className={styles.groupTitle}>흉살 (凶煞) — 강한 기운</h4>
          {bad.map((item, i) => (
            <button key={`bad-${i}`} className={`${styles.interactionItem} ${styles.interactionBad}`} onClick={() => handleClick(item)} type="button">
              <span className={styles.interactionType}>{item.name}</span>
              <span className={styles.interactionDetail}>{item.position}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
