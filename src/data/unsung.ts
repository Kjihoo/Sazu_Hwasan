// 12운성 (十二運星) - Twelve Stages of Life
// 중국어 → 한국어 매핑 + 설명

export interface UnsungEntry {
  chinese: string;
  korean: string;
  hanja: string;
  meaning: string;
  description: string;
  meaningEn: string;
  descriptionEn: string;
}

export const UNSUNG_DATA: Record<string, UnsungEntry> = {
  '长生': {
    chinese: '长生',
    korean: '장생',
    hanja: '長生',
    meaning: '장생(長生)은 생명이 태어나는 단계입니다. 새로운 시작과 성장의 기운을 상징합니다.',
    description: '활력이 넘치고 새로운 일을 시작하기에 좋은 기운입니다. 귀인의 도움이 있고 발전 가능성이 큽니다.',
    meaningEn: 'Birth (長生) is the stage of new life beginning. It symbolizes fresh starts and the energy of growth.',
    descriptionEn: 'Full of vitality and ideal for starting new endeavors. Blessed with helpful mentors and great potential for development.',
  },
  '沐浴': {
    chinese: '沐浴',
    korean: '목욕',
    hanja: '沐浴',
    meaning: '목욕(沐浴)은 갓 태어난 아이를 씻기는 단계입니다. 변화와 불안정, 다재다능함을 상징합니다.',
    description: '감성이 풍부하고 예술적이지만, 변덕스럽고 이성 문제가 생기기 쉬운 기운입니다. 도화(桃花)의 기운이 있습니다.',
    meaningEn: 'Bath (沐浴) is the stage of washing the newborn. It symbolizes change, instability, and versatility.',
    descriptionEn: 'Emotionally rich and artistic, but prone to moodiness and romantic entanglements. Carries the energy of charm and attraction.',
  },
  '冠带': {
    chinese: '冠带',
    korean: '관대',
    hanja: '冠帶',
    meaning: '관대(冠帶)는 성인이 되어 관을 쓰고 띠를 두르는 단계입니다. 성장과 자립을 상징합니다.',
    description: '자존심이 강하고 체면을 중시합니다. 사회에 나아가 이름을 알리기 시작하는 기운으로, 학업이나 취업에 유리합니다.',
    meaningEn: 'Adornment (冠帶) is the stage of donning the crown and sash of adulthood. It symbolizes growth and independence.',
    descriptionEn: 'Strong pride and emphasis on appearances. The energy of entering society and building a name — favorable for studies and career.',
  },
  '临官': {
    chinese: '临官',
    korean: '건록',
    hanja: '建祿',
    meaning: '건록(建祿)은 관직에 나아가는 단계입니다. 사회적 활동과 성공을 상징합니다.',
    description: '능력이 인정받고 사회적으로 안정되는 기운입니다. 자립심이 강하고 책임감이 있으며, 직업운이 좋습니다.',
    meaningEn: 'Prosperity (建祿) is the stage of entering official service. It symbolizes social activity and success.',
    descriptionEn: 'Your abilities are recognized and social standing stabilizes. Strong self-reliance and responsibility — excellent career fortune.',
  },
  '帝旺': {
    chinese: '帝旺',
    korean: '제왕',
    hanja: '帝旺',
    meaning: '제왕(帝旺)은 왕의 자리에 오르는 단계입니다. 최고의 전성기를 상징합니다.',
    description: '기운이 가장 강한 시기로 리더십과 카리스마가 넘칩니다. 다만 너무 강하면 오히려 고집과 독선이 될 수 있습니다.',
    meaningEn: 'Peak (帝旺) is the stage of ascending the throne. It symbolizes the highest point of vitality and achievement.',
    descriptionEn: 'The most powerful stage — overflowing with leadership and charisma. However, excessive strength can manifest as stubbornness or arrogance.',
  },
  '衰': {
    chinese: '衰',
    korean: '쇠',
    hanja: '衰',
    meaning: '쇠(衰)는 전성기를 지나 서서히 내려오는 단계입니다. 안정과 원숙함을 상징합니다.',
    description: '경험이 풍부하고 원숙한 기운입니다. 급격한 변화보다 안정을 추구하며, 지혜로운 판단을 할 수 있습니다.',
    meaningEn: 'Decline (衰) is the stage after the peak, gradually descending. It symbolizes stability and maturity.',
    descriptionEn: 'Rich in experience and seasoned wisdom. Prefers stability over sudden change, capable of judicious judgment.',
  },
  '病': {
    chinese: '病',
    korean: '병',
    hanja: '病',
    meaning: '병(病)은 기운이 약해지는 단계입니다. 실제 질병이 아닌 기운의 약화를 상징합니다.',
    description: '섬세하고 감수성이 풍부하지만 체력이나 의지가 약할 수 있습니다. 학문이나 예술 방면에 소질이 있습니다.',
    meaningEn: 'Sickness (病) is the stage of weakening energy. Not literal illness — it symbolizes a waning of vitality.',
    descriptionEn: 'Delicate and emotionally sensitive, but may lack physical stamina or willpower. Talented in academic or artistic pursuits.',
  },
  '死': {
    chinese: '死',
    korean: '사',
    hanja: '死',
    meaning: '사(死)는 기운이 멈추는 단계입니다. 실제 죽음이 아니라 기운의 정지와 전환점을 상징합니다.',
    description: '결단력이 있고 한 가지에 집중하는 힘이 있습니다. 고집이 세지만 뚝심 있게 일을 완수하는 기운입니다.',
    meaningEn: 'Death (死) is the stage of energy stopping. Not literal death — it symbolizes a pause and turning point.',
    descriptionEn: 'Decisive and focused, able to concentrate on one thing deeply. Stubborn but tenacious in completing tasks.',
  },
  '墓': {
    chinese: '墓',
    korean: '묘',
    hanja: '墓',
    meaning: '묘(墓)는 무덤에 들어가는 단계입니다. 저장과 보관, 내면의 축적을 상징합니다.',
    description: '재물을 모으는 능력이 있고 내실이 있습니다. 겉으로 드러내지 않지만 속에 많은 것을 가지고 있는 기운입니다.',
    meaningEn: 'Tomb (墓) is the stage of entering the grave. It symbolizes storage, preservation, and internal accumulation.',
    descriptionEn: 'Skilled at accumulating wealth and inner substance. Understated outwardly but rich within — holds much in reserve.',
  },
  '绝': {
    chinese: '绝',
    korean: '절',
    hanja: '絶',
    meaning: '절(絶)은 기운이 완전히 끊어지는 단계입니다. 끝이자 새로운 시작의 준비를 상징합니다.',
    description: '직감이 뛰어나고 영적인 감각이 있습니다. 기존의 것과 단절하고 새로운 것을 추구하는 기운입니다.',
    meaningEn: 'Void (絶) is the stage of energy completely severing. It symbolizes an ending and the preparation for a new beginning.',
    descriptionEn: 'Highly intuitive and spiritually perceptive. Energy of breaking from the old and seeking something entirely new.',
  },
  '胎': {
    chinese: '胎',
    korean: '태',
    hanja: '胎',
    meaning: '태(胎)는 새 생명이 잉태되는 단계입니다. 새로운 가능성과 잠재력을 상징합니다.',
    description: '창의적이고 상상력이 풍부합니다. 아직 드러나지 않은 잠재력이 있으며, 계획을 세우기에 좋은 기운입니다.',
    meaningEn: 'Conception (胎) is the stage of new life being conceived. It symbolizes new possibilities and untapped potential.',
    descriptionEn: 'Creative and imaginative, with hidden potential yet to emerge. An excellent energy for planning and visioning.',
  },
  '养': {
    chinese: '养',
    korean: '양',
    hanja: '養',
    meaning: '양(養)은 태아가 어머니 뱃속에서 자라는 단계입니다. 보살핌과 양육을 상징합니다.',
    description: '순수하고 의존적인 면이 있지만, 다른 사람의 도움을 잘 받는 기운입니다. 양육과 보호의 에너지가 있습니다.',
    meaningEn: 'Nurturing (養) is the stage of the fetus growing in the womb. It symbolizes care and being nurtured.',
    descriptionEn: 'Pure and somewhat dependent, but skilled at receiving help from others. Carries the energy of nurturing and protection.',
  },
};

// 12운성이란? 전체 설명
export const UNSUNG_GENERAL_DESC = `12운성(十二運星)은 일간(나)의 기운이 각 지지(地支)에서 얼마나 강한지를 12단계로 나타낸 것입니다.

사람의 일생처럼 태어나고(장생), 자라고(목욕→관대→건록), 전성기를 맞이하고(제왕), 쇠퇴하고(쇠→병→사), 저장되고(묘), 끝나고(절), 다시 시작하는(태→양) 순환을 보여줍니다.

12운성이 강하면(장생·건록·제왕 등) 해당 기둥의 기운이 왕성하고, 약하면(병·사·절 등) 기운이 미약합니다.`;

export const UNSUNG_GENERAL_DESC_EN = `The Twelve Life Stages (十二運星) show how strong your Day Stem's energy is in each Earthly Branch — rated across 12 phases.

Like a human life cycle: birth (長生), growth (沐浴→冠帶→建祿), peak (帝旺), decline (衰→病→死), storage (墓), ending (絶), and new beginning (胎→養).

Strong stages (長生, 建祿, 帝旺) indicate vibrant energy in that pillar; weak stages (病, 死, 絶) indicate subdued energy.`;
