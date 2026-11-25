import { getVehicles } from '@/lib/data'
import VehiclesClientPage from './VehiclesClientPage'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'

export const metadata = {
  title: 'GTA 6 Vehicles Database: Confirmed Cars, Supercars & Police Cruisers',
  description:
    'Explore the complete GTA 6 vehicle database featuring confirmed cars, supercars, muscle cars, bikes, and VCPD police cruisers spotted in Vice City and Leonida.',
  keywords: [
    'GTA 6 vehicles',
    'GTA 6 cars',
    'GTA 6 supercars',
    'GTA 6 police cars',
    'GTA 6 motorcycles',
    'GTA 6 boats',
    'GTA 6 vehicle database',
    'GTA 6 car list',
    'Vice City cars',
  ],
  alternates: {
    canonical: `${baseUrl}/vehicles`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/vehicles`,
    title: 'GTA 6 Vehicles Database: Confirmed Cars, Supercars & Police Cruisers',
    description:
      'Complete database of confirmed GTA 6 cars, supercars, muscle cars, bikes, and VCPD police cruisers spotted in Vice City and Leonida.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GTA 6 Vehicles Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Vehicles Database: Confirmed Cars, Supercars & Police Cruisers',
    description:
      'Complete database of confirmed GTA 6 cars, supercars, muscle cars, bikes, and VCPD police cruisers spotted in Vice City and Leonida.',
    images: [`${baseUrl}/og-image.png`],
  },
}

export const revalidate = 60

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

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
        name: 'Vehicles',
        item: `${baseUrl}/vehicles`,
      },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GTA 6 Vehicle Database',
    description: 'Comprehensive catalog of vehicles spotted and confirmed for Grand Theft Auto VI in Leonida.',
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((v, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: v.name,
      description: v.desc || v.description,
      url: `${baseUrl}/vehicles#${v.id}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What cars are officially confirmed for GTA 6?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Official Rockstar Games trailer footage confirms iconic vehicles returning to Vice City, including the Grotti Cheetah Classic (Ferrari Testarossa), Pegassi Torero XO (Lamborghini Countach LPI 800-4), Bravado Gauntlet Hellfire (Dodge Challenger Hellcat), Pfister Comet S2 Cabrio (Porsche 911), Albany Cavalcade XL (Cadillac Escalade), and the dual protagonists classic getaway car, the Declasse Tulip M-100 (1970s Chevrolet Chevelle).',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you customize vehicles in GTA 6?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Official trailer scenes showcase extensive vehicle customization culture across Leonida, including widebody kits, custom wheels, spoilers, exhaust systems, and street takeover modifications.',
        },
      },
      {
        '@type': 'Question',
        name: 'What police vehicles are in GTA 6?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Vice City Police Department (VCPD) operates modern high-speed Buffalo EVX police interceptors, heavy SWAT Riot armored trucks, Western Sovereign police motorcycles, and coastal Predator patrol boats.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does GTA 6 feature boats, planes, and helicopters?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Due to the tropical geography of Leonida and the coastal layout of Vice City, GTA 6 features speedboats, Sea Sparrow amphibious helicopters, airboats for the Grassrivers wetlands, and cargo aircraft.',
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
      <VehiclesClientPage vehicles={vehicles} />
    </>
  )
}
