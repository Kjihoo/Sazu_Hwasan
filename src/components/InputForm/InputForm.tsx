import { useState } from 'react';
import type { BirthInput } from '../../types/saju';
import { SIJI_DATA } from '../../data/siji';
import styles from './InputForm.module.css';

interface InputFormProps {
  onSubmit: (input: BirthInput) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [sijiIndex, setSijiIndex] = useState(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unknownTime, setUnknownTime] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const siji = SIJI_DATA[sijiIndex];
    onSubmit({
      year,
      month,
      day,
      hour: unknownTime ? 12 : siji.representativeHour,
      minute: 0,
      gender,
      unknownTime,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <label className={styles.label}>생년월일</label>
        <div className={styles.dateRow}>
          <select
            className={styles.select}
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select
            className={styles.select}
            value={month}
            onChange={e => {
              setMonth(Number(e.target.value));
              setDay(prev => Math.min(prev, getDaysInMonth(year, Number(e.target.value))));
            }}
          >
            {months.map(m => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
          <select
            className={styles.select}
            value={day}
            onChange={e => setDay(Number(e.target.value))}
          >
            {days.map(d => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>태어난 시간</label>
        <select
          className={`${styles.select} ${styles.timeSelect}`}
          value={sijiIndex}
          onChange={e => setSijiIndex(Number(e.target.value))}
          disabled={unknownTime}
        >
          {SIJI_DATA.map((siji, i) => (
            <option key={siji.branch} value={i}>{siji.label}</option>
          ))}
        </select>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={unknownTime}
            onChange={e => setUnknownTime(e.target.checked)}
          />
          태어난 시간을 모릅니다
        </label>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>성별</label>
        <div className={styles.genderRow}>
          <label className={`${styles.genderOption} ${gender === 'male' ? styles.genderActive : ''}`}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            남
          </label>
          <label className={`${styles.genderOption} ${gender === 'female' ? styles.genderActive : ''}`}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            여
          </label>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        사주 보기
      </button>
    </form>
  );
}
