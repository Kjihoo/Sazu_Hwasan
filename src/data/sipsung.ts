// 십성 (十神/十星) - Ten Gods

export interface SipsungEntry {
  chinese: string;
  korean: string;
  hanja: string;
  meaning: string;
  personality: string;
  meaningEn: string;
  personalityEn: string;
  category: '비겁' | '식상' | '재성' | '관성' | '인성';
}

export const SIPSUNG_DATA: Record<string, SipsungEntry> = {
  '比肩': {
    chinese: '比肩', korean: '비견', hanja: '比肩', category: '비겁',
    meaning: '비견(比肩)은 나(일간)와 같은 오행이면서 같은 음양인 것입니다. "어깨를 나란히 한다"는 뜻으로, 나와 동등한 존재를 의미합니다.',
    personality: '독립심이 강하고 자존심이 높습니다. 경쟁심이 있으며 형제, 동료, 친구를 상징합니다. 주체적이고 고집이 있는 편입니다.',
    meaningEn: 'Companion (比肩) shares the same element and polarity as the Day Stem. Literally "side by side," it represents equals and peers.',
    personalityEn: 'Highly independent with strong self-esteem. Competitive, representing siblings, colleagues, and friends. Self-directed and sometimes stubborn.',
  },
  '劫財': {
    chinese: '劫財', korean: '겁재', hanja: '劫財', category: '비겁',
    meaning: '겁재(劫財)는 나(일간)와 같은 오행이면서 음양이 다른 것입니다. "재물을 빼앗는다"는 뜻으로, 나와 비슷하지만 경쟁하는 존재를 의미합니다.',
    personality: '추진력이 강하고 승부욕이 있습니다. 재물 욕심이 강하며 때로 충동적입니다. 위기 상황에서 결단력을 발휘합니다.',
    meaningEn: 'Rob Wealth (劫財) shares the same element but opposite polarity as the Day Stem. It represents competitors and rivals who vie for the same resources.',
    personalityEn: 'Driven and competitive with a strong desire to win. Can be impulsive and materialistic, but shows decisive leadership under pressure.',
  },
  '食神': {
    chinese: '食神', korean: '식신', hanja: '食神', category: '식상',
    meaning: '식신(食神)은 내가 생(生)하는 오행이면서 같은 음양인 것입니다. "먹는 신"이라는 뜻으로, 내가 만들어내는 것, 재주와 표현을 의미합니다.',
    personality: '낙천적이고 여유롭습니다. 먹을 복이 있고 예술적 재능이 있으며, 다재다능합니다. 인상이 좋고 사람들에게 호감을 줍니다.',
    meaningEn: 'Eating God (食神) is the element the Day Stem generates, with the same polarity. It represents talents, expression, and enjoyment of life.',
    personalityEn: 'Optimistic and easygoing, blessed with good fortune and artistic talent. Versatile and likeable, leaving a positive impression on others.',
  },
  '傷官': {
    chinese: '傷官', korean: '상관', hanja: '傷官', category: '식상',
    meaning: '상관(傷官)은 내가 생(生)하는 오행이면서 음양이 다른 것입니다. "관성을 상하게 한다"는 뜻으로, 기존 질서에 도전하는 에너지입니다.',
    personality: '창의적이고 개성이 강합니다. 뛰어난 표현력과 언변이 있지만 기존 질서에 반발하는 경향이 있습니다. 예술적 천재성을 가질 수 있습니다.',
    meaningEn: 'Hurting Officer (傷官) is the element the Day Stem generates, with opposite polarity. It challenges authority and represents creative rebellion.',
    personalityEn: 'Creative and highly individualistic with exceptional expressiveness. May resist convention and authority, but can possess artistic genius.',
  },
  '偏財': {
    chinese: '偏財', korean: '편재', hanja: '偏財', category: '재성',
    meaning: '편재(偏財)는 내가 극(剋)하는 오행이면서 같은 음양인 것입니다. 활동적으로 얻는 재물, 아버지를 상징합니다.',
    personality: '사교적이고 활발하며 투자·사업으로 돈을 버는 성향이 있습니다. 씀씀이가 크고 사람을 끄는 매력이 있습니다.',
    meaningEn: 'Indirect Wealth (偏財) is the element the Day Stem controls, with the same polarity. It represents dynamic, entrepreneurial wealth and the father figure.',
    personalityEn: 'Sociable and energetic, inclined toward investment and business. Generous with money and naturally charismatic.',
  },
  '正財': {
    chinese: '正財', korean: '정재', hanja: '正財', category: '재성',
    meaning: '정재(正財)는 내가 극(剋)하는 오행이면서 음양이 다른 것입니다. 안정적이고 성실하게 얻는 재물, 배우자(남성 기준)를 상징합니다.',
    personality: '성실하고 절약을 잘합니다. 재물을 꼼꼼하게 관리하며, 안정적인 수입을 추구합니다. 신뢰감이 있고 현실적입니다.',
    meaningEn: 'Direct Wealth (正財) is the element the Day Stem controls, with opposite polarity. It represents stable, earned income and the spouse (for men).',
    personalityEn: 'Diligent and thrifty, managing finances carefully. Seeks stable income and is seen as trustworthy and practical.',
  },
  '偏官': {
    chinese: '偏官', korean: '편관', hanja: '偏官', category: '관성',
    meaning: '편관(偏官)은 나를 극(剋)하는 오행이면서 같은 음양인 것입니다. 칠살(七殺)이라고도 하며, 강한 압박과 도전의 에너지입니다.',
    personality: '강인하고 카리스마가 있습니다. 도전을 즐기며 군인, 경찰, 검사 등 권력 직종에 어울립니다. 다만 공격적 성향이 될 수 있습니다.',
    meaningEn: 'Indirect Officer / Seven Killings (偏官) is the element that controls the Day Stem, with the same polarity. It represents intense pressure and challenge.',
    personalityEn: 'Tough, charismatic, and drawn to challenges. Well-suited for military, law enforcement, or authority roles, though prone to aggression.',
  },
  '正官': {
    chinese: '正官', korean: '정관', hanja: '正官', category: '관성',
    meaning: '정관(正官)은 나를 극(剋)하는 오행이면서 음양이 다른 것입니다. 직업, 명예, 법, 배우자(여성 기준)를 상징합니다.',
    personality: '책임감이 강하고 원칙을 중시합니다. 도덕적이고 사회적 규범을 잘 따르며, 관직이나 명예로운 직업에 어울립니다.',
    meaningEn: 'Direct Officer (正官) is the element that controls the Day Stem, with opposite polarity. It represents career, status, law, and the spouse (for women).',
    personalityEn: 'Highly responsible and principled. Ethical and rule-abiding, well-suited for public office or positions of honor.',
  },
  '偏印': {
    chinese: '偏印', korean: '편인', hanja: '偏印', category: '인성',
    meaning: '편인(偏印)은 나를 생(生)해주는 오행이면서 같은 음양인 것입니다. 효신(梟神)이라고도 하며, 특이한 학문과 기술을 상징합니다.',
    personality: '독창적이고 직관력이 뛰어납니다. 일반적이지 않은 분야에 관심이 많으며, 종교·철학·예술 쪽에 소질이 있습니다. 고독을 즐기는 편입니다.',
    meaningEn: 'Indirect Resource / Owl Seal (偏印) is the element that generates the Day Stem, with the same polarity. It represents unconventional knowledge and skills.',
    personalityEn: 'Original and highly intuitive. Drawn to unusual fields such as religion, philosophy, or the arts. Comfortable with solitude.',
  },
  '正印': {
    chinese: '正印', korean: '정인', hanja: '正印', category: '인성',
    meaning: '정인(正印)은 나를 생(生)해주는 오행이면서 음양이 다른 것입니다. 어머니, 공부, 자격증, 귀인을 상징합니다.',
    personality: '온화하고 학구적입니다. 공부를 좋아하고 자격·명예를 중시하며, 어질고 자비로운 성품을 가지고 있습니다.',
    meaningEn: 'Direct Resource (正印) is the element that generates the Day Stem, with opposite polarity. It represents the mother, education, credentials, and mentors.',
    personalityEn: 'Gentle and scholarly, with a love of learning. Values credentials and reputation, and possesses a kind, compassionate nature.',
  },
  '日主': {
    chinese: '日主', korean: '일주', hanja: '日主', category: '비겁',
    meaning: '일주(日主)는 사주에서 "나 자신"을 나타냅니다. 일간(日干)은 사주 전체의 주인공이며, 다른 모든 십성은 일간을 기준으로 정해집니다.',
    personality: '사주 전체의 주체입니다. 일간의 오행과 음양에 따라 기본적인 성격과 삶의 방식이 결정됩니다.',
    meaningEn: 'Day Master (日主) represents "the Self" in BaZi. The Day Stem is the protagonist of the entire chart; all other Ten Gods are defined relative to it.',
    personalityEn: 'The central subject of the entire chart. The Day Stem element and polarity determine the core personality and life approach.',
  },
};

// 십성이란? 전체 설명
export const SIPSUNG_GENERAL_DESC = `십성(十星)은 일간(나)과 사주의 다른 글자들 사이의 오행 관계를 10가지로 분류한 것입니다.

일간의 오행과 음양을 기준으로, 각 글자가 어떤 관계인지에 따라 이름이 정해집니다.

• 비겁(比劫): 나와 같은 오행 → 형제, 동료, 경쟁자
• 식상(食傷): 내가 생하는 오행 → 재주, 표현, 자녀
• 재성(財星): 내가 극하는 오행 → 재물, 아버지, 배우자(남)
• 관성(官星): 나를 극하는 오행 → 직업, 명예, 배우자(여)
• 인성(印星): 나를 생해주는 오행 → 학문, 어머니, 귀인

십성이 균형 있게 분포되면 안정적이고, 특정 십성이 집중되면 그 기운이 강하게 작용합니다.`;

export const SIPSUNG_GENERAL_DESC_EN = `The Ten Gods (十星) classify the elemental relationships between your Day Stem (you) and the other characters in your chart.

Each character is named based on its relationship to your Day Stem's element and polarity.

• Companions (比劫): Same element → siblings, peers, rivals
• Output (食傷): Element you generate → talents, expression, children
• Wealth (財星): Element you control → money, father, spouse (for men)
• Authority (官星): Element that controls you → career, status, spouse (for women)
• Resource (印星): Element that generates you → learning, mother, mentors

A balanced spread of Ten Gods brings stability; concentration in one type amplifies that energy.`;

export const SIPSUNG_CATEGORY_DESC: Record<'비겁' | '식상' | '재성' | '관성' | '인성', string> = {
  '비겁': '나와 같은 오행. 형제·동료·경쟁자를 상징하며, 독립심과 자존심의 기운입니다.',
  '식상': '내가 생(生)하는 오행. 재주·표현·자녀를 상징하며, 창의와 활동의 기운입니다.',
  '재성': '내가 극(剋)하는 오행. 재물·아버지를 상징하며, 현실과 물질의 기운입니다.',
  '관성': '나를 극(剋)하는 오행. 직업·명예를 상징하며, 규율과 책임의 기운입니다.',
  '인성': '나를 생(生)해주는 오행. 학문·어머니를 상징하며, 지혜와 보살핌의 기운입니다.',
};

export const SIPSUNG_CATEGORY_DESC_EN: Record<'비겁' | '식상' | '재성' | '관성' | '인성', string> = {
  '비겁': 'Same element as you. Represents siblings, peers, and rivals — energy of independence.',
  '식상': 'Element generated by you. Represents talent, expression, and children — energy of creativity.',
  '재성': 'Element controlled by you. Represents wealth and the father — energy of material reality.',
  '관성': 'Element that controls you. Represents career and status — energy of discipline and duty.',
  '인성': 'Element that generates you. Represents learning and the mother — energy of wisdom and care.',
};
