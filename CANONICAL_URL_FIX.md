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

# إصلاح مشكلة الروابط المباشرة في تطبيق React مع Cloudflare Pages

## المشكلة

عند محاولة الوصول إلى صفحات التطبيق مباشرة عبر URL (مثل `https://ourgoal.site/developer`)، يظهر خطأ "Offline - Please check your connection" أو صفحة 404. هذه مشكلة شائعة في تطبيقات الويب أحادية الصفحة (SPA) المستضافة على Cloudflare Pages.

## السبب

تطبيقات React تستخدم client-side routing، لكن عند الوصول المباشر إلى مسار غير الصفحة الرئيسية، يحاول الخادم البحث عن ملف فعلي بهذا المسار. وبما أن هذه الملفات غير موجودة فعلياً (لأنها مسارات افتراضية)، يتم إرجاع خطأ 404.

## الحلول

### 1. تحديث ملف _redirects

تأكد من أن ملف `public/_redirects` يحتوي على جميع المسارات المطلوبة:

```
# Specific routes that need special handling
/developer                /index.html   200
# ... other routes ...

# Fallback for all other routes - MUST BE LAST
/*    /index.html   200
```

### 2. استخدام Cloudflare Worker

يمكن استخدام Cloudflare Worker للتعامل مع طلبات الصفحات مباشرة:

```js
// cloudflare-worker-redirect.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle domain redirects
  if (url.hostname === 'ourgoal.pages.dev') {
    const newUrl = `https://ourgoal.site${url.pathname}${url.search}${url.hash}`
    return Response.redirect(newUrl, 301)
  }
  
  // Handle SPA routes for direct navigation
  if (url.hostname === 'ourgoal.site' && !url.pathname.includes('.') && !url.pathname.startsWith('/api/')) {
    const accept = request.headers.get('accept') || ''
    if (accept.includes('text/html')) {
      const response = await fetch(request)
      if (response.status === 404) {
        return fetch(new Request(`https://ourgoal.site/index.html`, request))
      }
      return response
    }
  }
  
  return fetch(request)
}
```

### 3. إعداد Cloudflare Pages Rules

في لوحة تحكم Cloudflare Pages:

1. اذهب إلى Rules > Page Rules
2. أضف قاعدة جديدة:
   - URL pattern: `https://ourgoal.site/*`
   - Setting: "Forwarding URL"
   - Status Code: 200
   - Destination URL: `https://ourgoal.site/index.html`
3. استثنِ الملفات الثابتة (assets) من هذه القاعدة

### 4. تعديل إعدادات _headers

أضف إلى ملف `public/_headers`:

```
/*
  Link: </index.html>; rel=preload; as=document
```

## كيفية تنفيذ الحل

1. قم بتحديث ملف `_redirects` أولاً (الحل الأبسط)
2. إذا لم يعمل، قم بنشر Cloudflare Worker المحدث
3. تأكد من أن إعدادات Cloudflare Pages تسمح بـ "SPA Routing"
4. اختبر الوصول المباشر إلى الصفحات مثل `/developer`

## اختبار الحل

1. قم بمسح ذاكرة التخزين المؤقت (cache) للمتصفح
2. جرب الوصول مباشرة إلى `https://ourgoal.site/developer`
3. تأكد من أن الصفحة تعمل بشكل صحيح

## ملاحظات إضافية

- قد تحتاج إلى انتظار انتشار التغييرات (15-60 دقيقة)
- يمكن استخدام وضع التصفح الخفي لتجنب مشاكل التخزين المؤقت
- تأكد من تحديث جميع المسارات الجديدة في ملف `_redirects`
