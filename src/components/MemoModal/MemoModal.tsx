import { useEffect, useRef } from 'react';
import type { CharInfo, BirthInput, SajuResult } from '../../types/saju';
import { OHANG_DATA } from '../../data/ohang';
import { buildInterpretation } from '../../utils/interpretationBuilder';
import ElementBadge from '../ElementBadge/ElementBadge';
import styles from './MemoModal.module.css';

interface MemoModalProps {
  isOpen: boolean;
  charInfo: CharInfo | null;
  birthInput: BirthInput | null;
  sajuResult: SajuResult | null;
  onClose: () => void;
}

export default function MemoModal({ isOpen, charInfo, birthInput, sajuResult, onClose }: MemoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !charInfo || !birthInput || !sajuResult) return null;

  const interp = buildInterpretation(charInfo, birthInput, sajuResult);
  const ohangEntry = OHANG_DATA[charInfo.ohang];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={styles.modal} ref={modalRef}>
        <button ref={closeRef} className={styles.closeBtn} onClick={onClose} type="button" aria-label="닫기">
          &times;
        </button>

        <div className={styles.header}>
          <span className={styles.headerHanja} style={{ color: ohangEntry.color }}>
            {charInfo.hanja}
          </span>
          <span className={styles.headerHangul}>{charInfo.hangul}</span>
          <ElementBadge ohang={charInfo.ohang} polarity={charInfo.polarity} />
          <span className={styles.headerPosition}>
            {charInfo.pillarPosition} · {charInfo.type === 'cheongan' ? '천간' : '지지'}
          </span>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>용어 설명</h3>
          <p className={styles.sectionText}>{interp.termExplanation}</p>
          <p className={styles.sectionText}>{interp.symbolism}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>왜 이 글자가 나왔나요?</h3>
          <p className={styles.sectionText}>{interp.contextExplanation}</p>
          <p className={styles.sectionSubtext}>{interp.pillarExplanation}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>오행 정보</h3>
          <p className={styles.sectionText}>{interp.ohangExplanation}</p>
        </div>
      </div>
    </div>
  );
}
