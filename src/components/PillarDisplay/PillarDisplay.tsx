import type { SajuResult, CharInfo } from '../../types/saju';
import { useLang } from '../../context/LangContext';
import PillarCard from './PillarCard';
import styles from './PillarDisplay.module.css';

interface PillarDisplayProps {
  result: SajuResult;
  onCharClick: (charInfo: CharInfo) => void;
}

export default function PillarDisplay({ result, onCharClick }: PillarDisplayProps) {
  const { lang } = useLang();
  const pillars = [
    result.hourPillar,
    result.dayPillar,
    result.monthPillar,
    result.yearPillar,
  ];

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {lang === 'en' ? 'Four Pillars of Destiny' : '사주팔자'}{' '}
        <span className={styles.titleHanja}>四柱八字</span>
      </h2>
      <div className={styles.pillarsRow}>
        {pillars.map((pillar, i) => {
          if (!pillar) {
            return (
              <div key="unknown" className={styles.unknownPillar}>
                <div className={styles.unknownLabel}>
                  {lang === 'en' ? 'Hour' : '시주'}<br />
                  <span>時柱</span>
                </div>
                <div className={styles.unknownContent}>
                  <span className={styles.unknownChar}>?</span>
                  <span className={styles.unknownText}>
                    {lang === 'en' ? 'Time Unknown' : '시간 미입력'}
                  </span>
                </div>
              </div>
            );
          }
          return (
            <PillarCard
              key={pillar.position}
              pillar={pillar}
              onCharClick={onCharClick}
              delay={i * 100}
            />
          );
        })}
      </div>
      <p className={styles.hint}>
        {lang === 'en'
          ? 'Click a character for details'
          : '글자를 클릭하면 자세한 설명을 볼 수 있습니다'}
      </p>
    </section>
  );
}
