// تحسين وضغط الصور
export class ImageOptimizer {
  // ضغط الصورة
  static compressImage(file: File, quality = 0.7, maxWidth = 1200): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // حساب الأبعاد الجديدة
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // رسم الصورة المضغوطة
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('فشل في ضغط الصورة'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
      img.src = URL.createObjectURL(file);
    });
  }

  // تحويل الصورة إلى WebP (أفضل ضغط)
  static convertToWebP(file: File, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(webpFile);
            } else {
              reject(new Error('فشل في تحويل الصورة إلى WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
      img.src = URL.createObjectURL(file);
    });
  }

  // إنشاء صورة مصغرة
  static createThumbnail(file: File, size = 150): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // حساب موضع القص للحصول على مربع
        const minDimension = Math.min(img.width, img.height);
        const x = (img.width - minDimension) / 2;
        const y = (img.height - minDimension) / 2;

        ctx?.drawImage(
          img,
          x, y, minDimension, minDimension,
          0, 0, size, size
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnail = new File([blob], `thumb_${file.name}`, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(thumbnail);
            } else {
              reject(new Error('فشل في إنشاء الصورة المصغرة'));
            }
          },
          file.type,
          0.8
        );
      };

      img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// مكون محسّن للصور
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className, width, height, loading = 'lazy' }) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // إنشاء صورة محسّنة
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    img.src = src;
  }, [src]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">فشل في تحميل الصورة</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="w-full h-full bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
    />
  );
};

// Hook لتحسين الصور
export const useImageOptimization = () => {
  const optimizeImage = async (file: File): Promise<File> => {
    try {
      // تحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        throw new Error('الملف ليس صورة');
      }

      // تحقق من حجم الملف
      const maxSize = 5 * 1024 * 1024; // 5 ميجا
      if (file.size > maxSize) {
        throw new Error('حجم الصورة كبير جداً');
      }

      // ضغط الصورة
      let optimizedFile = file;

      // إذا كانت الصورة كبيرة، اضغطها
      if (file.size > 1024 * 1024) { // أكبر من 1 ميجا
        optimizedFile = await ImageOptimizer.compressImage(file, 0.7, 1200);
      }

      // تحويل إلى WebP إذا كان المتصفح يدعمه
      if (supportsWebP()) {
        optimizedFile = await ImageOptimizer.convertToWebP(optimizedFile, 0.8);
      }

      return optimizedFile;
    } catch (error) {
      console.error('خطأ في تحسين الصورة:', error);
      throw error;
    }
  };

  return { optimizeImage };
};

// تحقق من دعم WebP
const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// تحسين تحميل الصور بشكل تدريجي
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // مراقبة جميع الصور الكسولة
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

// تشغيل التحميل الكسول عند تحميل الصفحة
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', lazyLoadImages);
}

import React from 'react';
