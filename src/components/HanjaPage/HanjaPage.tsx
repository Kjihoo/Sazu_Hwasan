import { useState, useCallback, useRef, useEffect } from 'react';
import { annotate, toPlainText } from '../../utils/hanjaAnnotator';
import type { Segment } from '../../utils/hanjaAnnotator';
import { recognizeText } from '../../utils/ocr';
import type { OcrProgress } from '../../utils/ocr';
import { HANJA_DICT, CATEGORY_LABELS } from '../../data/hanja';
import styles from './HanjaPage.module.css';

const PLACEHOLDER = `예시) 甲木은 天干의 첫 번째 글자로, 陽의 木 기운을 가집니다. 長生은 새로운 시작을 의미하며, 比肩은 나와 같은 오행입니다.`;

type InputMode = 'text' | 'image';

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
  const [mode, setMode] = useState<InputMode>('text');

  // 텍스트 모드
  const [input, setInput] = useState('');
  const [segments, setSegments] = useState<Segment[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDict, setShowDict] = useState(false);

  // 이미지 모드
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress>({ status: 'idle', progress: 0, message: '' });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 이미지 URL 생성/해제
  useEffect(() => {
    if (!imageFile) { setImageUrl(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // 이미지 선택 시 자동 OCR 실행
  useEffect(() => {
    if (!imageFile) return;
    setSegments(null);
    setInput('');
    setOcrProgress({ status: 'idle', progress: 0, message: '' });

    recognizeText(imageFile, setOcrProgress)
      .then(text => {
        const cleaned = text.trim();
        setInput(cleaned);
        if (cleaned) {
          setSegments(annotate(cleaned));
        }
      })
      .catch(() => {
        setOcrProgress({ status: 'error', progress: 0, message: '인식 실패. 다시 시도해 주세요.' });
      });
  }, [imageFile]);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
  }, []);

  // 드래그 앤 드롭
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, [handleImageFile]);

  // Ctrl+V 붙여넣기 (전역)
  useEffect(() => {
    if (mode !== 'image') return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) handleImageFile(file);
          return;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mode, handleImageFile]);

  // 텍스트 풀이
  const handleAnnotate = useCallback(() => {
    if (!input.trim()) return;
    setSegments(annotate(input));
    setCopied(false);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setSegments(null);
    setCopied(false);
    setImageFile(null);
    setOcrProgress({ status: 'idle', progress: 0, message: '' });
  }, []);

  const handleCopy = useCallback(() => {
    if (!segments) return;
    navigator.clipboard.writeText(toPlainText(segments)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [segments]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAnnotate();
  }, [handleAnnotate]);

  const isOcrRunning = ocrProgress.status === 'loading' || ocrProgress.status === 'recognizing';

  // 사전 그룹핑
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
          사주 공부 중 모르는 한자가 있을 때, 텍스트를 붙여넣거나<br />
          이미지를 업로드하면 한자 위에 뜻과 음을 표시해 드립니다.
        </p>
      </div>

      {/* 모드 전환 탭 */}
      <div className={styles.modeTabs}>
        <button
          className={`${styles.modeTab} ${mode === 'text' ? styles.modeTabActive : ''}`}
          onClick={() => { setMode('text'); handleClear(); }}
        >
          텍스트 입력
        </button>
        <button
          className={`${styles.modeTab} ${mode === 'image' ? styles.modeTabActive : ''}`}
          onClick={() => { setMode('image'); handleClear(); }}
        >
          이미지에서 인식
        </button>
      </div>

      {mode === 'text' ? (
        /* ───────── 텍스트 모드 ───────── */
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
      ) : (
        /* ───────── 이미지 모드 ───────── */
        <div className={styles.imageSection}>
          {/* 드롭 존 */}
          <div
            ref={dropZoneRef}
            className={`${styles.dropZone} ${isDragOver ? styles.dropZoneOver : ''} ${imageFile ? styles.dropZoneHasImage : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !imageFile && fileInputRef.current?.click()}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && !imageFile && fileInputRef.current?.click()}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="업로드된 이미지" className={styles.imagePreview} />
            ) : (
              <div className={styles.dropZoneContent}>
                <span className={styles.dropZoneIcon}>🖼</span>
                <p className={styles.dropZoneText}>이미지를 드래그하거나 클릭하여 선택</p>
                <p className={styles.dropZoneSubtext}>또는 화면 캡처 후 Ctrl+V 붙여넣기</p>
                <p className={styles.dropZoneSubtext}>JPG, PNG, WEBP 등 지원</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
          />

          {/* 이미지 선택 후 버튼 */}
          {imageFile && (
            <div className={styles.imageActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => { setImageFile(null); setOcrProgress({ status: 'idle', progress: 0, message: '' }); setSegments(null); setInput(''); }}
                disabled={isOcrRunning}
              >
                다른 이미지 선택
              </button>
            </div>
          )}

          {/* 진행 상황 */}
          {(isOcrRunning || ocrProgress.status === 'error') && (
            <div className={styles.progressArea}>
              {ocrProgress.status === 'error' ? (
                <p className={styles.progressError}>{ocrProgress.message}</p>
              ) : (
                <>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${ocrProgress.progress}%` }}
                    />
                  </div>
                  <p className={styles.progressText}>{ocrProgress.message} ({ocrProgress.progress}%)</p>
                  <p className={styles.progressNote}>처음 사용 시 언어 데이터를 다운로드합니다 (~30MB, 한글+한자)</p>
                </>
              )}
            </div>
          )}

          {/* OCR 완료 후 추출된 텍스트 편집 */}
          {ocrProgress.status === 'done' && (
            <div className={styles.ocrTextArea}>
              <label className={styles.ocrTextLabel}>인식된 텍스트 (수정 가능)</label>
              <textarea
                className={styles.textarea}
                value={input}
                onChange={e => { setInput(e.target.value); setSegments(null); }}
                onKeyDown={handleKeyDown}
                rows={5}
              />
              <div className={styles.inputActions}>
                <button className={styles.btnPrimary} onClick={handleAnnotate} disabled={!input.trim()}>
                  한자 풀이
                </button>
                <span className={styles.hint}>Ctrl+Enter로도 실행</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────── 결과 ───────── */}
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

      {/* ───────── 한자 사전 ───────── */}
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
