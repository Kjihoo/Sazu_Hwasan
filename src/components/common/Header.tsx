import styles from './Header.module.css';

type Page = 'saju' | 'hanja';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>사주화산</h1>
      <p className={styles.subtitle}>나의 사주를 쉽게 알아보세요</p>
      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${currentPage === 'saju' ? styles.navActive : ''}`}
          onClick={() => onNavigate('saju')}
        >
          사주팔자 풀이
        </button>
        <button
          className={`${styles.navBtn} ${currentPage === 'hanja' ? styles.navActive : ''}`}
          onClick={() => onNavigate('hanja')}
        >
          한자 주석 도우미
        </button>
      </nav>
    </header>
  );
}
