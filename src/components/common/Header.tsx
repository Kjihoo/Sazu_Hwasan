import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>사주팔자 풀이</h1>
      <p className={styles.subtitle}>나의 사주를 쉽게 알아보세요</p>
    </header>
  );
}
