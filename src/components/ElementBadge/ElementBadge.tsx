import type { OhangType, Polarity } from '../../types/saju';
import { OHANG_DATA } from '../../data/ohang';
import styles from './ElementBadge.module.css';

interface ElementBadgeProps {
  ohang: OhangType;
  polarity: Polarity;
  onClick?: () => void;
}

export default function ElementBadge({ ohang, polarity, onClick }: ElementBadgeProps) {
  const entry = OHANG_DATA[ohang];

  return (
    <button
      className={styles.badge}
      style={{
        backgroundColor: entry.bgColor,
        color: entry.textColor,
        borderColor: entry.color,
      }}
      onClick={onClick}
      type="button"
      title={`${ohang}(${entry.hanja}) · ${polarity}`}
    >
      {ohang}{entry.hanja} · {polarity}
    </button>
  );
}
