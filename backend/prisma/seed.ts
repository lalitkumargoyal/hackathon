import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed data for HotelSphere - Marriott International Properties
 * Populates Marriott brand categories and luxury hotel properties with:
 * - Hotel name, description, nightly pricing
 * - Hotel ratings (1-5 scale)
 * - Marriott brand categories
 * - Hotel property images and locations
 */

// Marriott Brand Categories
const categories = [
  { name: 'Luxury Collection', slug: 'luxury-collection' },
  { name: 'JW Marriott', slug: 'jw-marriott' },
  { name: 'Marriott Hotels', slug: 'marriott-hotels' },
  { name: 'Courtyard by Marriott', slug: 'courtyard' },
  { name: 'Residence Inn', slug: 'residence-inn' },
];

// Marriott Hotel Properties - 24+ hotels across all brands
const hotels = [
  // Luxury Collection (5 properties)
  {
    name: 'The St. Regis New York',
    description: 'Iconic luxury hotel in Midtown Manhattan offering legendary butler service, exquisite dining, and timeless elegance since 1904.',
    price: 895.00,
    rating: 4.9,
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=St.+Regis+NYC',
    categorySlug: 'luxury-collection',
  },
  {
    name: 'The Ritz-Carlton, Bali',
    description: 'Clifftop resort overlooking the Indian Ocean with private villas, world-class spa, and authentic Balinese hospitality.',
    price: 750.00,
    rating: 4.9,
    location: 'Nusa Dua, Bali',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Ritz+Carlton+Bali',
    categorySlug: 'luxury-collection',
  },
  {
    name: 'W Paris - Opéra',
    description: 'Contemporary luxury hotel in the heart of Paris with bold design, innovative dining, and vibrant nightlife.',
    price: 680.00,
    rating: 4.7,
    location: 'Paris, France',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=W+Paris',
    categorySlug: 'luxury-collection',
  },
  {
    name: 'The St. Regis Dubai',
    description: 'Palatial beachfront resort on Palm Jumeirah featuring opulent suites, private beaches, and world-renowned dining.',
    price: 820.00,
    rating: 4.8,
    location: 'Dubai, UAE',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=St.+Regis+Dubai',
    categorySlug: 'luxury-collection',
  },
  {
    name: 'The Luxury Collection Hotel, Tokyo',
    description: 'Sophisticated urban retreat in Ginza offering panoramic city views, Michelin-starred dining, and Japanese elegance.',
    price: 720.00,
    rating: 4.8,
    location: 'Tokyo, Japan',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Luxury+Tokyo',
    categorySlug: 'luxury-collection',
  },

  // JW Marriott (5 properties)
  {
    name: 'JW Marriott Marquis Dubai',
    description: 'Twin-tower landmark hotel in Business Bay with rooftop dining, luxury spa, and stunning Burj Khalifa views.',
    price: 450.00,
    rating: 4.7,
    location: 'Dubai, UAE',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=JW+Dubai',
    categorySlug: 'jw-marriott',
  },
  {
    name: 'JW Marriott Los Angeles L.A. LIVE',
    description: 'Modern downtown hotel connected to entertainment complex, featuring rooftop pool, luxury spa, and gourmet restaurants.',
    price: 380.00,
    rating: 4.6,
    location: 'Los Angeles, CA',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=JW+LA',
    categorySlug: 'jw-marriott',
  },
  {
    name: 'JW Marriott Venice Resort & Spa',
    description: 'Private island retreat on Isola delle Rose with Venetian gardens, spa sanctuary, and lagoon views.',
    price: 520.00,
    rating: 4.8,
    location: 'Venice, Italy',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=JW+Venice',
    categorySlug: 'jw-marriott',
  },
  {
    name: 'JW Marriott Singapore South Beach',
    description: 'Contemporary urban oasis blending heritage architecture with modern luxury, rooftop pool, and Michelin dining.',
    price: 410.00,
    rating: 4.7,
    location: 'Singapore',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=JW+Singapore',
    categorySlug: 'jw-marriott',
  },
  {
    name: 'JW Marriott Cancún Resort & Spa',
    description: 'Beachfront paradise with turquoise waters, world-class golf, luxury spa, and authentic Mexican cuisine.',
    price: 395.00,
    rating: 4.6,
    location: 'Cancún, Mexico',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=JW+Cancun',
    categorySlug: 'jw-marriott',
  },

  // Marriott Hotels (5 properties)
  {
    name: 'Marriott Marquis New York',
    description: 'Iconic Times Square hotel with Broadway Theater District access, rooftop lounge, and elevated dining experiences.',
    price: 325.00,
    rating: 4.5,
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Marriott+NYC',
    categorySlug: 'marriott-hotels',
  },
  {
    name: 'London Marriott Hotel Grosvenor Square',
    description: 'Historic Mayfair landmark offering classic British luxury, contemporary rooms, and proximity to West End attractions.',
    price: 380.00,
    rating: 4.6,
    location: 'London, UK',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Marriott+London',
    categorySlug: 'marriott-hotels',
  },
  {
    name: 'Sydney Harbour Marriott Hotel',
    description: 'Waterfront hotel in Circular Quay with stunning Opera House views, rooftop pool, and premium harbor dining.',
    price: 340.00,
    rating: 4.5,
    location: 'Sydney, Australia',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Marriott+Sydney',
    categorySlug: 'marriott-hotels',
  },
  {
    name: 'Chicago Marriott Downtown Magnificent Mile',
    description: 'Premier Michigan Avenue hotel with skyline views, luxury shopping access, and award-winning steakhouse.',
    price: 295.00,
    rating: 4.4,
    location: 'Chicago, IL',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Marriott+Chicago',
    categorySlug: 'marriott-hotels',
  },
  {
    name: 'San Francisco Marriott Marquis',
    description: 'Downtown convention district hotel with modern rooms, rooftop lounge, and San Francisco Bay views.',
    price: 310.00,
    rating: 4.4,
    location: 'San Francisco, CA',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Marriott+SF',
    categorySlug: 'marriott-hotels',
  },

  // Courtyard by Marriott (5 properties)
  {
    name: 'Courtyard New York Manhattan/Central Park',
    description: 'Modern midtown hotel steps from Central Park with spacious rooms, fitness center, and business amenities.',
    price: 245.00,
    rating: 4.3,
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Courtyard+NYC',
    categorySlug: 'courtyard',
  },
  {
    name: 'Courtyard Miami Downtown',
    description: 'Contemporary hotel in Brickell with rooftop pool, fitness center, and easy access to beaches and nightlife.',
    price: 185.00,
    rating: 4.2,
    location: 'Miami, FL',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Courtyard+Miami',
    categorySlug: 'courtyard',
  },
  {
    name: 'Courtyard Seattle Downtown/Lake Union',
    description: 'Urban hotel with waterfront views, modern workspaces, locally-inspired dining, and tech-friendly amenities.',
    price: 215.00,
    rating: 4.4,
    location: 'Seattle, WA',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Courtyard+Seattle',
    categorySlug: 'courtyard',
  },
  {
    name: 'Courtyard Boston Downtown',
    description: 'Historic district hotel near Freedom Trail with contemporary rooms, fitness center, and local cuisine.',
    price: 225.00,
    rating: 4.3,
    location: 'Boston, MA',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Courtyard+Boston',
    categorySlug: 'courtyard',
  },
  {
    name: 'Courtyard Austin Downtown',
    description: 'Vibrant urban hotel on Sixth Street with live music venue access, rooftop bar, and Texas hospitality.',
    price: 195.00,
    rating: 4.2,
    location: 'Austin, TX',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Courtyard+Austin',
    categorySlug: 'courtyard',
  },

  // Residence Inn (4 properties)
  {
    name: 'Residence Inn San Francisco Airport',
    description: 'Extended-stay hotel with full kitchens, complimentary breakfast, free shuttle service, and pet-friendly suites.',
    price: 165.00,
    rating: 4.1,
    location: 'San Francisco, CA',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Residence+SFO',
    categorySlug: 'residence-inn',
  },
  {
    name: 'Residence Inn Washington, DC Downtown',
    description: 'Suite hotel near National Mall with separate living areas, fully-equipped kitchens, and complimentary WiFi.',
    price: 185.00,
    rating: 4.2,
    location: 'Washington, DC',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Residence+DC',
    categorySlug: 'residence-inn',
  },
  {
    name: 'Residence Inn Denver Downtown',
    description: 'Mountain-view extended stay with studio and one-bedroom suites, rooftop patio, and complimentary grocery delivery.',
    price: 155.00,
    rating: 4.1,
    location: 'Denver, CO',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Residence+Denver',
    categorySlug: 'residence-inn',
  },
  {
    name: 'Residence Inn Orlando at SeaWorld',
    description: 'Family-friendly suites near theme parks with complimentary breakfast, pool, and free shuttle to attractions.',
    price: 145.00,
    rating: 4.0,
    location: 'Orlando, FL',
    imageUrl: 'https://placehold.co/600x400/1E3A8A/FFFFFF/png?text=Residence+Orlando',
    categorySlug: 'residence-inn',
  },
];

async function main() {
  console.log('🏨 Starting HotelSphere (Marriott Properties) seed process...');

  try {
    // Clean existing data for fresh seed
    console.log('🧹 Cleaning existing data...');
    await prisma.booking.deleteMany({});
    await prisma.hotel.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('✅ Existing data cleaned successfully');

    // Seed categories (Marriott brands)
    console.log('🏢 Seeding Marriott brand categories...');
    const createdCategories = await Promise.all(
      categories.map((category) =>
        prisma.category.create({
          data: category,
        })
      )
    );
    console.log(`✅ ${createdCategories.length} Marriott brands created`);

    // Create a map of category slugs to category IDs
    const categoryMap = new Map(
      createdCategories.map((cat) => [cat.slug, cat.id])
    );

    // Seed hotels
    console.log('🏨 Seeding Marriott hotel properties...');
    const createdHotels = await Promise.all(
      hotels.map((hotel) => {
        const categoryId = categoryMap.get(hotel.categorySlug);
        if (!categoryId) {
          throw new Error(`Marriott brand not found: ${hotel.categorySlug}`);
        }

        return prisma.hotel.create({
          data: {
            name: hotel.name,
            description: hotel.description,
            price: hotel.price,
            rating: hotel.rating,
            location: hotel.location,
            imageUrl: hotel.imageUrl,
            categoryId,
          },
        });
      })
    );
    console.log(`✅ ${createdHotels.length} Marriott properties created`);

    // Summary
    console.log('\n📊 Seed Summary:');
    console.log('━'.repeat(50));
    console.log(`Marriott Brands: ${createdCategories.length}`);
    console.log(`Hotel Properties: ${createdHotels.length}`);
    console.log('━'.repeat(50));
    
    // Property breakdown by brand
    console.log('\n📈 Properties by Marriott Brand:');
    for (const category of createdCategories) {
      const count = createdHotels.filter(
        (h) => h.categoryId === category.id
      ).length;
      console.log(`  • ${category.name}: ${count} properties`);
    }

    console.log('\n🎉 HotelSphere seed completed successfully!');
    console.log('🏨 Marriott International properties are ready for booking!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
