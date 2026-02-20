import { HANJA_DICT, type HanjaEntry } from '../data/hanja';

export type Segment =
  | { type: 'text'; content: string }
  | { type: 'hanja'; char: string; entry: HanjaEntry }
  | { type: 'hanja-unknown'; char: string };

function isCJK(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||  // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4dbf) ||  // CJK Extension A
    (code >= 0xf900 && code <= 0xfaff)     // CJK Compatibility Ideographs
  );
}

export function annotate(text: string): Segment[] {
  const segments: Segment[] = [];
  let buffer = '';

  for (const char of text) {
    if (isCJK(char)) {
      if (buffer) {
        segments.push({ type: 'text', content: buffer });
        buffer = '';
      }
      const entry = HANJA_DICT[char];
      if (entry) {
        segments.push({ type: 'hanja', char, entry });
      } else {
        segments.push({ type: 'hanja-unknown', char });
      }
    } else {
      buffer += char;
    }
  }

  if (buffer) {
    segments.push({ type: 'text', content: buffer });
  }

  return segments;
}

export function toPlainText(segments: Segment[]): string {
  return segments
    .map(seg => {
      if (seg.type === 'text') return seg.content;
      if (seg.type === 'hanja') return `${seg.char}(${seg.entry.meaning} ${seg.entry.reading})`;
      return seg.char;
    })
    .join('');
}
