import type { SajuResult, OhangType } from '../../types/saju';
import { OHANG_DATA } from '../../data/ohang';
import styles from './OhangSummary.module.css';

interface OhangSummaryProps {
  result: SajuResult;
}

const OHANG_ORDER: OhangType[] = ['목', '화', '토', '금', '수'];

export default function OhangSummary({ result }: OhangSummaryProps) {
  const total = Object.values(result.ohangCount).reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...Object.values(result.ohangCount));

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        오행 분포 <span className={styles.titleHanja}>五行</span>
      </h2>
      <div className={styles.chart}>
        {OHANG_ORDER.map(ohang => {
          const count = result.ohangCount[ohang];
          const entry = OHANG_DATA[ohang];
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={ohang} className={styles.row}>
              <span className={styles.label} style={{ color: entry.color }}>
                {ohang}({entry.hanja})
              </span>
              <div className={styles.barBg}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: entry.color,
                  }}
                />
              </div>
              <span className={styles.count}>{count}개</span>
              {count === 0 && <span className={styles.missing}>없음</span>}
            </div>
          );
        })}
      </div>
      <p className={styles.total}>총 {total}글자 중 오행 분포</p>
    </section>
  );
}
