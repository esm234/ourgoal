# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1c816ea4-aa71-4c78-a283-ef48b61ed00e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1c816ea4-aa71-4c78-a283-ef48b61ed00e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1c816ea4-aa71-4c78-a283-ef48b61ed00e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## إعداد تسجيل الدخول باستخدام Google

لإعداد تسجيل الدخول باستخدام Google مع Supabase، اتبع الخطوات التالية:

### 1. إنشاء مشروع Google Cloud وتكوين OAuth

1. انتقل إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروعًا جديدًا أو استخدم مشروعًا موجودًا
3. انتقل إلى "APIs & Services" > "Credentials"
4. انقر على "Create Credentials" واختر "OAuth client ID"
5. اختر "Web application" كنوع التطبيق
6. أضف اسمًا للتطبيق
7. أضف عناوين URL المسموح بها للتحويل (Authorized redirect URIs):
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - `https://ourgool.site/auth-callback` (للموقع الرسمي)
   - `http://localhost:5173/auth-callback` (للتطوير المحلي)
8. انقر على "Create"
9. احتفظ بـ Client ID و Client Secret، ستحتاج إليهما لاحقًا

### 2. تكوين مزود OAuth في Supabase

1. انتقل إلى [لوحة تحكم Supabase](https://app.supabase.com)
2. اختر مشروعك
3. انتقل إلى "Authentication" > "Providers"
4. ابحث عن "Google" وقم بتمكينه
5. أدخل Client ID و Client Secret الذي حصلت عليه من Google Cloud Console
6. احفظ التغييرات

### 3. تكوين URL المسموح بها في Supabase

1. في لوحة تحكم Supabase، انتقل إلى "Authentication" > "URL Configuration"
2. تأكد من إضافة عناوين URL التالية إلى "Additional redirect URLs":
   - `https://ourgool.site/auth-callback`
   - `http://localhost:5173/auth-callback`

### 4. اختبار تسجيل الدخول

بعد إكمال الإعداد، يمكنك اختبار تسجيل الدخول باستخدام Google من خلال النقر على زر "تسجيل الدخول باستخدام Google" في تطبيقك.

### ملاحظة مهمة

تم استخدام صفحة وسيطة (`/auth-callback`) للتعامل مع إعادة التوجيه بعد تسجيل الدخول بدلاً من استخدام نطاق مخصص في Supabase (الذي يتطلب خطة مدفوعة).
