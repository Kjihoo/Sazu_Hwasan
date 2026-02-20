import { useLang } from '../../context/LangContext';
import styles from './Header.module.css';

type Page = 'saju' | 'hanja';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { lang, setLang } = useLang();

  return (
    <header className={styles.header}>
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
      <h1 className={styles.title}>사주화산</h1>
      <p className={styles.subtitle}>
        {lang === 'ko' ? '나의 사주를 쉽게 알아보세요' : 'Explore Your Four Pillars of Destiny'}
      </p>
      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${currentPage === 'saju' ? styles.navActive : ''}`}
          onClick={() => onNavigate('saju')}
          type="button"
        >
          {lang === 'ko' ? '사주팔자 풀이' : 'BaZi Reading'}
        </button>
        <button
          className={`${styles.navBtn} ${currentPage === 'hanja' ? styles.navActive : ''}`}
          onClick={() => onNavigate('hanja')}
          type="button"
        >
          {lang === 'ko' ? '한자 주석 도우미' : 'Hanja Annotator'}
        </button>
      </nav>
    </header>
  );
}
