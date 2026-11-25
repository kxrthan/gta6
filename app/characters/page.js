import CharactersClientPage from './CharactersClientPage'

export const metadata = {
  title: {
    absolute: 'GTA 6 Characters & Cast – Lucia, Jason, VCPD & Underworld',
  },
  description:
    'Meet the confirmed GTA 6 characters: protagonists Lucia and Jason, Leonida law enforcement, and underworld figures seen in official Rockstar footage.',
  alternates: {
    canonical: 'https://gta6fanpage.com/characters',
  },
  openGraph: {
    title: 'GTA 6 Characters & Cast – Lucia, Jason, VCPD & Underworld',
    description:
      'Meet the confirmed GTA 6 characters: protagonists Lucia and Jason, Leonida law enforcement, and underworld figures seen in official Rockstar footage.',
    url: 'https://gta6fanpage.com/characters',
    siteName: 'GTA 6 Fan Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/posts/syndicate-boss.jpg',
        width: 1200,
        height: 630,
        alt: 'GTA 6 Characters Lucia and Jason in Vice City',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Characters & Cast – Lucia, Jason, VCPD & Underworld',
    description:
      'Meet the confirmed GTA 6 characters: protagonists Lucia and Jason, Leonida law enforcement, and underworld figures seen in official Rockstar footage.',
    images: ['/images/posts/syndicate-boss.jpg'],
  },
}

export const revalidate = 60

export default function CharactersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://gta6fanpage.com/characters#webpage',
        url: 'https://gta6fanpage.com/characters',
        name: 'GTA 6 Characters & Cast – Lucia, Jason, VCPD & Underworld',
        description:
          'Meet the confirmed GTA 6 characters: protagonists Lucia and Jason, Leonida law enforcement, and underworld figures seen in official Rockstar footage.',
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
              name: 'Characters',
              item: 'https://gta6fanpage.com/characters',
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://gta6fanpage.com/characters#itemlist',
        name: 'Grand Theft Auto VI Characters & Cast',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Lucia (Protagonist)',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Jason (Protagonist)',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Stefanie (Corrections Counselor)',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'VCPD Highway Pursuit Units',
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CharactersClientPage />
    </>
  )
}
