import { useLang } from '../../context/LangContext';
import styles from './Header.module.css';

export default function Header() {
  const { lang, setLang } = useLang();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>사주화산</h1>
      <p className={styles.subtitle}>
        {lang === 'ko' ? '나의 사주를 쉽게 알아보세요' : 'Explore Your Four Pillars of Destiny'}
      </p>
      <div className={styles.langToggle}>
        <button
          className={`${styles.langBtn} ${lang === 'ko' ? styles.langBtnActive : ''}`}
          onClick={() => setLang('ko')}
          type="button"
        >
          KR
        </button>
        <button
          className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
          onClick={() => setLang('en')}
          type="button"
        >
          EN
        </button>
      </div>
    </header>
  );
}
