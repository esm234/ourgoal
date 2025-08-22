/**
 * MP3Quran API Integration
 * يوفر تكامل مع API موقع MP3Quran لتشغيل السور القرآنية
 */

// Base API URL
const API_BASE_URL = 'https://mp3quran.net/api/v3';

// Surah information interface
export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  numberOfAyahs: number;
}

// Reciter information interface
export interface Reciter {
  id: number;
  name: string;
  arabicName: string;
  server: string;
  count: number;
  letter: string;
  rewaya: string;
}

// Audio source interface for MP3Quran
export interface MP3QuranAudioSource {
  id: string;
  name: string;
  surahName: string;
  surahNumber: number;
  reciter: string;
  reciterId: number;
  url: string;
  type: 'quran';
  category: string;
}

/**
 * Get list of all available surahs
 */
export const getSurahs = async (language: string = 'ar'): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suwar?language=${language}`);
    const data = await response.json();
    return data.suwar || [];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
};

/**
 * Get list of all available reciters
 */
export const getReciters = async (language: string = 'ar'): Promise<Reciter[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reciters?language=${language}`);
    const data = await response.json();
    return data.reciters || [];
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return [];
  }
};

/**
 * Generate audio URL for a specific reciter and surah
 */
export const generateAudioUrl = (reciter: Reciter, surahNumber: number): string => {
  // Format surah number with leading zeros (001, 002, etc.)
  const formattedSurahNumber = String(surahNumber).padStart(3, '0');
  
  // Use the server URL from the reciter data
  return `${reciter.server}${formattedSurahNumber}.mp3`;
};

/**
 * Get popular reciters (predefined list)
 */
export const getPopularReciters = (): Partial<Reciter>[] => {
  return [
    {
      id: 1,
      name: 'عبد الباسط عبد الصمد',
      arabicName: 'عبد الباسط عبد الصمد',
      server: 'https://server8.mp3quran.net/bna_amer/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 2,
      name: 'محمد صديق المنشاوي',
      arabicName: 'محمد صديق المنشاوي',
      server: 'https://server8.mp3quran.net/minsh/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 3,
      name: 'عبد الرحمن السديس',
      arabicName: 'عبد الرحمن السديس',
      server: 'https://server11.mp3quran.net/sds/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 4,
      name: 'ماهر المعيقلي',
      arabicName: 'ماهر المعيقلي',
      server: 'https://server12.mp3quran.net/maher/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 5,
      name: 'ياسر الدوسري',
      arabicName: 'ياسر الدوسري',
      server: 'https://server8.mp3quran.net/yasser/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 6,
      name: 'محمد أيوب',
      arabicName: 'محمد أيوب',
      server: 'https://server10.mp3quran.net/ayyub/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 7,
      name: 'سعد الغامدي',
      arabicName: 'سعد الغامدي',
      server: 'https://server7.mp3quran.net/s_gmd/',
      rewaya: 'حفص عن عاصم'
    },
    {
      id: 8,
      name: 'أحمد العجمي',
      arabicName: 'أحمد العجمي',
      server: 'https://server10.mp3quran.net/ajm/',
      rewaya: 'حفص عن عاصم'
    }
  ];
};

/**
 * Get popular surahs (predefined list)
 */
export const getPopularSurahs = (): Surah[] => {
  return [
    {
      id: 1,
      name: 'الفاتحة',
      arabicName: 'الفاتحة',
      englishName: 'Al-Fatiha',
      numberOfAyahs: 7
    },
    {
      id: 2,
      name: 'البقرة',
      arabicName: 'البقرة',
      englishName: 'Al-Baqarah',
      numberOfAyahs: 286
    },
    {
      id: 18,
      name: 'الكهف',
      arabicName: 'الكهف',
      englishName: 'Al-Kahf',
      numberOfAyahs: 110
    },
    {
      id: 36,
      name: 'يس',
      arabicName: 'يس',
      englishName: 'Ya-Sin',
      numberOfAyahs: 83
    },
    {
      id: 55,
      name: 'الرحمن',
      arabicName: 'الرحمن',
      englishName: 'Ar-Rahman',
      numberOfAyahs: 78
    },
    {
      id: 67,
      name: 'الملك',
      arabicName: 'الملك',
      englishName: 'Al-Mulk',
      numberOfAyahs: 30
    },
    {
      id: 78,
      name: 'النبأ',
      arabicName: 'النبأ',
      englishName: 'An-Naba',
      numberOfAyahs: 40
    },
    {
      id: 112,
      name: 'الإخلاص',
      arabicName: 'الإخلاص',
      englishName: 'Al-Ikhlas',
      numberOfAyahs: 4
    }
  ];
};

/**
 * Test if audio URL is accessible
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
 * Generate MP3Quran audio sources for Pomodoro timer
 */
export const generateMP3QuranAudioSources = async (): Promise<MP3QuranAudioSource[]> => {
  const sources: MP3QuranAudioSource[] = [];
  const popularReciters = getPopularReciters();
  const popularSurahs = getPopularSurahs();

  // Generate combinations of popular reciters and surahs
  for (const reciter of popularReciters.slice(0, 3)) { // Limit to first 3 reciters
    for (const surah of popularSurahs.slice(0, 4)) { // Limit to first 4 surahs
      if (reciter.server && reciter.id && reciter.name) {
        const audioUrl = generateAudioUrl(reciter as Reciter, surah.id);
        
        sources.push({
          id: `mp3quran-${reciter.id}-${surah.id}`,
          name: `${surah.arabicName} - ${reciter.arabicName}`,
          surahName: surah.arabicName,
          surahNumber: surah.id,
          reciter: reciter.arabicName,
          reciterId: reciter.id,
          url: audioUrl,
          type: 'quran',
          category: `reciter-${reciter.id}`
        });
      }
    }
  }

  return sources;
};

/**
 * Create custom audio source from user selection
 */
export const createCustomAudioSource = (
  reciter: Reciter,
  surah: Surah
): MP3QuranAudioSource => {
  const audioUrl = generateAudioUrl(reciter, surah.id);
  
  return {
    id: `custom-${reciter.id}-${surah.id}`,
    name: `${surah.arabicName} - ${reciter.arabicName}`,
    surahName: surah.arabicName,
    surahNumber: surah.id,
    reciter: reciter.arabicName,
    reciterId: reciter.id,
    url: audioUrl,
    type: 'quran',
    category: `reciter-${reciter.id}`
  };
};

