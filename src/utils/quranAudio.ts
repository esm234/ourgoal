/**
 * Quran Audio Utilities for MP3Quran API Integration
 * يوفر روابط تلاوات القرآن الكريم من موقع MP3Quran
 */

// Surah numbers mapping
export const SURAH_NUMBERS = {
  // السور المطلوبة
  AL_BAQARAH: 2,     // البقرة
  YUSUF: 12,         // يوسف
  IBRAHIM: 14,       // إبراهيم
  AL_HIJR: 15,       // الحجر
  AL_KAHF: 18,       // الكهف
  MARYAM: 19,        // مريم
  TAHA: 20,          // طه
  ASH_SHUARA: 26,    // الشعراء
  AS_SAFFAT: 37,     // الصافات
} as const;

// Reciters information
export const RECITERS = {
  YASSER_ALDOSARI: {
    id: 'yasser_aldosari',
    name: 'ياسر الدوسري',
    arabicName: 'ياسر الدوسري',
    serverPath: 'Yasser_Aldosari'
  },
  MUHAMMAD_AYYUB: {
    id: 'muhammad_ayyub',
    name: 'محمد أيوب',
    arabicName: 'محمد أيوب',
    serverPath: 'Muhammad_Ayyub'
  },
  MINSHAWI_MURATTAL: {
    id: 'minshawi_murattal',
    name: 'المنشاوي (مرتل)',
    arabicName: 'محمد صديق المنشاوي',
    serverPath: 'Minshawi_Murattal'
  },
  ABDULRAHMAN_ALSUDAIS: {
    id: 'abdulrahman_alsudais',
    name: 'عبد الرحمن السديس',
    arabicName: 'عبد الرحمن السديس',
    serverPath: 'Abdulrahman_Alsudais'
  },
  MAHER_ALMUAIQLY: {
    id: 'maher_almuaiqly',
    name: 'ماهر المعيقلي',
    arabicName: 'ماهر المعيقلي',
    serverPath: 'Maher_Almuaiqly'
  }
} as const;

// Audio source interface
export interface QuranAudioSource {
  id: string;
  name: string;
  surahName: string;
  surahNumber: number;
  reciter: string;
  url: string;
  type: 'quran';
  category: string;
}

/**
 * Generate MP3Quran URL for a specific reciter and surah
 */
export const generateQuranUrl = (reciterPath: string, surahNumber: number): string => {
  // Format surah number with leading zeros (001, 002, etc.)
  const formattedSurahNumber = String(surahNumber).padStart(3, '0');

  // MP3Quran URL pattern
  return `https://download.ourquraan.com/${reciterPath}/${formattedSurahNumber}.mp3`;
};

/**
 * Alternative URL generators for different servers
 */
export const generateAlternativeUrls = (reciterPath: string, surahNumber: number) => {
  const formattedSurahNumber = String(surahNumber).padStart(3, '0');

  return [
    `https://download.ourquraan.com/${reciterPath}/${formattedSurahNumber}.mp3`,
    `https://server8.mp3quran.net/${reciterPath}/${formattedSurahNumber}.mp3`,
    `https://server10.mp3quran.net/${reciterPath}/${formattedSurahNumber}.mp3`,
    `https://server11.mp3quran.net/${reciterPath}/${formattedSurahNumber}.mp3`,
    `https://server12.mp3quran.net/${reciterPath}/${formattedSurahNumber}.mp3`
  ];
};

/**
 * Get Surah name in Arabic
 */
export const getSurahName = (surahNumber: number): string => {
  const surahNames: { [key: number]: string } = {
    2: 'البقرة',
    12: 'يوسف',
    14: 'إبراهيم',
    15: 'الحجر',
    18: 'الكهف',
    19: 'مريم',
    20: 'طه',
    26: 'الشعراء',
    37: 'الصافات'
  };

  return surahNames[surahNumber] || `سورة ${surahNumber}`;
};

/**
 * Generate selected Quran audio sources from YouTube conversions
 */
export const generateQuranAudioSources = (): QuranAudioSource[] => {
  const sources: QuranAudioSource[] = [];

  // طه - محمد أيوب (من YouTube)
  sources.push({
    id: 'quran-taha-ayyub',
    name: 'سورة طه - محمد أيوب',
    surahName: 'طه',
    surahNumber: SURAH_NUMBERS.TAHA,
    reciter: RECITERS.MUHAMMAD_AYYUB.name,
    url: '/audio/quran/taha-ayyub.mp3',
    type: 'quran',
    category: 'ayyub'
  });

  // إبراهيم - المنشاوي (مرتل) (من YouTube)
  sources.push({
    id: 'quran-ibrahim-minshawi',
    name: 'سورة إبراهيم - المنشاوي (مرتل)',
    surahName: 'إبراهيم',
    surahNumber: SURAH_NUMBERS.IBRAHIM,
    reciter: RECITERS.MINSHAWI_MURATTAL.name,
    url: '/audio/quran/ibrahim-minshawi.mp3',
    type: 'quran',
    category: 'minshawi'
  });

  // الحجر - المنشاوي (مرتل) (من YouTube)
  sources.push({
    id: 'quran-hijr-minshawi',
    name: 'سورة الحجر - المنشاوي (مرتل)',
    surahName: 'الحجر',
    surahNumber: SURAH_NUMBERS.AL_HIJR,
    reciter: RECITERS.MINSHAWI_MURATTAL.name,
    url: '/audio/quran/hijr-minshawi.mp3',
    type: 'quran',
    category: 'minshawi'
  });

  return sources;
};

/**
 * Test audio URL availability
 */
export const testAudioUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error testing audio URL:', error);
    return false;
  }
};

/**
 * Get working URL from alternatives
 */
export const getWorkingUrl = async (reciterPath: string, surahNumber: number): Promise<string | null> => {
  const urls = generateAlternativeUrls(reciterPath, surahNumber);

  for (const url of urls) {
    const isWorking = await testAudioUrl(url);
    if (isWorking) {
      return url;
    }
  }

  return null;
};

/**
 * Fallback URLs for problematic recitations
 */
export const getFallbackQuranSources = (): QuranAudioSource[] => {
  return [
    // Alternative working URLs
    {
      id: 'quran-kahf-alternative',
      name: 'سورة الكهف - ياسر الدوسري (بديل)',
      surahName: 'الكهف',
      surahNumber: 18,
      reciter: 'ياسر الدوسري',
      url: 'https://server8.mp3quran.net/yasser/018.mp3',
      type: 'quran',
      category: 'aldosari'
    },
    {
      id: 'quran-baqarah-alternative',
      name: 'سورة البقرة - ياسر الدوسري (بديل)',
      surahName: 'البقرة',
      surahNumber: 2,
      reciter: 'ياسر الدوسري',
      url: 'https://server8.mp3quran.net/yasser/002.mp3',
      type: 'quran',
      category: 'aldosari'
    },
    {
      id: 'quran-taha-alternative',
      name: 'سورة طه - ياسر الدوسري (بديل)',
      surahName: 'طه',
      surahNumber: 20,
      reciter: 'ياسر الدوسري',
      url: 'https://server8.mp3quran.net/yasser/020.mp3',
      type: 'quran',
      category: 'aldosari'
    },
    {
      id: 'quran-ibrahim-alternative',
      name: 'سورة إبراهيم - ياسر الدوسري (بديل)',
      surahName: 'إبراهيم',
      surahNumber: 14,
      reciter: 'ياسر الدوسري',
      url: 'https://server8.mp3quran.net/yasser/014.mp3',
      type: 'quran',
      category: 'aldosari'
    },
    {
      id: 'quran-hijr-alternative',
      name: 'سورة الحجر - ياسر الدوسري (بديل)',
      surahName: 'الحجر',
      surahNumber: 15,
      reciter: 'ياسر الدوسري',
      url: 'https://server8.mp3quran.net/yasser/015.mp3',
      type: 'quran',
      category: 'aldosari'
    }
  ];
};
