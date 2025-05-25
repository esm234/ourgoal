import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Our Goal - منصة التحضير لاختبار القدرات",
  description = "منصة شاملة للتحضير لاختبار القدرات العامة. مولد خطط دراسة مخصصة، اختبارات تجريبية، ملفات تدريبية، ونصائح من الخبراء لضمان نجاحك في الاختبار.",
  keywords = "اختبار القدرات, قياس, التحضير للقدرات, اختبارات تجريبية, خطة دراسة, الجزء اللفظي, الجزء الكمي, نصائح القدرات, مراجعة القدرات, تدريب القدرات",
  image = "/5873012480861653667.jpg",
  url = "https://ourgoal.pages.dev",
  type = "website",
  author = "Our Goal Team",
  publishedTime,
  modifiedTime
}) => {
  const fullTitle = title.includes("Our Goal") ? title : `${title} | Our Goal`;
  const fullUrl = url.startsWith('http') ? url : `https://ourgoal.pages.dev${url}`;
  const fullImage = image.startsWith('http') ? image : `https://ourgoal.pages.dev${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Arabic" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Our Goal" />
      <meta property="og:locale" content="ar_SA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:url" content={fullUrl} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />
      <meta name="application-name" content="Our Goal" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/5873012480861653667.jpg" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Our Goal",
          "alternateName": "اور جول",
          "description": description,
          "url": fullUrl,
          "logo": fullImage,
          "sameAs": [
            "https://t.me/ourgoul1"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://t.me/ourgoul1"
          },
          "areaServed": "Saudi Arabia",
          "availableLanguage": ["Arabic"],
          "educationalCredentialAwarded": "اختبار القدرات العامة",
          "offers": {
            "@type": "Offer",
            "description": "خدمات التحضير لاختبار القدرات",
            "price": "0",
            "priceCurrency": "SAR"
          }
        })}
      </script>
      
      {/* Website Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Our Goal",
          "alternateName": "اور جول",
          "url": fullUrl,
          "description": description,
          "inLanguage": "ar",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${fullUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
