/**
 * @license
 * Fusha-Speak Live Coach - Core Linguistic & Phonetics Engine
 * Pure local rule-based Arabic diacritizer and pronunciation analyzer.
 */

export const HARAKAT = {
  FATHA: '\u064E',
  DAMMA: '\u064F',
  KASRA: '\u0650',
  SUKUN: '\u0652',
  SHADDAH: '\u0651',
  FATHATAN: '\u064B',
  DAMMATAN: '\u064C',
  KASRATAN: '\u064D',
  WASLA: '\u0671'
};

export const SUN_LETTERS = new Set(['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن']);
export const MOON_LETTERS = new Set(['ء', 'ا', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'ه', 'و', 'ي']);

export const CORE_LEXICON: Record<string, string> = {
  'السلام': 'السَّلَامُ',
  'عليكم': 'عَلَيْكُمْ',
  'ورحمة': 'وَرَحْمَةُ',
  'الله': 'اللهِ',
  'وبركاته': 'وَبَرَكَاتُهُ',
  'صباح': 'صَبَاحُ',
  'الخير': 'الْخَيْرِ',
  'النور': 'النُّورِ',
  'مساء': 'مَسَاءُ',
  'مرحبا': 'مَرْحَبًا',
  'اهلا': 'أَهْلًا',
  'وسهلا': 'وَسَهْلًا',
  'بك': 'بِكَ',
  'بكم': 'بِكُمْ',
  'كيف': 'كَيْفَ',
  'حالك': 'حَالُكَ',
  'الحمد': 'الْحَمْدُ',
  'لله': 'لِلَّهِ',
  'بخير': 'بِخَيْرٍ',
  'شكرا': 'شُكْرًا',
  'جزيلا': 'جَزِيلًا',
  'عفوا': 'عَفْوًا',
  'من': 'مِنْ',
  'فضلك': 'فَضْلِكَ',
  'لو': 'لَوْ',
  'سمحت': 'سَمَحْتَ',
  'الى': 'إِلَى',
  'اللقاء': 'اللِّقَاءِ',
  'مع': 'مَعَ',
  'السلامة': 'السَّلَامَةِ',
  'في': 'فِي',
  'امان': 'أَمَانِ',
  'نعم': 'نَعَمْ',
  'لا': 'لَا',
  'ان': 'إِنَّ',
  'هذا': 'هَٰذَا',
  'هذه': 'هَٰذِهِ',
  'ذلك': 'ذَٰلِكَ',
  'تلك': 'تِلْكَ',
  'الذي': 'الَّذِي',
  'التي': 'الَّتِي',
  'كتاب': 'كِتَابٌ',
  'الكتاب': 'الْكِتَابُ',
  'طالب': 'طَالِبٌ',
  'الطالب': 'الطَّالِبُ',
  'استاذ': 'أُسْتَاذٌ',
  'الاستاذ': 'الْأُسْتَاذُ',
  'جامعة': 'جَامِعَةٌ',
  'الجامعة': 'الْجَامِعَةُ',
  'العلم': 'الْعِلْمُ',
  'علم': 'عِلْمٌ',
  'نافع': 'نَافِعٌ',
  'القران': 'الْقُرْآنُ',
  'الكريم': 'الْكَرِيمُ',
  'الحديث': 'الْحَدِيثُ',
  'الشريف': 'الشَّرِيفُ',
  'لغة': 'لُغَةٌ',
  'العربية': 'الْعَرَبِيَّةُ',
  'الفصحى': 'الْفُصْحَى',
  'مطار': 'مَطَارُ',
  'المطار': 'الْمَطَارُ',
  'طائرة': 'طَائِرَةٌ',
  'فندق': 'فُنْدُقٌ',
  'الفندق': 'الْفُنْدُقُ',
  'غرفة': 'غُرْفَةٌ',
  'طبيب': 'طَبِيبٌ',
  'مستشفى': 'مُسْتَشْفَى',
  'دواء': 'دَوَاءٌ',
  'شفاء': 'شِفَاءٌ',
  'سوق': 'سُوقٌ',
  'السوق': 'السُّوقُ',
  'ثمن': 'ثَمَنٌ',
  'دينار': 'دِينَارٌ',
  'ريال': 'رِيَالٌ',
  'قراءة': 'قِرَاءَةٌ',
  'كتابة': 'كِتَابَةٌ',
  'نطق': 'نُطْقٌ',
  'فصيح': 'فَصِيحٌ',
  'صحيح': 'صَحِيحٌ',
  'قال': 'قَالَ',
  'يقول': 'يَقُولُ',
  'ذهب': 'ذَهَبَ',
  'يذهب': 'يَذْهَبُ',
  'قرا': 'قَرَأَ',
  'يقرا': 'يَقْرَأُ',
  'كتب': 'كَتَبَ',
  'يكتب': 'يَكْتُبُ',
  'تكلم': 'تَكَلَّمَ',
  'يتكلم': 'يَتَكَلَّمُ',
  'تعلم': 'تَعَلَّمَ',
  'يتعلم': 'يَتَعَلَّمُ',
  'فهم': 'فَهِمَ',
  'يفهم': 'يَفْهَمُ',
  'بارك': 'بَارَكَ',
  'فيك': 'فِيكَ',
  'جزاك': 'جَزَاكَ',
  'خيرا': 'خَيْرًا',
  'ما': 'مَا',
  'اسمك': 'اسْمُكَ',
  'اسمي': 'اسْمِي',
  'اين': 'أَيْنَ',
  'متى': 'مَتَى',
  'كم': 'كَمْ',
  'لماذا': 'لِمَاذَا',
  'اريد': 'أُرِيدُ',
  'اتعلم': 'أَتَعَلَّمَ',
  'اتحدث': 'أَتَحَدَّثَ'
};

export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u0652\u0670\u06DF-\u06E8]/g, '');
}

export function normalizeArabic(text: string): string {
  if (!text) return '';
  return stripTashkeel(text)
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

export function diacritize(text: string): string {
  if (!text) return '';
  const tokens = text.split(/([،.؟!:\s]+)/);

  return tokens.map((token) => {
    if (/^[،.؟!:\s]+$/.test(token) || !token) {
      return token;
    }

    const cleanWord = stripTashkeel(token);
    const normalized = cleanWord.replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

    if (CORE_LEXICON[cleanWord]) return CORE_LEXICON[cleanWord];
    if (CORE_LEXICON[normalized]) return CORE_LEXICON[normalized];

    if (cleanWord.startsWith('ال') && cleanWord.length > 2) {
      const nextChar = cleanWord[2];
      const restWord = cleanWord.substring(2);
      if (SUN_LETTERS.has(nextChar)) {
        const diacritizedRest = diacritizeWord(restWord);
        return 'ا' + 'ل' + nextChar + HARAKAT.SHADDAH + (diacritizedRest.length > 1 ? diacritizedRest.substring(1) : HARAKAT.FATHA);
      } else {
        return 'ا' + 'ل' + HARAKAT.SUKUN + diacritizeWord(restWord);
      }
    }

    if ((cleanWord.startsWith('و') || cleanWord.startsWith('ف')) && cleanWord.length > 3) {
      const prefix = cleanWord[0];
      const innerWord = cleanWord.substring(1);
      if (CORE_LEXICON[innerWord]) {
        return prefix + HARAKAT.FATHA + CORE_LEXICON[innerWord];
      }
    }

    if (cleanWord.startsWith('ب') && cleanWord.length > 3) {
      const innerWord = cleanWord.substring(1);
      if (CORE_LEXICON[innerWord]) {
        return 'ب' + HARAKAT.KASRA + CORE_LEXICON[innerWord];
      }
    }

    return diacritizeWord(cleanWord);
  }).join('');
}

function diacritizeWord(word: string): string {
  if (!word) return '';
  let result = '';

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    result += char;

    if (char === 'ا' || char === 'و' || char === 'ي') continue;

    const isLast = (i === word.length - 1);
    const nextChar = word[i + 1];

    if (isLast) {
      result += HARAKAT.DAMMA;
    } else if (nextChar === 'ا') {
      result += HARAKAT.FATHA;
    } else if (nextChar === 'ي') {
      result += HARAKAT.KASRA;
    } else if (nextChar === 'و') {
      result += HARAKAT.DAMMA;
    } else if (i === 0) {
      result += HARAKAT.FATHA;
    } else if (i === 1 && word.length >= 3) {
      result += HARAKAT.SUKUN;
    } else {
      result += HARAKAT.FATHA;
    }
  }

  return result;
}

export interface MakharijTip {
  code: string;
  pair: [string, string];
  title: string;
  message: string;
}

export const MAKHARIJ_CONFUSIONS: MakharijTip[] = [
  {
    pair: ['ع', 'ء'],
    code: 'AIN_HAMZA',
    title: 'ع (ئەين) ۋە ء (ھەمزە) مەخرەج پەرقى',
    message: 'ع تاۋۇشى ئوتتۇرا ھەلق (كېكىردەك ئوتتۇرىسى) دىن چىقىدۇ. ء (ھەمزە) دەك تۈز ئوقۇۋالماڭ، بوغۇزنى قىسىپ چىقىرىڭ.'
  },
  {
    pair: ['ح', 'ه'],
    code: 'HAA_HA',
    title: 'ح (تاتلىق ھا) ۋە ه (كۆكرەك ھە) پەرقى',
    message: 'ح تاۋۇشى كېكىردەك ئوتتۇرىسىدىن ئىنچىكە، قىزىق نەپەس بىلەن چىقىدۇ؛ ه دەك كۆكرەك تېگىدىن بوش قويۇۋەتمەڭ.'
  },
  {
    pair: ['ص', 'س'],
    code: 'SAAD_SEEN',
    title: 'ص (ساد) ۋە س (سىن) يوغانلىق پەرقى',
    message: 'ص ھەرپىدە ئىستىئلا (تىل يىلتىزىنى يۇقىرى كۆتۈرۈش) بار، تولۇق ۋە توم سۆزلەڭ، نېپىز «س» قىلىپ قويماڭ.'
  },
  {
    pair: ['ض', 'د'],
    code: 'DAAD_DAAL',
    title: 'ض (داد) ۋە د (دال) مۆجىزە تاۋۇش پەرقى',
    message: 'ض ئەرەب تىلىنىڭ ئۆزگىچە تاۋۇشى بولۇپ، تىلنىڭ يان گىرۋىكى بىلەن ئۈستۈنكى ئازىيى چىشلار بېسىلىپ چىقىدۇ؛ ئاددىي «د» ئەمەس.'
  },
  {
    pair: ['ط', 'ت'],
    code: 'TAA_TE',
    title: 'ط ۋە ت بېسىم پەرقى',
    message: 'ط ھەرپى ئېغىز بوشلۇقىنى تولدۇرۇپ توم چىقىدۇ؛ ت تاۋۇشىدەك نېپىز پىچىرلاپ چىقمايدۇ.'
  },
  {
    pair: ['ظ', 'ذ'],
    code: 'ZHAA_DHAAL',
    title: 'ظ ۋە ذ تىل ئۇچى پەرقى',
    message: 'ظ نى تەلەپپۇز قىلغاندا تىل ئۇچىنى چىش گىرۋىكىگە تەگكۈزۈپ، كۈچلۈك ۋە توم قىلىپ ئېيتىش لازىم.'
  },
  {
    pair: ['ق', 'ك'],
    code: 'QAAF_KAAF',
    title: 'ق (قاف) ۋە ك (كاف) يىلتىز پەرقى',
    message: 'ق تاۋۇشى تىلنىڭ ئەڭ يىلتىزى بىلەن كىچىك تىل ئۇچى سوقۇلۇپ، يۇقىرىقى تاڭلايدىن توم چىقىدۇ.'
  },
  {
    pair: ['غ', 'خ'],
    code: 'GHAYN_KHAA',
    title: 'غ ۋە خ پەرقى',
    message: 'غ تاۋۇشى كېكىردەكنىڭ ئەڭ ئۈستىدىن سۇنىڭ غۇر-غۇر ئېقىشىدەك چىقىدۇ؛ خ تاۋۇشى بىلەن ئالماشتۇرۇۋالماڭ.'
  }
];

export interface EvaluationResult {
  score: number;
  status: 'passed' | 'needs_practice' | 'empty';
  feedback: string;
  detailedWords: Array<{
    target: string;
    spoken: string;
    score: number;
    status: 'correct' | 'near' | 'mismatch';
    label: string;
  }>;
  makharijTips: MakharijTip[];
}

export function evaluatePronunciation(targetSentence: string, spokenSentence: string): EvaluationResult {
  const normTarget = normalizeArabic(targetSentence);
  const normSpoken = normalizeArabic(spokenSentence);

  if (!normSpoken) {
    return {
      score: 0,
      status: 'empty',
      feedback: 'ئاۋازىڭىز تېخى ئاڭلانمىدى ياكى مىكروفون قوزغالمىدى. قايتا سىناڭ.',
      detailedWords: [],
      makharijTips: []
    };
  }

  const targetWords = normTarget.split(/\s+/).filter(Boolean);
  const spokenWords = normSpoken.split(/\s+/).filter(Boolean);

  const detailedWords: EvaluationResult['detailedWords'] = [];
  let matchCount = 0;
  const detectedIssues: MakharijTip[] = [];

  for (let i = 0; i < targetWords.length; i++) {
    const tWord = targetWords[i];
    const sWord = spokenWords[i] || '';

    if (tWord === sWord) {
      matchCount++;
      detailedWords.push({
        target: tWord,
        spoken: sWord,
        score: 100,
        status: 'correct',
        label: 'تولۇق توغرا'
      });
    } else if (sWord && (tWord.includes(sWord) || sWord.includes(tWord) || levenshteinDistance(tWord, sWord) <= 1)) {
      matchCount += 0.8;
      detailedWords.push({
        target: tWord,
        spoken: sWord,
        score: 80,
        status: 'near',
        label: 'يېقىن (كەمتۈك بار)'
      });
      checkMakharijMismatch(tWord, sWord, detectedIssues);
    } else {
      detailedWords.push({
        target: tWord,
        spoken: sWord || '(ئاڭلانمىدى)',
        score: 0,
        status: 'mismatch',
        label: 'خاتا ياكى كەم'
      });
      if (sWord) {
        checkMakharijMismatch(tWord, sWord, detectedIssues);
      }
    }
  }

  const totalWords = Math.max(targetWords.length, 1);
  const rawScore = Math.round((matchCount / totalWords) * 100);
  const score = Math.min(100, Math.max(0, rawScore));

  let overallFeedback = '';
  if (score >= 90) {
    overallFeedback = 'ئەلا! نۇتقىڭىز راۋان، فۇسھا ئۆلچىمىگە تولۇق ئۇيغۇن چىقتى.';
  } else if (score >= 70) {
    overallFeedback = 'ياخشى! بەزى ھەرپ ۋە ھەرىكەتلەرگە يەنىمۇ دىققەت قىلسىڭىز تېخىمۇ مۇكەممەل بولىدۇ.';
  } else if (score >= 50) {
    overallFeedback = 'ئوتتۇراھال. مەخرەج ئورۇنلىرىنى ئايرىم سىناپ، تەۋسىيە ئاۋازنى تەكرار ئاڭلاڭ.';
  } else {
    overallFeedback = 'قايتا مەشىق قىلىڭ. نىشان جۈملىنى ئاستا ئاڭلاپ، مەخرەجلەرنى بىر-بىرلەپ كۈچەيتىڭ.';
  }

  const uniqueTips: MakharijTip[] = [];
  const seenCodes = new Set<string>();
  for (const tip of detectedIssues) {
    if (!seenCodes.has(tip.code)) {
      seenCodes.add(tip.code);
      uniqueTips.push(tip);
    }
  }

  return {
    score,
    status: score >= 80 ? 'passed' : 'needs_practice',
    feedback: overallFeedback,
    detailedWords,
    makharijTips: uniqueTips
  };
}

function checkMakharijMismatch(target: string, spoken: string, issuesList: MakharijTip[]) {
  for (const conf of MAKHARIJ_CONFUSIONS) {
    const [charA, charB] = conf.pair;
    if (
      (target.includes(charA) && spoken.includes(charB)) ||
      (target.includes(charB) && spoken.includes(charA))
    ) {
      issuesList.push(conf);
    }
  }
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
