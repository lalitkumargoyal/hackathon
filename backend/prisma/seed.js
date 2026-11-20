"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Seed data for ProductSphere platform
 * Populates categories and at least 20 realistic products with:
 * - Product name, description, pricing
 * - Product ratings (1-5 scale)
 * - Category tags
 * - Product images (using placeholder service)
 */
// Category seed data matching Figma design requirements
const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Mobile Phones', slug: 'mobile-phones' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Smart Devices', slug: 'smart-devices' },
];
// Product seed data - 24 products across all categories
const products = [
    // Mobile Phones (5 products)
    {
        name: 'iPhone 15 Pro Max',
        description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system. Features ProMotion display with always-on capability.',
        price: 1199.99,
        rating: 4.8,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=iPhone+15+Pro',
        categorySlug: 'mobile-phones',
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Android phone with S Pen, 200MP camera, and AI-powered features. Stunning 6.8" AMOLED display.',
        price: 1299.99,
        rating: 4.7,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Galaxy+S24',
        categorySlug: 'mobile-phones',
    },
    {
        name: 'Google Pixel 8 Pro',
        description: 'Pure Android experience with incredible AI photography, Tensor G3 chip, and 7 years of OS updates.',
        price: 999.99,
        rating: 4.6,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Pixel+8+Pro',
        categorySlug: 'mobile-phones',
    },
    {
        name: 'OnePlus 12',
        description: 'Flagship killer with Snapdragon 8 Gen 3, 100W fast charging, and Hasselblad camera system.',
        price: 799.99,
        rating: 4.5,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=OnePlus+12',
        categorySlug: 'mobile-phones',
    },
    {
        name: 'Xiaomi 14 Pro',
        description: 'Premium smartphone with Leica optics, Snapdragon 8 Gen 3, and 120W HyperCharge technology.',
        price: 899.99,
        rating: 4.4,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Xiaomi+14',
        categorySlug: 'mobile-phones',
    },
    // Laptops (5 products)
    {
        name: 'MacBook Pro 16" M3 Max',
        description: 'Professional laptop with M3 Max chip, up to 128GB unified memory, and stunning Liquid Retina XDR display.',
        price: 3499.99,
        rating: 4.9,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=MacBook+Pro',
        categorySlug: 'laptops',
    },
    {
        name: 'Dell XPS 15',
        description: 'Premium Windows laptop with Intel Core i9, NVIDIA RTX 4070, and InfinityEdge display.',
        price: 2499.99,
        rating: 4.6,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Dell+XPS+15',
        categorySlug: 'laptops',
    },
    {
        name: 'ThinkPad X1 Carbon Gen 11',
        description: 'Business ultrabook with legendary keyboard, 13th Gen Intel processor, and military-grade durability.',
        price: 1899.99,
        rating: 4.7,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=ThinkPad+X1',
        categorySlug: 'laptops',
    },
    {
        name: 'ASUS ROG Zephyrus G14',
        description: 'Compact gaming laptop with AMD Ryzen 9, RTX 4090, and AniMe Matrix display on lid.',
        price: 2299.99,
        rating: 4.8,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=ROG+Zephyrus',
        categorySlug: 'laptops',
    },
    {
        name: 'HP Spectre x360 14',
        description: '2-in-1 convertible laptop with OLED touchscreen, 13th Gen Intel, and gem-cut design.',
        price: 1699.99,
        rating: 4.5,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Spectre+x360',
        categorySlug: 'laptops',
    },
    // Smart Devices (5 products)
    {
        name: 'Apple Watch Series 9',
        description: 'Advanced health tracking, always-on Retina display, and carbon neutral options. S9 chip for enhanced performance.',
        price: 429.99,
        rating: 4.7,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Apple+Watch',
        categorySlug: 'smart-devices',
    },
    {
        name: 'Amazon Echo Show 15',
        description: 'Smart display with 15.6" full HD screen, Alexa voice control, and widget customization.',
        price: 279.99,
        rating: 4.3,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Echo+Show',
        categorySlug: 'smart-devices',
    },
    {
        name: 'Google Nest Hub Max',
        description: 'Smart home hub with 10" display, Nest Cam integration, and Google Assistant.',
        price: 229.99,
        rating: 4.4,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Nest+Hub',
        categorySlug: 'smart-devices',
    },
    {
        name: 'Ring Video Doorbell Pro 2',
        description: 'Smart doorbell with 1536p HD video, 3D motion detection, and built-in Alexa.',
        price: 249.99,
        rating: 4.5,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Ring+Doorbell',
        categorySlug: 'smart-devices',
    },
    {
        name: 'Philips Hue White & Color Ambiance Kit',
        description: 'Smart lighting starter kit with 4 bulbs, bridge, and 16 million color options.',
        price: 199.99,
        rating: 4.6,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Philips+Hue',
        categorySlug: 'smart-devices',
    },
    // Accessories (5 products)
    {
        name: 'AirPods Pro (2nd generation)',
        description: 'Active noise cancellation, Adaptive Audio, and USB-C charging case with precision finding.',
        price: 249.99,
        rating: 4.8,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=AirPods+Pro',
        categorySlug: 'accessories',
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with 30-hour battery and premium sound quality.',
        price: 399.99,
        rating: 4.9,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Sony+WH1000XM5',
        categorySlug: 'accessories',
    },
    {
        name: 'Logitech MX Master 3S',
        description: 'Ergonomic wireless mouse with MagSpeed scroll wheel, 8K DPI sensor, and multi-device support.',
        price: 99.99,
        rating: 4.7,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=MX+Master+3S',
        categorySlug: 'accessories',
    },
    {
        name: 'Anker PowerCore 20000mAh',
        description: 'High-capacity portable charger with PowerIQ technology and dual USB ports.',
        price: 49.99,
        rating: 4.6,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Anker+PowerCore',
        categorySlug: 'accessories',
    },
    {
        name: 'Apple Magic Keyboard',
        description: 'Wireless keyboard with rechargeable battery, scissor mechanism, and numeric keypad.',
        price: 129.99,
        rating: 4.5,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Magic+Keyboard',
        categorySlug: 'accessories',
    },
    // Electronics (4 products)
    {
        name: 'Sony A7 IV',
        description: 'Full-frame mirrorless camera with 33MP sensor, 4K 60fps video, and advanced autofocus.',
        price: 2499.99,
        rating: 4.9,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Sony+A7+IV',
        categorySlug: 'electronics',
    },
    {
        name: 'DJI Mini 4 Pro',
        description: 'Compact drone with 4K HDR video, omnidirectional obstacle sensing, and 34-minute flight time.',
        price: 759.99,
        rating: 4.7,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=DJI+Mini+4',
        categorySlug: 'electronics',
    },
    {
        name: 'Nintendo Switch OLED',
        description: 'Gaming console with 7-inch OLED screen, enhanced audio, and wide adjustable stand.',
        price: 349.99,
        rating: 4.8,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Switch+OLED',
        categorySlug: 'electronics',
    },
    {
        name: 'Bose QuietComfort Ultra Earbuds',
        description: 'Premium wireless earbuds with spatial audio, CustomTune technology, and all-day comfort.',
        price: 299.99,
        rating: 4.6,
        imageUrl: 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Bose+QC+Ultra',
        categorySlug: 'electronics',
    },
];
async function main() {
    console.log('🌱 Starting ProductSphere seed process...');
    try {
        // Clean existing data for fresh seed
        console.log('🧹 Cleaning existing data...');
        await prisma.cartItem.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});
        console.log('✅ Existing data cleaned successfully');
        // Seed categories
        console.log('📁 Seeding categories...');
        const createdCategories = await Promise.all(categories.map((category) => prisma.category.create({
            data: category,
        })));
        console.log(`✅ ${createdCategories.length} categories created`);
        // Create a map of category slugs to category IDs
        const categoryMap = new Map(createdCategories.map((cat) => [cat.slug, cat.id]));
        // Seed products
        console.log('📦 Seeding products...');
        const createdProducts = await Promise.all(products.map((product) => {
            const categoryId = categoryMap.get(product.categorySlug);
            if (!categoryId) {
                throw new Error(`Category not found: ${product.categorySlug}`);
            }
            return prisma.product.create({
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    rating: product.rating,
                    imageUrl: product.imageUrl,
                    categoryId,
                },
            });
        }));
        console.log(`✅ ${createdProducts.length} products created`);
        // Summary
        console.log('\n📊 Seed Summary:');
        console.log('━'.repeat(50));
        console.log(`Categories: ${createdCategories.length}`);
        console.log(`Products: ${createdProducts.length}`);
        console.log('━'.repeat(50));
        // Product breakdown by category
        console.log('\n📈 Products by Category:');
        for (const category of createdCategories) {
            const count = createdProducts.filter((p) => p.categoryId === category.id).length;
            console.log(`  • ${category.name}: ${count} products`);
        }
        console.log('\n🎉 Seed completed successfully!');
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map