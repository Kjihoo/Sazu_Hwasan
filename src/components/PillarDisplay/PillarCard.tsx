import type { PillarInfo, CharInfo } from '../../types/saju';
import { OHANG_DATA } from '../../data/ohang';
import { JIJI_DATA } from '../../data/jiji';
import ElementBadge from '../ElementBadge/ElementBadge';
import styles from './PillarCard.module.css';

interface PillarCardProps {
  pillar: PillarInfo;
  onCharClick: (charInfo: CharInfo) => void;
  delay?: number;
}

const PILLAR_LABELS: Record<string, { ko: string; hanja: string }> = {
  '년주': { ko: '년주', hanja: '年柱' },
  '월주': { ko: '월주', hanja: '月柱' },
  '일주': { ko: '일주', hanja: '日柱' },
  '시주': { ko: '시주', hanja: '時柱' },
};

function CharCell({ charInfo, onCharClick }: { charInfo: CharInfo; onCharClick: (c: CharInfo) => void }) {
  const ohangEntry = OHANG_DATA[charInfo.ohang];
  const isJiji = charInfo.type === 'jiji';
  const animal = isJiji ? JIJI_DATA[charInfo.hanja]?.animal : null;

  return (
    <button
      className={styles.charCell}
      onClick={() => onCharClick(charInfo)}
      type="button"
      style={{ '--char-color': ohangEntry.color } as React.CSSProperties}
    >
      <span className={styles.hanja} style={{ color: ohangEntry.color }}>
        {charInfo.hanja}
      </span>
      <span className={styles.hangul}>
        {charInfo.hangul}
        {animal && <span className={styles.animal}>({animal})</span>}
      </span>
      <ElementBadge
        ohang={charInfo.ohang}
        polarity={charInfo.polarity}
        onClick={() => onCharClick(charInfo)}
      />
    </button>
  );
}

export default function PillarCard({ pillar, onCharClick, delay = 0 }: PillarCardProps) {
  const label = PILLAR_LABELS[pillar.position];
  const isDayPillar = pillar.position === '일주';

  return (
    <div
      className={`${styles.card} ${isDayPillar ? styles.dayPillar : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.pillarLabel}>
        {label.ko}
        <span className={styles.pillarLabelHanja}>{label.hanja}</span>
      </div>
      <div className={styles.charContainer}>
        <div className={styles.typeLabel}>천간</div>
        <CharCell charInfo={pillar.stem} onCharClick={onCharClick} />
        <div className={styles.divider} />
        <div className={styles.typeLabel}>지지</div>
        <CharCell charInfo={pillar.branch} onCharClick={onCharClick} />
      </div>
    </div>
  );
}
