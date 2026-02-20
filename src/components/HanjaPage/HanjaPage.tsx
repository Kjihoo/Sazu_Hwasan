import { useState, useCallback } from 'react';
import { annotate, toPlainText } from '../../utils/hanjaAnnotator';
import type { Segment } from '../../utils/hanjaAnnotator';
import { HANJA_DICT, CATEGORY_LABELS } from '../../data/hanja';
import styles from './HanjaPage.module.css';

const PLACEHOLDER = `예시) 甲木은 天干의 첫 번째 글자로, 陽의 木 기운을 가집니다. 長生은 새로운 시작을 의미하며, 比肩은 나와 같은 오행입니다.`;

function AnnotatedText({ segments }: { segments: Segment[] }) {
  return (
    <p className={styles.annotatedText}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.content}</span>;
        }
        if (seg.type === 'hanja') {
          return (
            <ruby key={i} className={styles.hanjaRuby}>
              <span className={styles.hanjaChar}>{seg.char}</span>
              <rt className={styles.hanjaRt}>{seg.entry.meaning} {seg.entry.reading}</rt>
            </ruby>
          );
        }
        // unknown hanja: show as-is with dim highlight
        return (
          <span key={i} className={styles.hanjaUnknown} title="사전에 없는 한자">
            {seg.char}
          </span>
        );
      })}
    </p>
  );
}

export default function HanjaPage() {
  const [input, setInput] = useState('');
  const [segments, setSegments] = useState<Segment[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDict, setShowDict] = useState(false);

  const handleAnnotate = useCallback(() => {
    if (!input.trim()) return;
    setSegments(annotate(input));
    setCopied(false);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setSegments(null);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(() => {
    if (!segments) return;
    navigator.clipboard.writeText(toPlainText(segments)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [segments]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAnnotate();
    }
  }, [handleAnnotate]);

  // Group dictionary by category
  const grouped = Object.entries(HANJA_DICT).reduce<Record<string, Array<{ char: string; reading: string; meaning: string }>>>(
    (acc, [char, entry]) => {
      if (!acc[entry.category]) acc[entry.category] = [];
      acc[entry.category].push({ char, reading: entry.reading, meaning: entry.meaning });
      return acc;
    },
    {}
  );

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>한자 주석 도우미</h2>
        <p className={styles.introDesc}>
          사주 공부 중 모르는 한자가 있을 때, 텍스트를 붙여넣으면<br />
          한자 위에 뜻과 음을 자동으로 표시해 드립니다.
        </p>
      </div>

      <div className={styles.inputSection}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          rows={6}
        />
        <div className={styles.inputActions}>
          <button className={styles.btnPrimary} onClick={handleAnnotate} disabled={!input.trim()}>
            한자 풀이
          </button>
          <button className={styles.btnSecondary} onClick={handleClear} disabled={!input}>
            초기화
          </button>
          <span className={styles.hint}>Ctrl+Enter로도 실행</span>
        </div>
      </div>

      {segments && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>풀이 결과</span>
            <button className={styles.btnCopy} onClick={handleCopy}>
              {copied ? '복사됨 ✓' : '일반 텍스트로 복사'}
            </button>
          </div>
          <div className={styles.resultBox}>
            <AnnotatedText segments={segments} />
          </div>
          <p className={styles.resultNote}>
            빨간색은 사전에 있는 한자, 회색은 사전에 없는 한자입니다.
          </p>
        </div>
      )}

      <div className={styles.dictSection}>
        <button className={styles.dictToggle} onClick={() => setShowDict(v => !v)}>
          {showDict ? '▲ 사주 한자 사전 닫기' : '▼ 사주 한자 사전 보기'}
        </button>
        {showDict && (
          <div className={styles.dictContent}>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const chars = grouped[key];
              if (!chars || chars.length === 0) return null;
              return (
                <div key={key} className={styles.dictGroup}>
                  <h3 className={styles.dictGroupTitle}>{label}</h3>
                  <div className={styles.dictGrid}>
                    {chars.map(({ char, reading, meaning }) => (
                      <div key={char} className={styles.dictItem}>
                        <span className={styles.dictChar}>{char}</span>
                        <span className={styles.dictInfo}>{meaning} {reading}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
