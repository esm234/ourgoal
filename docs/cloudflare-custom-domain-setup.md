# ربط موقع Cloudflare Pages بدومين مخصص من Cheapname

## نظرة عامة
هذا الدليل يوضح كيفية ربط موقعك المستضاف على Cloudflare Pages بدومين مخصص تم شراؤه من Cheapname.

## المتطلبات المسبقة
- موقع مستضاف على Cloudflare Pages
- دومين مشترى من Cheapname
- حساب Cloudflare (مجاني)

## الخطوات

### 1. إعداد الدومين في Cloudflare

#### أ. إضافة الموقع لـ Cloudflare
1. سجل دخول إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اضغط على "Add a Site"
3. أدخل اسم الدومين الخاص بك (مثال: `yoursite.com`)
4. اختر الخطة المجانية "Free"
5. اضغط "Continue"

#### ب. نسخ Name Servers
ستظهر لك Cloudflare اثنين من Name Servers مثل:
```
ns1.cloudflare.com
ns2.cloudflare.com
```
احفظ هذين العنوانين للخطوة التالية.

### 2. تحديث Name Servers في Cheapname

#### أ. الدخول لـ Control Panel
1. سجل دخول إلى حسابك في [Cheapname](https://cheapname.com)
2. اذهب إلى "My Domains" أو "إدارة النطاقات"
3. اختر الدومين المطلوب

#### ب. تغيير Name Servers
1. ابحث عن "Name Servers" أو "DNS Management"
2. اختر "Custom Name Servers"
3. أدخل Name Servers من Cloudflare:
   - Primary: `ns1.cloudflare.com`
   - Secondary: `ns2.cloudflare.com`
4. احفظ التغييرات

**ملاحظة:** قد يستغرق التحديث من 24-48 ساعة للانتشار عالمياً.

### 3. إعداد DNS Records في Cloudflare

#### أ. العودة لـ Cloudflare Dashboard
1. اذهب إلى تبويب "DNS" في موقعك
2. أضف السجلات التالية:

#### ب. إضافة CNAME Record للدومين الرئيسي
```
Type: CNAME
Name: @ (أو اتركه فارغ)
Target: your-site.pages.dev
TTL: Auto
Proxy Status: Proxied (البرتقالي)
```

#### ج. إضافة CNAME Record للـ www
```
Type: CNAME
Name: www
Target: your-site.pages.dev
TTL: Auto
Proxy Status: Proxied (البرتقالي)
```

### 4. ربط الدومين بـ Cloudflare Pages

#### أ. الذهاب لـ Pages Dashboard
1. اذهب إلى [Cloudflare Pages](https://pages.cloudflare.com)
2. اختر مشروعك
3. اذهب إلى تبويب "Custom domains"

#### ب. إضافة الدومين المخصص
1. اضغط "Set up a custom domain"
2. أدخل اسم الدومين: `yoursite.com`
3. اضغط "Continue"
4. أضف أيضاً: `www.yoursite.com`

### 5. إعداد SSL Certificate

#### أ. التحقق من SSL
1. في Cloudflare Dashboard، اذهب لتبويب "SSL/TLS"
2. تأكد أن الإعداد على "Full" أو "Full (strict)"
3. فعّل "Always Use HTTPS"

#### ب. انتظار إصدار الشهادة
- قد يستغرق إصدار SSL Certificate من 15 دقيقة إلى عدة ساعات
- ستحصل على إشعار عند اكتمال الإعداد

## التحقق من الإعداد

### 1. فحص DNS Propagation
استخدم أدوات مثل:
- [DNS Checker](https://dnschecker.org)
- [What's My DNS](https://whatsmydns.net)

### 2. اختبار الموقع
1. اذهب إلى `https://yoursite.com`
2. تأكد من ظهور الموقع بشكل صحيح
3. تحقق من وجود شهادة SSL (القفل الأخضر)

## استكشاف الأخطاء

### مشكلة: الموقع لا يظهر
**الحل:**
- تأكد من انتشار DNS (قد يستغرق 48 ساعة)
- تحقق من صحة Name Servers في Cheapname
- تأكد من إعدادات CNAME في Cloudflare

### مشكلة: خطأ SSL
**الحل:**
- انتظر اكتمال إصدار الشهادة
- تأكد من إعداد SSL على "Full"
- امسح cache المتصفح

### مشكلة: Redirect Loop
**الحل:**
- غيّر إعداد SSL من "Flexible" إلى "Full"
- تأكد من عدم وجود redirects متضاربة

## نصائح إضافية

### 1. تحسين الأداء
- فعّل "Brotli Compression" في Cloudflare
- استخدم "Auto Minify" للـ CSS, JS, HTML
- فعّل "Rocket Loader" لتسريع JavaScript

### 2. الأمان
- فعّل "Security Level" على Medium أو High
- استخدم "Bot Fight Mode"
- فعّل "Always Use HTTPS"

### 3. Analytics
- فعّل "Web Analytics" في Cloudflare
- راقب الأداء من خلال Dashboard

## الخلاصة
بعد اتباع هذه الخطوات، سيكون موقعك متاحاً على الدومين المخصص مع:
- ✅ SSL Certificate مجاني
- ✅ CDN عالمي من Cloudflare
- ✅ حماية من DDoS
- ✅ تحسين الأداء التلقائي

**وقت الإعداد المتوقع:** 2-48 ساعة (حسب انتشار DNS)
