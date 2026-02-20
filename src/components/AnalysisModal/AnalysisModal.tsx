import { useEffect, useRef } from 'react';
import styles from './AnalysisModal.module.css';

export interface AnalysisModalContent {
  title: string;
  badge?: string;
  badgeColor?: string;
  sections: { heading: string; text: string }[];
}

interface AnalysisModalProps {
  isOpen: boolean;
  content: AnalysisModalContent | null;
  onClose: () => void;
}

export default function AnalysisModal({ isOpen, content, onClose }: AnalysisModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeRef.current) closeRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !content) return null;

  return (
    <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button ref={closeRef} className={styles.closeBtn} onClick={onClose} type="button" aria-label="닫기">
          &times;
        </button>

        <div className={styles.header}>
          <span className={styles.headerTitle}>{content.title}</span>
          {content.badge && (
            <span className={styles.badge} style={content.badgeColor ? { background: content.badgeColor, color: 'white' } : undefined}>
              {content.badge}
            </span>
          )}
        </div>

        {content.sections.map((section, i) => (
          <div key={i} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.heading}</h3>
            <div className={styles.sectionText}>
              {section.text.split('\n').map((line, j) => (
                <p key={j}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
