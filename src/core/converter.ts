// Vowel romanization → [standalone unicode, vowel modifier diacritic]
const VOWEL_MAP: [string, string, string][] = [
  ['oo',    'ඌ', 'ූ'],
  ['o\\)',  'ඕ', 'ෝ'],
  ['oe',    'ඕ', 'ෝ'],
  ['aa',    'ආ', 'ා'],
  ['a\\)',  'ආ', 'ා'],
  ['Aa',    'ඈ', 'ෑ'],
  ['A\\)',  'ඈ', 'ෑ'],
  ['ae',    'ඈ', 'ෑ'],
  ['ii',    'ඊ', 'ී'],
  ['i\\)',  'ඊ', 'ී'],
  ['ie',    'ඊ', 'ී'],
  ['ee',    'ඊ', 'ී'],
  ['ea',    'ඒ', 'ේ'],
  ['e\\)',  'ඒ', 'ේ'],
  ['ei',    'ඒ', 'ේ'],
  ['uu',    'ඌ', 'ූ'],
  ['u\\)',  'ඌ', 'ූ'],
  ['au',    'ඖ', 'ෞ'],
  ['/\\a',  'ඇ', 'ැ'],
  ['a',     'අ', ''],
  ['A',     'ඇ', 'ැ'],
  ['i',     'ඉ', 'ි'],
  ['e',     'එ', 'ෙ'],
  ['u',     'උ', 'ු'],
  ['o',     'ඔ', 'ො'],
  ['I',     'ඓ', 'ෛ'],
];

// Consonant romanization → unicode
const CONSONANT_MAP: [string, string][] = [
  ['nndh', 'ඳ'],
  ['nnd',  'ඬ'],
  ['nng',  'ඟ'],
  ['Th',   'ථ'],
  ['Dh',   'ධ'],
  ['gh',   'ඝ'],
  ['Ch',   'ඡ'],
  ['ph',   'ඵ'],
  ['bh',   'භ'],
  ['sh',   'ශ'],
  ['Sh',   'ෂ'],
  ['GN',   'ඥ'],
  ['KN',   'ඤ'],
  ['Lu',   'ළු'],
  ['dh',   'ද'],
  ['ch',   'ච'],
  ['kh',   'ඛ'],
  ['th',   'ත'],
  ['t',    'ට'],
  ['k',    'ක'],
  ['d',    'ඩ'],
  ['n',    'න'],
  ['p',    'ප'],
  ['b',    'බ'],
  ['m',    'ම'],
  ['\\y',  '‍ය'],
  ['Y',    '‍ය'],
  ['y',    'ය'],
  ['j',    'ජ'],
  ['l',    'ල'],
  ['v',    'ව'],
  ['w',    'ව'],
  ['s',    'ස'],
  ['h',    'හ'],
  ['N',    'ණ'],
  ['L',    'ළ'],
  ['K',    'ඛ'],
  ['G',    'ඝ'],
  ['T',    'ඨ'],
  ['D',    'ඪ'],
  ['P',    'ඵ'],
  ['B',    'ඹ'],
  ['f',    'ෆ'],
  ['q',    'ඣ'],
  ['g',    'ග'],
  ['r',    'ර'],  // last — skipped for rakaransha patterns
];

const SPECIAL_CONSONANTS: [RegExp, string][] = [
  [/\\n/g, 'ං'],
  [/\\h/g, 'ඃ'],
  [/\\N/g, 'ඞ'],
  [/\\R/g, 'ඍ'],
  [/R/g,   'ර්‍'],
  [/\\r/g, 'ර්‍'],
];

const SPECIAL_CHARS: [string, string][] = [
  ['ruu', 'ෲ'],
  ['ru',  'ෘ'],
];

export function convertText(input: string): string {
  let text = input;

  // 1. Special standalone consonants (\n, \h, R, etc.)
  for (const [pattern, uni] of SPECIAL_CONSONANTS) {
    text = text.replace(pattern, uni);
  }

  // 2. Consonant + special chars (ru, ruu)
  for (const [sc, scUni] of SPECIAL_CHARS) {
    for (const [cons, consUni] of CONSONANT_MAP) {
      const s = cons + sc;
      const v = consUni + scUni;
      text = text.replace(new RegExp(s, 'g'), v);
    }
  }

  // 3. Consonant + rakaransha + vowel modifier
  for (const [cons, consUni] of CONSONANT_MAP) {
    for (const [vowel, , modifier] of VOWEL_MAP) {
      const s = cons + 'r' + vowel;
      const v = consUni + '්‍ර' + modifier;
      text = text.replace(new RegExp(s, 'g'), v);
    }
    // Consonant + rakaransha alone
    const s = cons + 'r';
    const v = consUni + '්‍ර';
    text = text.replace(new RegExp(s, 'g'), v);
  }

  // 4. Consonant + vowel modifier
  for (const [cons, consUni] of CONSONANT_MAP) {
    for (const [vowel, , modifier] of VOWEL_MAP) {
      const s = cons + vowel;
      const v = consUni + modifier;
      text = text.replace(new RegExp(s, 'g'), v);
    }
  }

  // 5. Bare consonants → consonant + hal sign
  for (const [cons, consUni] of CONSONANT_MAP) {
    text = text.replace(new RegExp(cons, 'g'), consUni + '්');
  }

  // 6. Standalone vowels
  for (const [vowel, uni] of VOWEL_MAP) {
    text = text.replace(new RegExp(vowel, 'g'), uni);
  }

  return text;
}

export function getCurrentWordPhonetic(phonetic: string): string {
  const words = phonetic.split(/[\s\n]+/);
  return words[words.length - 1] ?? '';
}
