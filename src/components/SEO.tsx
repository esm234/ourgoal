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
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "اور جول - Our Goal | منصة تعليمية لاختبار القدرات",
  description = "منصة تعليمية متخصصة في مساعدة الطلاب على التحضير لاختبار القدرات العامة. نوفر خطط دراسية مخصصة، ملفات تدريبية، وحاسبة المعادلة لضمان نجاحك.",
  keywords = "اختبار القدرات, قدرات, تدريب, دراسة, منصة تعليمية, اور جول, Our Goal, قياس, اختبارات, تحضير, خطة دراسية",
  image = "/new-favicon.jpg",
  url,
  type = "website",
  author = "منصة اور جول",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  canonical,
  structuredData
}) => {
  const siteUrl = "https://ourgoal.site";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = canonical || fullUrl;

  // Default structured data for the organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "اور جول - Our Goal",
    "alternateName": "Our Goal",
    "description": description,
    "url": siteUrl,
    "logo": `${siteUrl}/new-favicon.jpg`,
    "image": fullImageUrl,
    "sameAs": [
      "https://t.me/ourgoul1"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Saudi Arabia"
    },
    "availableLanguage": ["ar", "en"],
    "educationalCredentialAwarded": "اختبار القدرات العامة",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات التدريب على اختبار القدرات",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "خطة دراسية مخصصة",
            "description": "خطط دراسية مخصصة لاختبار القدرات"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "حاسبة المعادلة",
            "description": "حاسبة لتحويل درجات اختبار القدرات"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "ملفات تدريبية",
            "description": "ملفات ومواد تدريبية لاختبار القدرات"
          }
        }
      ]
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language and Direction */}
      <html lang="ar" dir="rtl" />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {!noIndex && <meta name="robots" content="index,follow" />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="اور جول - Our Goal" />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@ourgoal" />
      <meta name="twitter:creator" content="@ourgoal" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="application-name" content="اور جول - Our Goal" />
      <meta name="apple-mobile-web-app-title" content="اور جول" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />

      {/* Geo Tags for Saudi Arabia */}
      <meta name="geo.region" content="SA" />
      <meta name="geo.country" content="Saudi Arabia" />
      <meta name="ICBM" content="24.7136,46.6753" />
      <meta name="geo.position" content="24.7136;46.6753" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.gpteng.co" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//t.me" />
      <link rel="dns-prefetch" href="//telegram.org" />
    </Helmet>
  );
};

export default SEO;
