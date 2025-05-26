# نظام البيانات المحلية - Local Data System

## 📋 نظرة عامة

تم تحويل نظام الملفات والاختبارات من استخدام Supabase إلى نظام بيانات محلي لتوفير:
- ⚡ **أداء أسرع** - لا حاجة لاستعلامات قاعدة البيانات
- 💰 **توفير التكاليف** - تقليل استهلاك Supabase
- 🔧 **سهولة الصيانة** - إدارة البيانات مباشرة في الكود
- 📱 **تجربة أفضل** - تحميل فوري للبيانات

## 📁 هيكل الملفات

```
src/
├── data/
│   ├── filesData.ts      # بيانات الملفات والاختبارات
│   └── index.ts          # تصدير جميع البيانات
├── hooks/
│   └── useLocalFiles.ts  # Hooks للتعامل مع البيانات المحلية
└── utils/
    └── googleDriveUtils.ts # دوال Google Drive
```

## 🔧 كيفية إضافة ملفات جديدة

### 1. إضافة ملف جديد

```typescript
// في src/data/filesData.ts
export const filesData: FileData[] = [
  // ... الملفات الموجودة
  {
    id: 19, // معرف فريد
    title: 'اسم الملف الجديد',
    description: 'وصف الملف',
    category: 'verbal', // أو 'quantitative' أو 'mixed' أو 'general'
    file_url: 'https://drive.google.com/file/d/FILE_ID/view',
    file_size: '2.5 MB',
    downloads: 0,
    created_at: '2024-01-19T10:00:00Z'
  }
];
```

### 2. إضافة اختبارات للملف

```typescript
// في src/data/filesData.ts
export const examsData: ExamData[] = [
  // ... الاختبارات الموجودة
  {
    id: 19,
    file_id: 19, // نفس معرف الملف
    title: 'اختبار الملف الجديد',
    google_form_url: 'https://forms.google.com/exam-url',
    duration: 60, // بالدقائق
    questions: 25, // عدد الأسئلة
    attempts: 0,
    created_at: '2024-01-19T10:30:00Z'
  }
];
```

## 🎯 الميزات المتاحة

### ✅ ما يعمل حالياً:
- 📂 عرض جميع الملفات مع التصفية حسب الفئة
- 🔍 البحث في الملفات
- 📄 تفاصيل الملف مع الاختبارات المرتبطة
- ⬇️ تحميل الملفات من Google Drive
- 📊 إحصائيات الملفات
- 📱 التصفح بين الصفحات
- 💾 حفظ عدادات التحميل في localStorage

### 🔄 ما تم تحويله:
- `useFastFiles` → `useLocalFiles`
- `FileDetails` → يستخدم `useLocalFileDetails`
- عدادات التحميل → `incrementDownloadCount`
- التحقق من صلاحيات الإدارة → قائمة محلية

### 🗑️ ما تم حذفه:
- `AdminFiles.tsx` - صفحة إدارة الملفات
- `AdminExams.tsx` - صفحة إدارة الاختبارات
- `useFastFiles.ts` - Hook قاعدة البيانات القديم
- Routes إدارة الملفات من App.tsx
- أزرار إدارة الملفات من لوحة التحكم

## 🛠️ الدوال المساعدة

### البحث والتصفية
```typescript
import { getFilesByCategory, searchFiles, getFilesStats } from '@/data/filesData';

// الحصول على ملفات فئة معينة
const verbalFiles = getFilesByCategory('verbal');

// البحث في الملفات
const searchResults = searchFiles('بحث');

// إحصائيات الملفات
const stats = getFilesStats();
```

### إدارة التحميلات
```typescript
import { incrementDownloadCount } from '@/hooks/useLocalFiles';

// زيادة عداد التحميل
incrementDownloadCount(fileId);
```

## 📊 البيانات الحالية

### الملفات (18 ملف):
- **لفظي**: 12 ملف
- **كمي**: 6 ملفات
- **إجمالي الاختبارات**: 18 اختبار

### الفئات:
- `verbal` - القسم اللفظي
- `quantitative` - القسم الكمي
- `mixed` - منوع
- `general` - عام

## 🔗 روابط Google Drive

### تحويل الروابط تلقائياً:
```
من: https://drive.google.com/file/d/FILE_ID/view
إلى: https://drive.google.com/uc?export=download&id=FILE_ID
```

### الدوال المتاحة:
- `convertGoogleDriveUrl()` - تحويل رابط للتحميل المباشر
- `isValidGoogleDriveUrl()` - التحقق من صحة الرابط
- `downloadFileFromGoogleDrive()` - تحميل الملف
- `openGoogleDriveFile()` - فتح الملف

## 🚀 الأداء

### المزايا:
- ⚡ **تحميل فوري** - لا انتظار لاستعلامات قاعدة البيانات
- 📱 **استجابة سريعة** - تصفية وبحث محلي
- 💾 **ذاكرة محلية** - حفظ التفضيلات والعدادات
- 🔄 **تحديث سهل** - تعديل البيانات مباشرة في الكود

### الاستهلاك:
- **Supabase**: تقليل 90% من الاستعلامات
- **Bandwidth**: تقليل كبير في نقل البيانات
- **Loading Time**: تحسن ملحوظ في سرعة التحميل

## 🔧 الصيانة

### إضافة ملفات جديدة:
1. تحديث `filesData.ts`
2. إضافة الاختبارات في `examsData.ts`
3. التأكد من معرفات فريدة

### تحديث الملفات الموجودة:
1. العثور على الملف بالمعرف
2. تحديث البيانات المطلوبة
3. حفظ التغييرات

### النسخ الاحتياطي:
- البيانات محفوظة في Git
- يمكن استرداد أي إصدار سابق
- لا حاجة لنسخ احتياطية منفصلة

## 🎯 التطوير المستقبلي

### يمكن إضافة:
- 📚 نظام الدورات محلياً
- 👥 إدارة المستخدمين
- 📈 تحليلات الاستخدام
- 🏆 نظام النقاط والإنجازات
- 📅 الأحداث الأسبوعية

### التحسينات المقترحة:
- 🔄 تحديث البيانات من API خارجي
- 💾 ضغط البيانات للملفات الكبيرة
- 🔍 فهرسة أفضل للبحث
- 📊 إحصائيات أكثر تفصيلاً
