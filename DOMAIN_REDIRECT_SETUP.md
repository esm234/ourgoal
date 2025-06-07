# إعداد Domain Redirect من .pages.dev إلى الدومين الجديد

## الخطوة 1: تحديث ملف _redirects (تم ✅)

تم إضافة redirect rule في ملف `public/_redirects`. تحتاج تعديل السطر التالي:

```
https://your-old-site.pages.dev/*  https://your-new-domain.site/:splat  301
```

**الدومينات المحدثة:**
- القديم: `ourgoal.pages.dev`
- الجديد: `ourgoal.site`

## الخطوة 2: إعداد Redirect في Cloudflare Dashboard

### أ) إعداد Page Rules (الطريقة الأولى)

1. ادخل على Cloudflare Dashboard
2. اختار الدومين القديم (.pages.dev)
3. روح على **Rules** > **Page Rules**
4. اضغط **Create Page Rule**
5. في URL pattern حط: `*ourgoal.pages.dev/*`
6. اختار **Forwarding URL** من القائمة
7. اختار **301 - Permanent Redirect**
8. في Destination URL حط: `https://ourgoal.site/$1`
9. اضغط **Save and Deploy**

### ب) إعداد Redirect Rules (الطريقة الحديثة - مفضلة)

1. ادخل على Cloudflare Dashboard
2. اختار الدومين القديم
3. روح على **Rules** > **Redirect Rules**
4. اضغط **Create rule**
5. حط اسم للـ rule مثل: "Redirect to new domain"
6. في **When incoming requests match:**
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `ourgoal.pages.dev`
7. في **Then:**
   - Type: `Dynamic`
   - Expression: `concat("https://ourgoal.site", http.request.uri.path)`
   - Status code: `301`
8. اضغط **Deploy**

## الخطوة 3: تحديث DNS (إذا لزم الأمر)

إذا كان الدومين القديم لسه شغال:
1. روح على **DNS** في Cloudflare
2. تأكد إن الـ CNAME record للدومين القديم لسه موجود
3. لا تحذفه دلوقتي عشان الـ redirect يشتغل

## الخطوة 4: Deploy التحديثات

بعد تعديل ملف `_redirects`:

```bash
npm run build
# أو
yarn build
```

ثم deploy المشروع على Cloudflare Pages.

## الخطوة 5: اختبار الـ Redirect

1. افتح الدومين القديم في متصفح جديد
2. تأكد إنه بيحولك للدومين الجديد
3. جرب صفحات مختلفة عشان تتأكد إن الـ paths محفوظة

## ملاحظات مهمة:

- **301 Redirect** ده permanent redirect وده اللي Google محتاجه
- الـ redirect هيحافظ على الـ URL path (مثلاً `/profile` هيبقى `/profile`)
- ممكن ياخد من 24-48 ساعة عشان Google يلاحظ التغيير
- لا تحذف الدومين القديم لحد ما تتأكد إن Google حدث الفهرسة

## الخطوة التالية:

بعد ما تخلص الخطوات دي، هنحتاج نعمل:
1. إضافة الدومين الجديد في Google Search Console
2. عمل Change of Address
3. طلب إعادة فهرسة للصفحات المهمة
