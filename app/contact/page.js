import ContactClientPage from './ContactClientPage'

export const metadata = {
  title: {
    absolute: 'Contact GTA 6 Fan Hub – Submit News Tips & Feedback',
  },
  description:
    'Contact the GTA 6 Fan Hub editorial team. Submit verified GTA 6 news tips, cheat code corrections, partnership inquiries, or general feedback.',
  alternates: {
    canonical: 'https://gta6fanpage.com/contact',
  },
  openGraph: {
    title: 'Contact GTA 6 Fan Hub – Submit News Tips & Feedback',
    description:
      'Contact the GTA 6 Fan Hub editorial team. Submit verified GTA 6 news tips, cheat code corrections, partnership inquiries, or general feedback.',
    url: 'https://gta6fanpage.com/contact',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/gta6-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact GTA 6 Fan Hub Editorial Office',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact GTA 6 Fan Hub – Submit News Tips & Feedback',
    description:
      'Contact the GTA 6 Fan Hub editorial team. Submit verified GTA 6 news tips, cheat code corrections, partnership inquiries, or general feedback.',
    images: ['/images/gta6-hero.jpg'],
  },
}

export const revalidate = 60

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': 'https://gta6fanpage.com/contact#webpage',
        url: 'https://gta6fanpage.com/contact',
        name: 'Contact GTA 6 Fan Hub – Submit News Tips & Feedback',
        description:
          'Contact the GTA 6 Fan Hub editorial team. Submit verified GTA 6 news tips, cheat code corrections, partnership inquiries, or general feedback.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://gta6fanpage.com/#website',
          name: 'GTA 6 Fan Hub',
          url: 'https://gta6fanpage.com',
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://gta6fanpage.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Contact',
              item: 'https://gta6fanpage.com/contact',
            },
          ],
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClientPage />
    </>
  )
}
