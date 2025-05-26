/**
 * Google Drive URL Utilities
 * دوال مساعدة للتعامل مع روابط Google Drive
 */

/**
 * تحويل رابط Google Drive إلى رابط تحميل مباشر
 * @param url - الرابط الأصلي من Google Drive
 * @returns رابط التحميل المباشر أو الرابط الأصلي إذا لم يكن من Google Drive
 */
export const convertGoogleDriveUrl = (url: string | null | undefined): string => {
  // تحقق من وجود الرابط أولاً
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL provided:', url);
    return '#'; // رابط فارغ آمن
  }

  // تنظيف الرابط من المسافات الزائدة
  const cleanUrl = url.trim();

  // تحقق إذا كان الرابط من Google Drive
  if (cleanUrl.includes('drive.google.com')) {
    // النمط الأول: https://drive.google.com/file/d/FILE_ID/view
    const fileIdMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    // النمط الثاني: https://drive.google.com/open?id=FILE_ID
    const openIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (openIdMatch) {
      const fileId = openIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // النمط الثالث: https://drive.google.com/uc?id=FILE_ID
    const ucIdMatch = cleanUrl.match(/uc\?.*id=([a-zA-Z0-9-_]+)/);
    if (ucIdMatch) {
      const fileId = ucIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // إذا كان الرابط من Google Drive لكن لم نتمكن من استخراج المعرف
    console.warn('Google Drive URL detected but could not extract file ID:', cleanUrl);
    return cleanUrl; // أرجع الرابط الأصلي
  }
  
  // إذا لم يكن من Google Drive، أرجع الرابط كما هو
  return cleanUrl;
};

/**
 * تحقق من صحة رابط Google Drive
 * @param url - الرابط المراد فحصه
 * @returns true إذا كان الرابط صحيح
 */
export const isValidGoogleDriveUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const cleanUrl = url.trim();
  
  // تحقق من أن الرابط يحتوي على drive.google.com
  if (!cleanUrl.includes('drive.google.com')) {
    return true; // ليس من Google Drive، لكن قد يكون رابط صحيح آخر
  }

  // تحقق من وجود معرف الملف
  const hasFileId = /\/d\/([a-zA-Z0-9-_]+)/.test(cleanUrl) ||
                   /[?&]id=([a-zA-Z0-9-_]+)/.test(cleanUrl) ||
                   /uc\?.*id=([a-zA-Z0-9-_]+)/.test(cleanUrl);

  return hasFileId;
};

/**
 * استخراج معرف الملف من رابط Google Drive
 * @param url - رابط Google Drive
 * @returns معرف الملف أو null إذا لم يتم العثور عليه
 */
export const extractGoogleDriveFileId = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const cleanUrl = url.trim();

  // النمط الأول: /d/FILE_ID/
  const fileIdMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    return fileIdMatch[1];
  }
  
  // النمط الثاني: ?id=FILE_ID أو &id=FILE_ID
  const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (idMatch) {
    return idMatch[1];
  }

  return null;
};

/**
 * إنشاء رابط معاينة لملف Google Drive
 * @param url - الرابط الأصلي
 * @returns رابط المعاينة
 */
export const createGoogleDrivePreviewUrl = (url: string | null | undefined): string => {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url || '#';
};

/**
 * إنشاء رابط مشاركة لملف Google Drive
 * @param url - الرابط الأصلي
 * @returns رابط المشاركة
 */
export const createGoogleDriveShareUrl = (url: string | null | undefined): string => {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  return url || '#';
};

/**
 * تحميل ملف من Google Drive باستخدام رابط مباشر
 * @param url - رابط الملف
 * @param filename - اسم الملف (اختياري)
 */
export const downloadFileFromGoogleDrive = (url: string | null | undefined, filename?: string): void => {
  const downloadUrl = convertGoogleDriveUrl(url);
  
  if (downloadUrl === '#') {
    console.error('Invalid download URL');
    return;
  }

  // إنشاء عنصر رابط مخفي للتحميل
  const link = document.createElement('a');
  link.href = downloadUrl;
  if (filename) {
    link.download = filename;
  }
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // إضافة الرابط للصفحة وتفعيله ثم حذفه
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * فتح ملف Google Drive في تبويب جديد
 * @param url - رابط الملف
 * @param mode - نوع الفتح: 'view' للعرض، 'download' للتحميل
 */
export const openGoogleDriveFile = (
  url: string | null | undefined, 
  mode: 'view' | 'download' = 'view'
): void => {
  let targetUrl: string;
  
  if (mode === 'download') {
    targetUrl = convertGoogleDriveUrl(url);
  } else {
    targetUrl = createGoogleDriveShareUrl(url);
  }
  
  if (targetUrl === '#') {
    console.error('Invalid file URL');
    return;
  }

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
};
