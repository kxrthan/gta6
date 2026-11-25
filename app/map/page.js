import MapClientPage from './MapClientPage'

export const metadata = {
  title: {
    absolute: 'GTA 6 Interactive Map – Leonida & Vice City Satellite Radar',
  },
  description:
    'Explore the full GTA 6 map of Leonida and Vice City. Interactive tactical GPS radar with confirmed landmarks, airports, precincts, and coordinate intel.',
  alternates: {
    canonical: 'https://gta6fanpage.com/map',
  },
  openGraph: {
    title: 'GTA 6 Interactive Map – Leonida & Vice City Satellite Radar',
    description:
      'Explore the full GTA 6 map of Leonida and Vice City. Interactive tactical GPS radar with confirmed landmarks, airports, precincts, and coordinate intel.',
    url: 'https://gta6fanpage.com/map',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/gta6-leonida-map.jpg',
        width: 1200,
        height: 630,
        alt: 'GTA 6 Interactive Map of Leonida and Vice City',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Interactive Map – Leonida & Vice City Satellite Radar',
    description:
      'Explore the full GTA 6 map of Leonida and Vice City. Interactive tactical GPS radar with confirmed landmarks, airports, precincts, and coordinate intel.',
    images: ['/images/gta6-leonida-map.jpg'],
  },
}

export const revalidate = 60

export default function MapPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://gta6fanpage.com/map#webpage',
        url: 'https://gta6fanpage.com/map',
        name: 'GTA 6 Interactive Map – Leonida & Vice City Satellite Radar',
        description:
          'Explore the full GTA 6 map of Leonida and Vice City. Interactive tactical GPS radar with confirmed landmarks, airports, precincts, and coordinate intel.',
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
              name: 'Interactive Map',
              item: 'https://gta6fanpage.com/map',
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
      <MapClientPage />
    </>
  )
}
