/**
 * Simple dialog for adding custom Quran recitations
 */

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, BookOpen, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Reciter {
  reciter_id: string;
  reciter_name: string;
  audio_urls: Surah[];
}

interface Surah {
  surah_id: string;
  surah_name_ar: string;
  audio_url: string;
}

interface CustomRecitation {
  id: string;
  name: string;
  url: string;
  type: 'quran';
  surahName: string;
  surahNumber: number;
  reciter: string;
  category: string;
}

interface AddRecitationDialogProps {
  onRecitationAdded: (recitation: CustomRecitation) => void;
  onClearAllRecitations?: () => void;
  hasCustomRecitations?: boolean;
}

export const AddRecitationDialog: React.FC<AddRecitationDialogProps> = ({
  onRecitationAdded,
  onClearAllRecitations,
  hasCustomRecitations = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<string>('');
  const [selectedSurah, setSelectedSurah] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecitersData();
  }, []);

  const loadRecitersData = async () => {
    try {
      setLoading(true);
      // Use predefined reciters with popular surahs
      const predefinedReciters = getPredefinedReciters();
      setReciters(predefinedReciters);
    } catch (error) {
      console.error('Error loading reciters data:', error);
      toast.error('فشل في تحميل بيانات القراء');
    } finally {
      setLoading(false);
    }
  };

  const getPredefinedReciters = (): Reciter[] => {
    // Popular surahs with their names
    const popularSurahs: Surah[] = [
      { surah_id: "1", surah_name_ar: "سورة الفاتحة", audio_url: "" },
  { surah_id: "2", surah_name_ar: "سورة البقرة", audio_url: "" },
  { surah_id: "3", surah_name_ar: "سورة آل عمران", audio_url: "" },
  { surah_id: "4", surah_name_ar: "سورة النساء", audio_url: "" },
  { surah_id: "5", surah_name_ar: "سورة المائدة", audio_url: "" },
  { surah_id: "6", surah_name_ar: "سورة الأنعام", audio_url: "" },
  { surah_id: "7", surah_name_ar: "سورة الأعراف", audio_url: "" },
  { surah_id: "8", surah_name_ar: "سورة الأنفال", audio_url: "" },
  { surah_id: "9", surah_name_ar: "سورة التوبة", audio_url: "" },
  { surah_id: "10", surah_name_ar: "سورة يونس", audio_url: "" },
  { surah_id: "11", surah_name_ar: "سورة هود", audio_url: "" },
  { surah_id: "12", surah_name_ar: "سورة يوسف", audio_url: "" },
  { surah_id: "13", surah_name_ar: "سورة الرعد", audio_url: "" },
  { surah_id: "14", surah_name_ar: "سورة إبراهيم", audio_url: "" },
  { surah_id: "15", surah_name_ar: "سورة الحجر", audio_url: "" },
  { surah_id: "16", surah_name_ar: "سورة النحل", audio_url: "" },
  { surah_id: "17", surah_name_ar: "سورة الإسراء", audio_url: "" },
  { surah_id: "18", surah_name_ar: "سورة الكهف", audio_url: "" },
  { surah_id: "19", surah_name_ar: "سورة مريم", audio_url: "" },
  { surah_id: "20", surah_name_ar: "سورة طه", audio_url: "" },
  { surah_id: "21", surah_name_ar: "سورة الأنبياء", audio_url: "" },
  { surah_id: "22", surah_name_ar: "سورة الحج", audio_url: "" },
  { surah_id: "23", surah_name_ar: "سورة المؤمنون", audio_url: "" },
  { surah_id: "24", surah_name_ar: "سورة النور", audio_url: "" },
  { surah_id: "25", surah_name_ar: "سورة الفرقان", audio_url: "" },
  { surah_id: "26", surah_name_ar: "سورة الشعراء", audio_url: "" },
  { surah_id: "27", surah_name_ar: "سورة النمل", audio_url: "" },
  { surah_id: "28", surah_name_ar: "سورة القصص", audio_url: "" },
  { surah_id: "29", surah_name_ar: "سورة العنكبوت", audio_url: "" },
  { surah_id: "30", surah_name_ar: "سورة الروم", audio_url: "" },
  { surah_id: "31", surah_name_ar: "سورة لقمان", audio_url: "" },
  { surah_id: "32", surah_name_ar: "سورة السجدة", audio_url: "" },
  { surah_id: "33", surah_name_ar: "سورة الأحزاب", audio_url: "" },
  { surah_id: "34", surah_name_ar: "سورة سبأ", audio_url: "" },
  { surah_id: "35", surah_name_ar: "سورة فاطر", audio_url: "" },
  { surah_id: "36", surah_name_ar: "سورة يس", audio_url: "" },
  { surah_id: "37", surah_name_ar: "سورة الصافات", audio_url: "" },
  { surah_id: "38", surah_name_ar: "سورة ص", audio_url: "" },
  { surah_id: "39", surah_name_ar: "سورة الزمر", audio_url: "" },
  { surah_id: "40", surah_name_ar: "سورة غافر", audio_url: "" },
  { surah_id: "41", surah_name_ar: "سورة فصلت", audio_url: "" },
  { surah_id: "42", surah_name_ar: "سورة الشورى", audio_url: "" },
  { surah_id: "43", surah_name_ar: "سورة الزخرف", audio_url: "" },
  { surah_id: "44", surah_name_ar: "سورة الدخان", audio_url: "" },
  { surah_id: "45", surah_name_ar: "سورة الجاثية", audio_url: "" },
  { surah_id: "46", surah_name_ar: "سورة الأحقاف", audio_url: "" },
  { surah_id: "47", surah_name_ar: "سورة محمد", audio_url: "" },
  { surah_id: "48", surah_name_ar: "سورة الفتح", audio_url: "" },
  { surah_id: "49", surah_name_ar: "سورة الحجرات", audio_url: "" },
  { surah_id: "50", surah_name_ar: "سورة ق", audio_url: "" },
  { surah_id: "51", surah_name_ar: "سورة الذاريات", audio_url: "" },
  { surah_id: "52", surah_name_ar: "سورة الطور", audio_url: "" },
  { surah_id: "53", surah_name_ar: "سورة النجم", audio_url: "" },
  { surah_id: "54", surah_name_ar: "سورة القمر", audio_url: "" },
  { surah_id: "55", surah_name_ar: "سورة الرحمن", audio_url: "" },
  { surah_id: "56", surah_name_ar: "سورة الواقعة", audio_url: "" },
  { surah_id: "57", surah_name_ar: "سورة الحديد", audio_url: "" },
  { surah_id: "58", surah_name_ar: "سورة المجادلة", audio_url: "" },
  { surah_id: "59", surah_name_ar: "سورة الحشر", audio_url: "" },
  { surah_id: "60", surah_name_ar: "سورة الممتحنة", audio_url: "" },
  { surah_id: "61", surah_name_ar: "سورة الصف", audio_url: "" },
  { surah_id: "62", surah_name_ar: "سورة الجمعة", audio_url: "" },
  { surah_id: "63", surah_name_ar: "سورة المنافقون", audio_url: "" },
  { surah_id: "64", surah_name_ar: "سورة التغابن", audio_url: "" },
  { surah_id: "65", surah_name_ar: "سورة الطلاق", audio_url: "" },
  { surah_id: "66", surah_name_ar: "سورة التحريم", audio_url: "" },
  { surah_id: "67", surah_name_ar: "سورة الملك", audio_url: "" },
  { surah_id: "68", surah_name_ar: "سورة القلم", audio_url: "" },
  { surah_id: "69", surah_name_ar: "سورة الحاقة", audio_url: "" },
  { surah_id: "70", surah_name_ar: "سورة المعارج", audio_url: "" },
  { surah_id: "71", surah_name_ar: "سورة نوح", audio_url: "" },
  { surah_id: "72", surah_name_ar: "سورة الجن", audio_url: "" },
  { surah_id: "73", surah_name_ar: "سورة المزمل", audio_url: "" },
  { surah_id: "74", surah_name_ar: "سورة المدثر", audio_url: "" },
  { surah_id: "75", surah_name_ar: "سورة القيامة", audio_url: "" },
  { surah_id: "76", surah_name_ar: "سورة الإنسان", audio_url: "" },
  { surah_id: "77", surah_name_ar: "سورة المرسلات", audio_url: "" },
  { surah_id: "78", surah_name_ar: "سورة النبأ", audio_url: "" },
  { surah_id: "79", surah_name_ar: "سورة النازعات", audio_url: "" },
  { surah_id: "80", surah_name_ar: "سورة عبس", audio_url: "" },
  { surah_id: "81", surah_name_ar: "سورة التكوير", audio_url: "" },
  { surah_id: "82", surah_name_ar: "سورة الإنفطار", audio_url: "" },
  { surah_id: "83", surah_name_ar: "سورة المطففين", audio_url: "" },
  { surah_id: "84", surah_name_ar: "سورة الإنشقاق", audio_url: "" },
  { surah_id: "85", surah_name_ar: "سورة البروج", audio_url: "" },
  { surah_id: "86", surah_name_ar: "سورة الطارق", audio_url: "" },
  { surah_id: "87", surah_name_ar: "سورة الأعلى", audio_url: "" },
  { surah_id: "88", surah_name_ar: "سورة الغاشية", audio_url: "" },
  { surah_id: "89", surah_name_ar: "سورة الفجر", audio_url: "" },
  { surah_id: "90", surah_name_ar: "سورة البلد", audio_url: "" },
  { surah_id: "91", surah_name_ar: "سورة الشمس", audio_url: "" },
  { surah_id: "92", surah_name_ar: "سورة الليل", audio_url: "" },
  { surah_id: "93", surah_name_ar: "سورة الضحى", audio_url: "" },
  { surah_id: "94", surah_name_ar: "سورة الشرح", audio_url: "" },
  { surah_id: "95", surah_name_ar: "سورة التين", audio_url: "" },
  { surah_id: "96", surah_name_ar: "سورة العلق", audio_url: "" },
  { surah_id: "97", surah_name_ar: "سورة القدر", audio_url: "" },
  { surah_id: "98", surah_name_ar: "سورة البينة", audio_url: "" },
  { surah_id: "99", surah_name_ar: "سورة الزلزلة", audio_url: "" },
  { surah_id: "100", surah_name_ar: "سورة العاديات", audio_url: "" },
  { surah_id: "101", surah_name_ar: "سورة القارعة", audio_url: "" },
  { surah_id: "102", surah_name_ar: "سورة التكاثر", audio_url: "" },
  { surah_id: "103", surah_name_ar: "سورة العصر", audio_url: "" },
  { surah_id: "104", surah_name_ar: "سورة الهمزة", audio_url: "" },
  { surah_id: "105", surah_name_ar: "سورة الفيل", audio_url: "" },
  { surah_id: "106", surah_name_ar: "سورة قريش", audio_url: "" },
  { surah_id: "107", surah_name_ar: "سورة الماعون", audio_url: "" },
  { surah_id: "108", surah_name_ar: "سورة الكوثر", audio_url: "" },
  { surah_id: "109", surah_name_ar: "سورة الكافرون", audio_url: "" },
  { surah_id: "110", surah_name_ar: "سورة النصر", audio_url: "" },
  { surah_id: "111", surah_name_ar: "سورة المسد", audio_url: "" },
  { surah_id: "112", surah_name_ar: "سورة الإخلاص", audio_url: "" },
  { surah_id: "113", surah_name_ar: "سورة الفلق", audio_url: "" },
  { surah_id: "114", surah_name_ar: "سورة الناس", audio_url: "" }
    ];

    // Generate audio URLs for each reciter and surah using alquran.vip
    const generateAudioUrls = (reciterId: string, reciterName: string): Surah[] => {
      // Map reciter IDs to alquran.vip reciter names
      const reciterMap: { [key: string]: string } = {
        "52": "Abdulbasit-Abdulsamad",
        "54": "Abdulrahman-Alsudaes",
        "112": "Mohammed-Siddiq-Al-Minshawi",
        "120": "Mahmoud-Khalil-Al-Hussary",
        "123": "Mishary-Alafasi",
        "31": "Saud-Al-Shuraim",
        "92": "Yasser-Al-Dosari",
        "102": "Maher-Al-Meaqli",
        "121": "Mahmoud-Ali--Albanna",
        "76": "Ali-Jaber",
        "254": "Bader-Alturki",
        "109": "Mohammed-Ayyub",
        "104" : "Mohammed-Al-Lohaidan"
      };

      const reciterSlug = reciterMap[reciterId] || "Yasser-Al-Dosari";

      return popularSurahs.map(surah => ({
        ...surah,
        audio_url: `https://alquran.vip/scripts/playSurah?reciter=${reciterSlug}&id=${surah.surah_id}`
      }));
    };

    return [
      {
        reciter_id: "52",
        reciter_name: "عبدالباسط عبدالصمد",
        audio_urls: generateAudioUrls("52", "عبدالباسط عبدالصمد")
      },
      {
        reciter_id: "54",
        reciter_name: "عبدالرحمن السديس",
        audio_urls: generateAudioUrls("54", "عبدالرحمن السديس")
      },
      {
        reciter_id: "112",
        reciter_name: "محمد صديق المنشاوي",
        audio_urls: generateAudioUrls("112", "محمد صديق المنشاوي")
      },
      {
        reciter_id: "120",
        reciter_name: "محمود خليل الحصري",
        audio_urls: generateAudioUrls("120", "محمود خليل الحصري")
      },
      {
        reciter_id: "123",
        reciter_name: "مشاري العفاسي",
        audio_urls: generateAudioUrls("123", "مشاري العفاسي")
      },
      {
        reciter_id: "31",
        reciter_name: "سعود الشريم",
        audio_urls: generateAudioUrls("31", "سعود الشريم")
      },
      {
        reciter_id: "92",
        reciter_name: "ياسر الدوسري",
        audio_urls: generateAudioUrls("92", "ياسر الدوسري")
      },
      {
        reciter_id: "102",
        reciter_name: "ماهر المعيقلي",
        audio_urls: generateAudioUrls("102", "ماهر المعيقلي")
      },
      {
        reciter_id: "109",
        reciter_name: "محمد أيوب",
        audio_urls: generateAudioUrls("109", "محمد أيوب")
      },
      {
        reciter_id: "121",
        reciter_name: "محمود علي البنا",
        audio_urls: generateAudioUrls("121", "محمود علي البنا")
      },
      {
        reciter_id: "76",
        reciter_name: "علي جابر",
        audio_urls: generateAudioUrls("76", "علي جابر")
      },
      {
        reciter_id: "254",
        reciter_name: "بدر التركي",
        audio_urls: generateAudioUrls("254", "بدر التركي")
      },
      {
        reciter_id: "104",
        reciter_name: "محمد اللحيدان",
        audio_urls: generateAudioUrls("104", "محمد اللحيدان")
      }
    ];
  };

  const handleAddRecitation = () => {
    if (!selectedReciter || !selectedSurah) {
      toast.error('يرجى اختيار القارئ والسورة');
      return;
    }

    const reciter = reciters.find(r => r.reciter_id === selectedReciter);
    const surah = reciter?.audio_urls.find(s => s.surah_id === selectedSurah);

    if (!reciter || !surah) {
      toast.error('خطأ في البيانات المختارة');
      return;
    }

    const customRecitation: CustomRecitation = {
      id: `custom-${Date.now()}`,
      name: `${surah.surah_name_ar} - ${reciter.reciter_name}`,
      url: surah.audio_url,
      type: 'quran',
      surahName: surah.surah_name_ar,
      surahNumber: parseInt(surah.surah_id) || 1,
      reciter: reciter.reciter_name,
      category: 'custom'
    };

    onRecitationAdded(customRecitation);
    toast.success(`تم إضافة: ${customRecitation.name}`);
    
    // Reset form
    setSelectedReciter('');
    setSelectedSurah('');
    setIsOpen(false);
  };

  const selectedReciterData = reciters.find(r => r.reciter_id === selectedReciter);

  const handleClearAllRecitations = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع التلاوات المخصصة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      if (onClearAllRecitations) {
        onClearAllRecitations();
        toast.success('تم حذف جميع التلاوات المخصصة');
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة تلاوة
          </Button>
        </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            إضافة تلاوة مخصصة
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">جاري تحميل بيانات القراء...</p>
            </div>
          ) : (
            <>
              {/* Reciter Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  اختر القارئ
                </Label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قارئ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reciters.map((reciter) => (
                      <SelectItem key={reciter.reciter_id} value={reciter.reciter_id}>
                        {reciter.reciter_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surah Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  اختر السورة
                </Label>
                <Select 
                  value={selectedSurah} 
                  onValueChange={setSelectedSurah}
                  disabled={!selectedReciter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedReciter ? "اختر سورة..." : "اختر القارئ أولاً"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedReciterData?.audio_urls.map((surah) => (
                      <SelectItem key={surah.surah_id} value={surah.surah_id}>
                        {surah.surah_name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {selectedReciter && selectedSurah && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm font-medium">معاينة:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReciterData?.audio_urls.find(s => s.surah_id === selectedSurah)?.surah_name_ar} - {selectedReciterData?.reciter_name}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={handleAddRecitation}
                  disabled={!selectedReciter || !selectedSurah}
                >
                  إضافة التلاوة
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Clear All Button */}
    {hasCustomRecitations && onClearAllRecitations && (
      <Button
        size="sm"
        variant="destructive"
        className="gap-2"
        onClick={handleClearAllRecitations}
      >
        <Trash2 className="w-4 h-4" />
        حذف الكل
      </Button>
    )}
  </div>
  );
};
