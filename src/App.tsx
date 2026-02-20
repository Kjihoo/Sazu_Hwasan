import { useState, useCallback, useRef } from 'react';
import type { CharInfo, MemoState } from './types/saju';
import { useSaju } from './hooks/useSaju';
import { LangProvider } from './context/LangContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import InputForm from './components/InputForm/InputForm';
import PillarDisplay from './components/PillarDisplay/PillarDisplay';
import OhangSummary from './components/OhangSummary/OhangSummary';
import AnalysisPanel from './components/AnalysisPanel/AnalysisPanel';
import MemoModal from './components/MemoModal/MemoModal';
import HanjaPage from './components/HanjaPage/HanjaPage';
import styles from './App.module.css';

type Page = 'saju' | 'hanja';

function App() {
  const [page, setPage] = useState<Page>('saju');
  const { birthInput, sajuResult, baziData, calculate } = useSaju();
  const [memoState, setMemoState] = useState<MemoState>({ isOpen: false, charInfo: null });
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCharClick = useCallback((charInfo: CharInfo) => {
    setMemoState({ isOpen: true, charInfo });
  }, []);

  const handleCloseMemo = useCallback(() => {
    setMemoState({ isOpen: false, charInfo: null });
  }, []);

  const handleSubmit = useCallback((input: Parameters<typeof calculate>[0]) => {
    calculate(input);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [calculate]);

  return (
    <LangProvider>
      <div className={styles.app}>
        <Header currentPage={page} onNavigate={setPage} />
        <main className={styles.main}>
          {page === 'saju' ? (
            <>
              <InputForm onSubmit={handleSubmit} />
              {sajuResult && baziData && (
                <div ref={resultRef}>
                  <PillarDisplay result={sajuResult} onCharClick={handleCharClick} />
                  <OhangSummary result={sajuResult} />
                  <AnalysisPanel result={sajuResult} baziData={baziData} />
                </div>
              )}
            </>
          ) : (
            <HanjaPage />
          )}
        </main>
        <MemoModal
          isOpen={memoState.isOpen}
          charInfo={memoState.charInfo}
          birthInput={birthInput}
          sajuResult={sajuResult}
          onClose={handleCloseMemo}
        />
        <Footer />
      </div>
    </LangProvider>
  );
}

export default App;
