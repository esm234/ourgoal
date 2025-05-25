# 📊 دليل المراقبة والتحسين - منصة Our Goal

## 🎯 مراقبة الاستهلاك في الوقت الفعلي

### **1. مراقبة Supabase:**

#### **Dashboard Supabase:**
```
1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك
3. Settings → Usage
4. راقب:
   - Database size (الهدف: < 400 MB)
   - Data transfer (الهدف: < 400 MB/شهر)
   - Active users (الهدف: < 40,000/شهر)
```

#### **تنبيهات تلقائية:**
```javascript
// إضافة هذا الكود لمراقبة الاستهلاك
const checkUsageLimits = async () => {
  try {
    // فحص حجم قاعدة البيانات
    const { data: dbSize } = await supabase.rpc('get_db_size');
    
    if (dbSize > 400) { // 80% من 500MB
      console.warn('⚠️ Database approaching limit:', dbSize, 'MB');
      // إرسال تنبيه للأدمن
    }
    
    // فحص عدد المستخدمين النشطين
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', new Date(Date.now() - 30*24*60*60*1000));
    
    if (activeUsers > 40000) { // 80% من 50,000
      console.warn('⚠️ Active users approaching limit:', activeUsers);
    }
    
  } catch (error) {
    console.error('Error checking usage:', error);
  }
};

// تشغيل الفحص كل ساعة
setInterval(checkUsageLimits, 60 * 60 * 1000);
```

### **2. مراقبة Vercel:**

#### **Vercel Analytics:**
```
1. Vercel Dashboard → Analytics
2. راقب:
   - Page views (مشاهدات الصفحات)
   - Unique visitors (زوار فريدون)
   - Bandwidth usage (استهلاك البيانات)
   - Function invocations (استدعاءات الدوال)
```

#### **Performance Monitoring:**
```javascript
// إضافة Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  // إرسال البيانات لـ Google Analytics أو أي خدمة أخرى
  console.log('Performance metric:', metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 🔧 تحسين الأداء والاستهلاك

### **1. تحسين قاعدة البيانات:**

#### **تنظيف البيانات القديمة:**
```sql
-- حذف البيانات القديمة (شغل شهرياً)
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '90 days';

-- تحسين الجداول
VACUUM FULL;
ANALYZE;

-- إعادة فهرسة
REINDEX DATABASE postgres;
```

#### **استعلامات محسنة:**
```javascript
// بدلاً من جلب جميع البيانات
const { data } = await supabase.from('files').select('*');

// اجلب الحقول المطلوبة فقط
const { data } = await supabase
  .from('files')
  .select('id, title, category, downloads')
  .limit(20);
```

#### **Pagination للبيانات الكبيرة:**
```javascript
const fetchFilesWithPagination = async (page = 0, pageSize = 20) => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order('created_at', { ascending: false });
    
  return { data, error };
};
```

### **2. تحسين Frontend:**

#### **Code Splitting:**
```javascript
// تحميل الصفحات عند الحاجة فقط
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Files = lazy(() => import('./pages/Files'));

// في App.tsx
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/admin" element={<AdminDashboard />} />
</Suspense>
```

#### **Image Optimization:**
```javascript
// تحسين الصور
const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};
```

#### **Caching Strategy:**
```javascript
// تخزين مؤقت للبيانات
const useCache = (key, fetchFn, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }
    
    fetchFn().then(result => {
      setData(result);
      setLoading(false);
      localStorage.setItem(key, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
    });
  }, [key]);
  
  return { data, loading };
};
```

### **3. تحسين API Calls:**

#### **Batch Requests:**
```javascript
// بدلاً من طلبات متعددة
const file = await supabase.from('files').select('*').eq('id', fileId);
const exams = await supabase.from('exams').select('*').eq('file_id', fileId);

// طلب واحد مع join
const { data } = await supabase
  .from('files')
  .select(`
    *,
    exams (*)
  `)
  .eq('id', fileId);
```

#### **Request Debouncing:**
```javascript
// تأخير البحث لتقليل الطلبات
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// في مكون البحث
const searchTerm = useDebounce(inputValue, 500);
```

---

## 📈 استراتيجيات التوفير

### **1. External Storage:**

#### **Google Drive للملفات:**
```javascript
// بدلاً من تخزين الملفات في Supabase
const uploadToGoogleDrive = async (file) => {
  // رفع الملف لـ Google Drive
  // حفظ الرابط فقط في قاعدة البيانات
  return {
    url: 'https://drive.google.com/file/d/...',
    size: file.size
  };
};
```

#### **Cloudinary للصور:**
```javascript
// تحسين الصور تلقائياً
const cloudinaryUrl = (publicId, options = {}) => {
  const baseUrl = 'https://res.cloudinary.com/your-cloud/image/upload';
  const transformations = [
    'f_auto', // تنسيق تلقائي
    'q_auto', // جودة تلقائية
    'w_800',  // عرض أقصى
    ...Object.entries(options).map(([k, v]) => `${k}_${v}`)
  ].join(',');
  
  return `${baseUrl}/${transformations}/${publicId}`;
};
```

### **2. Data Compression:**

#### **ضغط البيانات:**
```javascript
import pako from 'pako';

const compressData = (data) => {
  const jsonString = JSON.stringify(data);
  const compressed = pako.deflate(jsonString);
  return btoa(String.fromCharCode(...compressed));
};

const decompressData = (compressedData) => {
  const compressed = new Uint8Array(
    atob(compressedData).split('').map(c => c.charCodeAt(0))
  );
  const decompressed = pako.inflate(compressed, { to: 'string' });
  return JSON.parse(decompressed);
};
```

#### **تقليل حجم JSON:**
```javascript
// بدلاً من إرسال كامل البيانات
const fullData = {
  id: 1,
  title: "ملف القدرات",
  description: "وصف طويل...",
  category: "verbal",
  file_url: "https://...",
  file_size: "2.5 MB",
  downloads: 150,
  created_at: "2024-01-01T00:00:00Z"
};

// أرسل البيانات المطلوبة فقط
const minimalData = {
  id: 1,
  title: "ملف القدرات",
  category: "verbal",
  downloads: 150
};
```

---

## 🚨 تنبيهات وحدود الأمان

### **تنبيهات الاستهلاك:**

#### **Database Size:**
```javascript
const DB_SIZE_WARNING = 400; // MB (80% من 500MB)
const DB_SIZE_CRITICAL = 450; // MB (90% من 500MB)

const checkDatabaseSize = async () => {
  const { data } = await supabase.rpc('get_db_size');
  
  if (data >= DB_SIZE_CRITICAL) {
    alert('🚨 Database size critical! Upgrade needed immediately.');
  } else if (data >= DB_SIZE_WARNING) {
    console.warn('⚠️ Database size warning. Consider cleanup or upgrade.');
  }
};
```

#### **API Rate Limiting:**
```javascript
const rateLimiter = {
  requests: new Map(),
  limit: 100, // طلب في الدقيقة
  
  canMakeRequest(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // إزالة الطلبات القديمة (أكثر من دقيقة)
    const recentRequests = userRequests.filter(
      time => now - time < 60000
    );
    
    if (recentRequests.length >= this.limit) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }
};
```

### **حدود الأمان:**

#### **Input Validation:**
```javascript
const validateFileUpload = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  
  return true;
};
```

#### **SQL Injection Prevention:**
```javascript
// استخدم Supabase parameterized queries دائماً
const searchFiles = async (searchTerm) => {
  // آمن - Supabase يتعامل مع SQL injection
  const { data } = await supabase
    .from('files')
    .select('*')
    .ilike('title', `%${searchTerm}%`);
    
  return data;
};
```

---

## 📊 تقارير دورية

### **تقرير أسبوعي:**
```javascript
const generateWeeklyReport = async () => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const stats = {
    newUsers: await getUserCount(weekAgo),
    newFiles: await getFileCount(weekAgo),
    totalDownloads: await getDownloadCount(weekAgo),
    dbSize: await getDatabaseSize(),
    apiCalls: await getApiCallCount(weekAgo)
  };
  
  console.log('📊 Weekly Report:', stats);
  return stats;
};
```

### **تقرير شهري:**
```javascript
const generateMonthlyReport = async () => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const report = {
    growth: await calculateGrowthRate(monthAgo),
    costs: await calculateMonthlyCosts(),
    performance: await getPerformanceMetrics(),
    recommendations: await generateRecommendations()
  };
  
  return report;
};
```

---

## 🎯 خطة التحسين المستقبلية

### **الشهر الأول:**
- ✅ تطبيق نظام المراقبة
- ✅ تحسين استعلامات قاعدة البيانات
- ✅ إضافة Caching للبيانات الثابتة

### **الشهر الثاني:**
- 📱 تحسين الأداء على الموبايل
- 🖼️ تحسين تحميل الصور
- 📊 إضافة Analytics متقدم

### **الشهر الثالث:**
- 🔄 تطبيق CDN للملفات الثابتة
- 🗜️ ضغط البيانات المنقولة
- ⚡ تحسين سرعة التحميل

---

**📅 آخر تحديث**: ديسمبر 2024  
**🔄 مراجعة دورية**: كل أسبوع  
**📊 تقييم شامل**: كل شهر
