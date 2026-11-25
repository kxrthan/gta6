import { getCheats } from '@/lib/data'
import CheatsClientPage from './CheatsClientPage'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'

export const metadata = {
  title: 'GTA 6 Cheat Codes: Confirmed Cheats & Controller Combos (PS5 & Xbox)',
  description:
    'Complete GTA 6 cheat codes list for PlayStation 5 and Xbox Series X/S. Verified D-Pad button sequences, activation instructions, and trophy warnings.',
  keywords: [
    'GTA 6 cheat codes',
    'GTA 6 PS5 cheats',
    'GTA 6 Xbox cheats',
    'GTA 6 money cheat',
    'GTA 6 weapon cheats',
    'GTA 6 weather cheat',
    'GTA 6 cheat code list',
  ],
  alternates: {
    canonical: `${baseUrl}/cheats`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/cheats`,
    title: 'GTA 6 Cheat Codes: Confirmed Cheats & Controller Combos (PS5 & Xbox)',
    description:
      'Complete GTA 6 cheat codes list for PlayStation 5 and Xbox Series X/S. Verified D-Pad button sequences, activation instructions, and trophy warnings.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GTA 6 Cheat Codes Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Cheat Codes: Confirmed Cheats & Controller Combos (PS5 & Xbox)',
    description:
      'Complete GTA 6 cheat codes list for PlayStation 5 and Xbox Series X/S. Verified D-Pad button sequences, activation instructions, and trophy warnings.',
    images: [`${baseUrl}/og-image.png`],
  },
}

export const revalidate = 60

export default async function CheatsPage() {
  const cheats = await getCheats()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cheats',
        item: `${baseUrl}/cheats`,
      },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GTA 6 Cheat Codes Directory',
    description: 'Active controller button sequences and verified cheat code dispatches for GTA 6 on PS5 and Xbox.',
    numberOfItems: cheats.length,
    itemListElement: cheats.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.name,
      description: c.effect || c.description,
      url: `${baseUrl}/cheats#${c.id}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do you enter cheat codes in GTA 6?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Enter the directional D-Pad button sequences fluidly while roaming freely in single-player story mode. You do not need to pause the game. A brief on-screen confirmation badge will appear upon successful activation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do cheats disable trophies and achievements in GTA 6?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Entering any cheat code temporarily disables PlayStation 5 Trophies and Xbox Series X/S Achievements for the active gameplay session. Always save your game manually before activating any cheats.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you use cheat codes in GTA 6 Online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Cheat codes are strictly restricted to the offline single-player story mode campaign and are completely disabled in all multiplayer and online sessions.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the button sequence for the $250,000 cash cheat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The reported D-Pad sequence for the $250,000 cash cheat on PS5 and Xbox is Up, Right, Down, Left, Up, Left, Down, Right (↑ → ↓ ← ↑ ← ↓ →).',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CheatsClientPage cheats={cheats} />
    </>
  )
}
