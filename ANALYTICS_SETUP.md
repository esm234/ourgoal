# Analytics & Search Console Setup Guide

## 🎯 Overview
This guide helps you set up comprehensive analytics and search engine optimization tools for the Our Goal platform.

## 📊 Google Analytics 4 Setup

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an account named "Our Goal Platform"
4. Set up a property for "ourgoal.pages.dev"
5. Choose "Web" as the platform

### 2. Install GA4 Tracking Code
Add this code to your `index.html` in the `<head>` section:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Enhanced Ecommerce Tracking (Optional)
For tracking study plan downloads and calculator usage:

```javascript
// Track study plan generation
gtag('event', 'generate_study_plan', {
  event_category: 'engagement',
  event_label: 'study_plan_generator',
  value: 1
});

// Track calculator usage
gtag('event', 'use_calculator', {
  event_category: 'engagement',
  event_label: 'equivalency_calculator',
  value: 1
});
```

## 🔍 Google Search Console Setup

### 1. Add Property
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Choose "URL prefix" and enter: `https://ourgoal.pages.dev`

### 2. Verify Ownership
Choose one of these methods:

#### Method 1: HTML File Upload
1. Download the verification file
2. Upload to your `public` folder
3. Deploy and verify

#### Method 2: HTML Meta Tag
Add this to your `index.html` `<head>`:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

#### Method 3: DNS Verification (Recommended for Cloudflare)
1. Add TXT record to your DNS
2. Name: `@` or domain name
3. Value: `google-site-verification=YOUR_CODE`

### 3. Submit Sitemap
1. In Search Console, go to "Sitemaps"
2. Add sitemap URL: `https://ourgoal.pages.dev/sitemap.xml`
3. Submit and monitor indexing status

## 🌐 Bing Webmaster Tools Setup

### 1. Add Site
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. Add your site: `https://ourgoal.pages.dev`

### 2. Verify Ownership
Similar to Google, choose:
- XML file upload
- Meta tag verification
- DNS verification

### 3. Submit Sitemap
Add your sitemap URL in the Sitemaps section.

## 📱 Social Media Analytics

### Facebook/Meta Business
1. Create [Facebook Business Manager](https://business.facebook.com/)
2. Add your website domain
3. Install Facebook Pixel (optional)

### Twitter Analytics
1. Apply for [Twitter Developer Account](https://developer.twitter.com/)
2. Create app for website analytics
3. Add Twitter Card validation

## 🎯 Key Performance Indicators (KPIs)

### Traffic Metrics
- **Organic search traffic** from Arabic keywords
- **Direct traffic** from brand searches
- **Referral traffic** from social media
- **Page views** per session
- **Session duration** and bounce rate

### Engagement Metrics
- **Study plan generations** per day/week
- **Calculator usage** frequency
- **File downloads** and views
- **FAQ page** engagement
- **User registration** rates

### Technical Metrics
- **Page load speed** (Core Web Vitals)
- **Mobile usability** scores
- **Search console** crawl errors
- **Sitemap indexing** status

## 📊 Custom Events Tracking

### Study Plan Generator Events
```javascript
// Plan generation started
gtag('event', 'study_plan_start', {
  event_category: 'study_tools',
  event_label: 'plan_generator'
});

// Plan completed and downloaded
gtag('event', 'study_plan_download', {
  event_category: 'conversions',
  event_label: 'pdf_download',
  value: 1
});
```

### Calculator Events
```javascript
// Calculator form submitted
gtag('event', 'calculator_submit', {
  event_category: 'study_tools',
  event_label: 'equivalency_calculator'
});

// Results viewed
gtag('event', 'calculator_results', {
  event_category: 'engagement',
  event_label: 'results_viewed'
});
```

### File Access Events
```javascript
// File category viewed
gtag('event', 'file_category_view', {
  event_category: 'content',
  event_label: category_name // 'verbal', 'quantitative', 'mixed'
});

// External file link clicked
gtag('event', 'file_download', {
  event_category: 'content',
  event_label: 'external_link_click',
  value: 1
});
```

## 🔧 Advanced Analytics Setup

### 1. Custom Dimensions
Set up these custom dimensions in GA4:
- **User Type**: New vs Returning
- **Study Plan Type**: Generated vs Imported
- **Device Category**: Mobile vs Desktop
- **Traffic Source**: Organic vs Direct vs Social

### 2. Conversion Goals
Define these conversions:
- **Study Plan Generation** (primary goal)
- **Calculator Usage** (engagement goal)
- **User Registration** (acquisition goal)
- **File Access** (content goal)

### 3. Audience Segments
Create segments for:
- **Active Students**: Users who generated study plans
- **Calculator Users**: Users who used equivalency calculator
- **Mobile Users**: Users primarily on mobile devices
- **Returning Visitors**: Users with multiple sessions

## 📈 Reporting Dashboard

### Weekly Reports
- **Traffic overview** with source breakdown
- **Top performing pages** by views and engagement
- **Search queries** driving traffic
- **Technical issues** from Search Console

### Monthly Reports
- **Growth trends** in organic traffic
- **Keyword ranking** improvements
- **User behavior** patterns and insights
- **Conversion rate** optimization opportunities

## 🛠 Tools Integration

### Google Tag Manager (Recommended)
1. Create GTM account
2. Install GTM container code
3. Set up tags for GA4, Facebook Pixel, etc.
4. Use triggers for custom events

### Hotjar or Similar (User Behavior)
1. Install heatmap tracking
2. Monitor user interactions
3. Identify UX improvement areas
4. A/B test different layouts

### Search Console API
For automated reporting:
```javascript
// Example: Fetch search performance data
const searchConsoleData = await fetch('/api/search-console', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

## 🎯 Arabic SEO Specific Tracking

### Arabic Keyword Tracking
Monitor rankings for:
- اختبار القدرات (Qudurat test)
- حاسبة المعادلة (Equivalency calculator)
- خطة دراسية (Study plan)
- منصة تعليمية (Educational platform)

### Regional Performance
Track performance in:
- **Saudi Arabia** (primary market)
- **UAE** (secondary market)
- **Other Gulf countries**

### Local Search Optimization
- Monitor local search visibility
- Track "near me" type queries
- Optimize for voice search in Arabic

## 📊 Privacy & Compliance

### GDPR Compliance
- Add cookie consent banner
- Provide privacy policy
- Allow data deletion requests

### Data Retention
- Set appropriate data retention periods
- Regular data cleanup
- User consent management

This comprehensive analytics setup will provide deep insights into your platform's performance and help optimize for better search engine visibility and user engagement.
