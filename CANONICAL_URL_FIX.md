# حل مشكلة Canonical URL في Google Search Console

## المشكلة:
Google لسه شايف الـ canonical URL بتاع الموقع هو `https://ourgoal.pages.dev/` مش `https://ourgoal.site/`

## الحلول المطبقة:

### ✅ 1. تحديث Meta Tags
- حدثت canonical URLs في index.html
- حدثت Open Graph URLs
- حدثت Twitter Card URLs
- حدثت SEO component

### ✅ 2. إضافة HTTP Headers
- أضفت canonical header في `_headers`
- أضفت redirect rules في `_redirects`

### ✅ 3. إنشاء صفحة Change of Address
- عملت `change-of-address.html` لإخبار Google بالتغيير

## الخطوات المطلوبة في Google Search Console:

### 1. إضافة الموقع الجديد
1. ادخل على [Google Search Console](https://search.google.com/search-console)
2. اضغط **Add Property**
3. حط `https://ourgoal.site`
4. تأكد من الملكية

### 2. عمل Change of Address
1. في Search Console للموقع القديم (`ourgoal.pages.dev`)
2. روح على **Settings** > **Change of Address**
3. اختار الموقع الجديد (`ourgoal.site`)
4. اتبع التعليمات

### 3. رفع Sitemap للموقع الجديد
1. في Search Console للموقع الجديد
2. روح على **Sitemaps**
3. أضيف `https://ourgoal.site/sitemap.xml`

### 4. طلب إعادة فهرسة
1. في Search Console للموقع الجديد
2. روح على **URL Inspection**
3. حط `https://ourgoal.site/`
4. اضغط **Request Indexing**

## الخطوات في Cloudflare:

### 1. تأكد من Custom Domain
1. ادخل على Cloudflare Dashboard
2. روح على **Workers & Pages**
3. اختار مشروعك
4. تأكد إن `ourgoal.site` مضاف في Custom Domains

### 2. إعداد Redirect Rules
1. في Cloudflare Dashboard للدومين
2. روح على **Rules** > **Redirect Rules**
3. أضيف rule:
   - **Source**: `ourgoal.pages.dev/*`
   - **Destination**: `https://ourgoal.site/$1`
   - **Status**: `301 Permanent Redirect`

## التوقيت المتوقع:

- **24-48 ساعة**: Google يبدأ يلاحظ التغيير
- **1-2 أسبوع**: التحديث الكامل للفهرسة
- **2-4 أسابيع**: اختفاء النتائج القديمة تماماً

## اختبار النتائج:

### 1. اختبار Redirect
```bash
curl -I https://ourgoal.pages.dev/
# يجب أن يرجع 301 redirect إلى ourgoal.site
```

### 2. اختبار Canonical
- استخدم [Google Rich Results Test](https://search.google.com/test/rich-results)
- حط `https://ourgoal.site/`
- تأكد إن الـ canonical صحيح

### 3. مراقبة Search Console
- راقب **Coverage** في Search Console
- راقب **Index Status** للصفحات الجديدة

## ملاحظات مهمة:

1. **لا تحذف الدومين القديم** لحد ما Google يحدث الفهرسة
2. **الـ redirects لازم تفضل شغالة** لمدة شهرين على الأقل
3. **راقب الـ traffic** عشان تتأكد إن مفيش انخفاض
4. **حدث أي backlinks** للدومين الجديد لو ممكن

## إذا المشكلة استمرت:

1. تأكد إن الـ redirect شغال صح
2. تأكد إن مفيش mixed content (HTTP/HTTPS)
3. تأكد إن الـ sitemap محدث
4. اطلب إعادة فهرسة يدوياً لكل صفحة مهمة
