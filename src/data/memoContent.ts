import type { PillarPosition } from '../types/saju';

export const PILLAR_EXPLANATIONS: Record<PillarPosition, { title: string; meaning: string; titleEn: string; meaningEn: string }> = {
  '년주': {
    title: '년주 (年柱)',
    meaning: '년주는 태어난 해를 나타내며, 조상과 어린 시절(0~15세)의 운을 상징합니다. 사회적 환경과 외부의 영향을 보여줍니다.',
    titleEn: 'Year Pillar (年柱)',
    meaningEn: 'The Year Pillar represents the year of birth, symbolizing ancestral influence and early childhood (ages 0–15). It reflects the social environment and external influences.',
  },
  '월주': {
    title: '월주 (月柱)',
    meaning: '월주는 태어난 달을 나타내며, 부모와 청년기(15~30세)의 운을 상징합니다. 성장 환경과 사회생활을 보여줍니다.',
    titleEn: 'Month Pillar (月柱)',
    meaningEn: 'The Month Pillar represents the birth month, symbolizing parental influence and youth (ages 15–30). It reflects the growth environment and social life.',
  },
  '일주': {
    title: '일주 (日柱)',
    meaning: '일주는 태어난 날을 나타내며, 본인과 중년기(30~45세)의 운을 상징합니다. 특히 일간(日干)은 사주에서 "나 자신"을 대표하는 가장 중요한 글자입니다.',
    titleEn: 'Day Pillar (日柱)',
    meaningEn: 'The Day Pillar represents the birth date, symbolizing the self and middle age (ages 30–45). The Day Stem (日干) in particular is the most important character in BaZi — it represents "you."',
  },
  '시주': {
    title: '시주 (時柱)',
    meaning: '시주는 태어난 시간을 나타내며, 자녀와 말년(45세 이후)의 운을 상징합니다. 인생의 결과와 노후를 보여줍니다.',
    titleEn: 'Hour Pillar (時柱)',
    meaningEn: 'The Hour Pillar represents the birth hour, symbolizing children and later life (age 45+). It reflects the outcomes of life and the quality of old age.',
  },
};

export const STEM_BRANCH_LABELS = {
  cheongan: {
    title: '천간 (天干)',
    meaning: '천간은 하늘의 기운을 나타내는 10개의 글자입니다. 사주에서 드러나는 성격, 외부에 보이는 모습을 의미합니다.',
    titleEn: 'Heavenly Stem (天干)',
    meaningEn: 'The Heavenly Stems are 10 characters representing celestial energy. In BaZi, they reflect the visible personality and outer appearance.',
  },
  jiji: {
    title: '지지 (地支)',
    meaning: '지지는 땅의 기운을 나타내는 12개의 글자입니다. 사주에서 내면의 성격, 숨겨진 잠재력을 의미합니다. 12띠 동물과도 연결됩니다.',
    titleEn: 'Earthly Branch (地支)',
    meaningEn: 'The Earthly Branches are 12 characters representing terrestrial energy. In BaZi, they reflect the inner personality and hidden potential. They also correspond to the 12 zodiac animals.',
  },
};
