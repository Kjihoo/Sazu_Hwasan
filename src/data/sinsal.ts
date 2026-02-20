// 신살 (神煞) - Spirit Stars
// 일간 또는 지지 기준 조건표

export interface SinsalEntry {
  name: string;
  hanja: string;
  meaning: string;
  description: string;
  meaningEn: string;
  descriptionEn: string;
  isGood: boolean;
}

// 신살 설명 사전
export const SINSAL_DATA: Record<string, SinsalEntry> = {
  '역마살': {
    name: '역마살',
    hanja: '驛馬殺',
    isGood: false,
    meaning: '역마살(驛馬殺)은 이동과 변동의 기운입니다. 한 곳에 머무르지 못하고 돌아다니는 성향을 나타냅니다.',
    description: '여행, 이사, 전근, 해외 진출 등 이동이 많습니다. 현대에는 영업직, 무역, 여행업, 외교관 등에 유리한 기운으로 봅니다. 반드시 나쁜 것은 아닙니다.',
    meaningEn: 'Travel Star (驛馬殺) is the energy of movement and change. It indicates a restless nature unable to stay in one place.',
    descriptionEn: 'Frequent travel, relocation, transfers, or overseas ventures. In modern times, favorable for sales, trade, tourism, or diplomacy. Not necessarily negative.',
  },
  '도화살': {
    name: '도화살',
    hanja: '桃花殺',
    isGood: false,
    meaning: '도화살(桃花殺)은 매력과 이성운의 기운입니다. 복숭아꽃처럼 사람을 끄는 매력을 상징합니다.',
    description: '외모가 매력적이거나 이성에게 인기가 많습니다. 예술·연예 분야에 재능이 있으며, 사교성이 좋습니다. 다만 이성 문제로 구설이 생길 수 있습니다.',
    meaningEn: 'Peach Blossom Star (桃花殺) is the energy of charm and romantic attraction — like a peach blossom drawing people in.',
    descriptionEn: 'Physically attractive or popular with the opposite sex. Talented in arts and entertainment, highly sociable. However, may attract romantic complications or gossip.',
  },
  '화개살': {
    name: '화개살',
    hanja: '華蓋殺',
    isGood: true,
    meaning: '화개살(華蓋殺)은 학문과 종교, 예술의 기운입니다. 화려한 덮개라는 뜻으로, 고귀한 재능을 상징합니다.',
    description: '총명하고 학문적 소질이 뛰어납니다. 종교, 철학, 예술, 기술 분야에 깊이가 있습니다. 고독을 즐기며 정신세계가 풍부합니다.',
    meaningEn: 'Canopy Star (華蓋殺) is the energy of learning, religion, and the arts — a glorious canopy symbolizing noble talent.',
    descriptionEn: 'Intelligent with exceptional academic aptitude. Deep in religion, philosophy, arts, or technical fields. Enjoys solitude and has a rich inner life.',
  },
  '귀문관살': {
    name: '귀문관살',
    hanja: '鬼門關殺',
    isGood: false,
    meaning: '귀문관살(鬼門關殺)은 영적 감수성과 정신적 고민의 기운입니다.',
    description: '직감과 영감이 뛰어나지만 정신적 스트레스를 받기 쉽습니다. 종교인, 상담사, 심리학자에게 유리한 기운입니다.',
    meaningEn: 'Ghost Gate Star (鬼門關殺) is the energy of spiritual sensitivity and mental struggle.',
    descriptionEn: 'Highly intuitive and inspired, but susceptible to mental stress. Favorable energy for religious figures, counselors, and psychologists.',
  },
  '천을귀인': {
    name: '천을귀인',
    hanja: '天乙貴人',
    isGood: true,
    meaning: '천을귀인(天乙貴人)은 가장 대표적인 귀인(도움을 주는 존재)입니다.',
    description: '어려울 때 귀인의 도움을 받습니다. 위기를 잘 넘기고 사회적으로 인정받는 기운입니다. 사주에 천을귀인이 있으면 큰 흉이 와도 해소됩니다.',
    meaningEn: 'Heavenly Noble (天乙貴人) is the most prominent benefactor star in BaZi.',
    descriptionEn: 'Receives help from noble benefactors in times of difficulty. Skilled at overcoming crises and earning social recognition. Greatly reduces the impact of misfortune.',
  },
  '천덕귀인': {
    name: '천덕귀인',
    hanja: '天德貴人',
    isGood: true,
    meaning: '천덕귀인(天德貴人)은 하늘의 덕을 받는 기운입니다.',
    description: '성품이 어질고 덕이 있어 주변 사람들의 존경을 받습니다. 재난을 피하고 복을 받는 기운입니다.',
    meaningEn: 'Heavenly Virtue Noble (天德貴人) is the energy of receiving heaven\'s grace and virtue.',
    descriptionEn: 'Kind and virtuous, earning the respect of those around you. Blessed with the energy to avoid disasters and receive fortune.',
  },
  '월덕귀인': {
    name: '월덕귀인',
    hanja: '月德貴人',
    isGood: true,
    meaning: '월덕귀인(月德貴人)은 달의 덕을 받는 기운입니다.',
    description: '천덕귀인과 비슷하게 재난을 피하고 복을 받습니다. 인덕이 있어 사람들에게 도움을 잘 받습니다.',
    meaningEn: 'Monthly Virtue Noble (月德貴人) is the energy of receiving the moon\'s grace and virtue.',
    descriptionEn: 'Similar to Heavenly Virtue Noble — avoids disasters and receives blessings. Blessed with personal virtue and draws help from others easily.',
  },
  '문창귀인': {
    name: '문창귀인',
    hanja: '文昌貴人',
    isGood: true,
    meaning: '문창귀인(文昌貴人)은 학문과 시험의 기운입니다.',
    description: '공부를 잘하고 시험운이 좋습니다. 글재주가 있고 학문적 성취를 이루기에 유리합니다.',
    meaningEn: 'Literary Star (文昌貴人) is the energy of scholarship and examinations.',
    descriptionEn: 'Excels academically with strong exam fortune. Talented with words and well-positioned for scholarly achievement.',
  },
  '양인살': {
    name: '양인살',
    hanja: '羊刃殺',
    isGood: false,
    meaning: '양인살(羊刃殺)은 칼날처럼 날카로운 기운입니다.',
    description: '결단력과 추진력이 강하지만 성격이 급하고 다칠 수 있습니다. 군인, 의사, 요리사 등 칼을 쓰는 직업에 유리합니다.',
    meaningEn: 'Goat Blade Star (羊刃殺) is a sharp, blade-like energy.',
    descriptionEn: 'Strong decisiveness and drive, but prone to impatience and injury. Favorable for professions involving blades — military, medicine, or culinary arts.',
  },
  '겁살': {
    name: '겁살',
    hanja: '劫殺',
    isGood: false,
    meaning: '겁살(劫殺)은 강탈과 위험의 기운입니다.',
    description: '돌발적인 사건이나 사고를 의미합니다. 다만 결단력과 행동력이 뛰어나 위기 상황에서 오히려 빛을 발하기도 합니다.',
    meaningEn: 'Robbery Star (劫殺) is the energy of sudden seizure and danger.',
    descriptionEn: 'Indicates sudden events or accidents. However, exceptional decisiveness and action under pressure means this energy can shine brightest in crises.',
  },
};

// 역마살 조건표: 일지 기준
// 일지가 申子辰이면 寅이 역마, 寅午戌이면 申이 역마, 巳酉丑이면 亥가 역마, 亥卯未이면 巳가 역마
export const YEOKMA_TABLE: Record<string, string> = {
  '申': '寅', '子': '寅', '辰': '寅',
  '寅': '申', '午': '申', '戌': '申',
  '巳': '亥', '酉': '亥', '丑': '亥',
  '亥': '巳', '卯': '巳', '未': '巳',
};

// 도화살 조건표: 일지 기준
export const DOHWA_TABLE: Record<string, string> = {
  '申': '酉', '子': '酉', '辰': '酉',
  '寅': '卯', '午': '卯', '戌': '卯',
  '巳': '午', '酉': '午', '丑': '午',
  '亥': '子', '卯': '子', '未': '子',
};

// 화개살 조건표: 일지 기준
export const HWAGAE_TABLE: Record<string, string> = {
  '申': '辰', '子': '辰', '辰': '辰',
  '寅': '戌', '午': '戌', '戌': '戌',
  '巳': '丑', '酉': '丑', '丑': '丑',
  '亥': '未', '卯': '未', '未': '未',
};

// 귀문관살 조건표: 특정 지지 조합
export const GWIMUN_PAIRS: [string, string][] = [
  ['寅', '丑'], ['巳', '午'], ['戌', '亥'], ['辰', '卯'],
];

// 천을귀인 조건표: 일간 기준
export const CHEONUL_TABLE: Record<string, string[]> = {
  '甲': ['丑', '未'], '戊': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '庚': ['丑', '未'], // 丑, 寅 설도 있으나 일반적
  '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
};

// 문창귀인 조건표: 일간 기준
export const MUNCHANG_TABLE: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
  '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯',
};

// 양인살 조건표: 일간 기준
export const YANGIN_TABLE: Record<string, string> = {
  '甲': '卯', '丙': '午', '戊': '午',
  '庚': '酉', '壬': '子',
  // 음간은 양인이 없음 (일부 학파에서는 있다고 보기도 함)
};

// 겁살 조건표: 일지 기준
export const GEOBSAL_TABLE: Record<string, string> = {
  '申': '巳', '子': '巳', '辰': '巳',
  '寅': '亥', '午': '亥', '戌': '亥',
  '巳': '寅', '酉': '寅', '丑': '寅',
  '亥': '申', '卯': '申', '未': '申',
};

export const SINSAL_GENERAL_DESC = `신살(神煞)은 사주의 특정 글자 조합에서 나타나는 특별한 기운입니다.

크게 길신(吉神, 좋은 기운)과 흉살(凶煞, 나쁜 기운)로 나뉘지만, 현대 사주학에서는 흉살도 직업이나 상황에 따라 오히려 좋은 작용을 할 수 있다고 봅니다.

• 귀인(貴人): 도움을 주는 좋은 기운
• 살(殺): 강한 에너지로 잘 쓰면 약, 못 쓰면 독

주요 신살:
- 역마살: 이동·변동의 기운
- 도화살: 매력·이성운
- 화개살: 학문·예술·종교
- 천을귀인: 가장 강한 귀인
- 양인살: 날카로운 결단력`;

export const SINSAL_GENERAL_DESC_EN = `Spirit Stars (神煞) are special energies arising from specific character combinations in your chart.

They are broadly divided into auspicious stars (吉神) and inauspicious stars (凶煞), but modern BaZi holds that even negative stars can work positively depending on career and circumstance.

• Noble Stars (貴人): Helpful, positive energies
• Killing Stars (殺): Intense energies — medicine if used well, poison if not

Key Spirit Stars:
- Travel Star: Movement and change
- Peach Blossom: Charm and romance
- Canopy Star: Learning, arts, religion
- Heavenly Noble: The strongest benefactor star
- Goat Blade: Sharp decisiveness`;
