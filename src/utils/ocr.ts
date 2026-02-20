import { createWorker } from 'tesseract.js';
import { HANJA_DICT } from '../data/hanja';

// CDN paths to avoid Vite/GitHub Pages worker path issues
const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0';
const CORE_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0';

// 사주 한자 + 한글 전체 + 기본 문자만 인식하도록 화이트리스트 생성
function buildWhitelist(): string {
  const sajuHanja = Object.keys(HANJA_DICT).join('');
  // 한글 음절 전체: U+AC00 ~ U+D7A3
  const hangul = Array.from(
    { length: 0xD7A4 - 0xAC00 },
    (_, i) => String.fromCharCode(0xAC00 + i),
  ).join('');
  const basic = ' \t\n0123456789.,·()[]「」『』〈〉《》';
  return sajuHanja + hangul + basic;
}

export type OcrStatus =
  | 'idle'
  | 'loading'      // 언어 데이터 다운로드 중
  | 'recognizing'  // 텍스트 인식 중
  | 'done'
  | 'error';

export interface OcrProgress {
  status: OcrStatus;
  progress: number;   // 0-100
  message: string;
}

export async function recognizeText(
  image: File,
  onProgress: (p: OcrProgress) => void,
): Promise<string> {
  onProgress({ status: 'loading', progress: 0, message: '언어 데이터 불러오는 중...' });

  const worker = await createWorker(['kor', 'chi_tra'], 1, {
    workerPath: `${TESSERACT_CDN}/dist/worker.min.js`,
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    corePath: CORE_CDN,
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'loading tesseract core' || m.status === 'loading language traineddata') {
        onProgress({
          status: 'loading',
          progress: Math.round(m.progress * 50),
          message: '언어 데이터 불러오는 중... (최초 1회만 다운로드)',
        });
      } else if (m.status === 'recognizing text') {
        onProgress({
          status: 'recognizing',
          progress: 50 + Math.round(m.progress * 50),
          message: '한자 인식 중...',
        });
      }
    },
  });

  try {
    await worker.setParameters({
      tessedit_char_whitelist: buildWhitelist(),
    });
    const result = await worker.recognize(image);
    onProgress({ status: 'done', progress: 100, message: '완료' });
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}
