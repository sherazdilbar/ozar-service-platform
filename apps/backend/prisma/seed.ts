import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

// Import types from Prisma
type ServiceCategory = 'ELECTRICIAN' | 'PLUMBER' | 'HANDYMAN' | 'HVAC_AC_REPAIR' | 'APPLIANCE_REPAIR' | 'GAS_TECHNICIAN' | 
  'PAINTING' | 'FLOORING' | 'TILE_WORK' | 'KITCHEN_BATHROOM_REMODELING' | 'DOOR_WINDOW_INSTALLATION' |
  'GARDENING_LAWN_MOWING' | 'TREE_TRIMMING' | 'FENCE_INSTALLATION' | 'PRESSURE_WASHING' | 'SNOW_REMOVAL' |
  'HOME_CLEANING' | 'DEEP_CLEANING' | 'OFFICE_CLEANING' | 'MOVE_IN_OUT_CLEANING' | 'CARPET_SOFA_CLEANING' | 'POST_CONSTRUCTION_CLEANING' |
  'HAIRCUT' | 'HAIRSTYLIST' | 'BARBER' | 'BEARD_GROOMING' |
  'MANICURE_PEDICURE' | 'MAKEUP_ARTIST' | 'NAIL_TECHNICIAN' | 'EYELASH_EYEBROW_SERVICES' |
  'MASSAGE_THERAPY' | 'PHYSIOTHERAPY' | 'YOGA_INSTRUCTOR' | 'PERSONAL_TRAINER' |
  'TV_MOUNTING' | 'WIFI_SETUP' | 'SMART_HOME_INSTALLATION' | 'CCTV_INSTALLATION' | 'COMPUTER_LAPTOP_REPAIR' | 'PRINTER_SETUP' |
  'HOUSE_SHIFTING' | 'FURNITURE_MOVING' | 'SMALL_DELIVERIES' | 'PACKING_UNPACKING' | 'JUNK_REMOVAL' |
  'COOKING_HOME_CHEF' | 'MEAL_PREP' | 'BABYSITTING' | 'ELDERLY_CARE' | 'HOME_HELPER' |
  'DOG_WALKING' | 'PET_SITTING' | 'PET_GROOMING' | 'VET_VISIT_ASSISTANCE' |
  'PARTY_DECORATORS' | 'CATERERS' | 'DJS' | 'PHOTOGRAPHERS' | 'VIDEOGRAPHERS' |
  'HOME_TUTORS' | 'MUSIC_TEACHERS' | 'LANGUAGE_TUTORS' | 'FITNESS_TRAINERS' |
  'FURNITURE_ASSEMBLY' | 'MOUNTING_DRILLING' | 'SMALL_FIXES' | 'EMERGENCY_ELECTRICIAN' | 'EMERGENCY_PLUMBER';

type PricingModel = 'HOURLY' | 'FIXED' | 'INSPECTION';

// Budapest coordinates and districts
const BUDAPEST_DISTRICTS = [
  { name: 'District I - Castle District', lat: 47.4979, lng: 19.0402 },
  { name: 'District II - Rózsadomb', lat: 47.5167, lng: 19.0167 },
  { name: 'District III - Óbuda', lat: 47.5400, lng: 19.0400 },
  { name: 'District IV - Újpest', lat: 47.5611, lng: 19.0889 },
  { name: 'District V - Downtown', lat: 47.4979, lng: 19.0402 },
  { name: 'District VI - Terézváros', lat: 47.5069, lng: 19.0608 },
  { name: 'District VII - Erzsébetváros', lat: 47.4979, lng: 19.0636 },
  { name: 'District VIII - Józsefváros', lat: 47.4875, lng: 19.0697 },
  { name: 'District IX - Ferencváros', lat: 47.4761, lng: 19.0814 },
  { name: 'District X - Kőbánya', lat: 47.4775, lng: 19.1447 },
  { name: 'District XI - Újbuda', lat: 47.4761, lng: 19.0514 },
  { name: 'District XII - Hegyvidék', lat: 47.5167, lng: 18.9833 },
  { name: 'District XIII - Angyalföld', lat: 47.5167, lng: 19.0667 },
  { name: 'District XIV - Zugló', lat: 47.5167, lng: 19.1000 },
];

const FIRST_NAMES = ['János', 'Péter', 'László', 'Gábor', 'István', 'Zoltán', 'Attila', 'Tamás', 'András', 'Balázs', 'Csaba', 'Dávid', 'Erik', 'Ferenc', 'György'];
const LAST_NAMES = ['Kovács', 'Nagy', 'Tóth', 'Szabó', 'Horváth', 'Molnár', 'Kiss', 'Varga', 'Balogh', 'Papp', 'Farkas', 'Takács', 'Juhász', 'Lakatos', 'Mészáros'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate pro data for each category
function generateProData(category: ServiceCategory, index: number) {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[index % LAST_NAMES.length];
  const district = BUDAPEST_DISTRICTS[index % BUDAPEST_DISTRICTS.length];
  
  const categoryLabel = category.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
  
  return {
    email: `${category.toLowerCase()}${index}@ozar.com`,
    firstName,
    lastName,
    phone: `+36 ${getRandomInt(20, 99)} ${getRandomInt(100, 999)} ${getRandomInt(1000, 9999)}`,
    businessName: `${firstName} ${lastName} ${categoryLabel}`,
    bio: `Professional ${categoryLabel} service provider in Budapest with ${getRandomInt(5, 20)} years of experience. Quality work guaranteed.`,
    district,
    yearsExperience: getRandomInt(5, 20),
    category,
  };
}

async function main() {
  console.log('🌱 Starting database seed for Budapest...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.bookingEvent.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.proProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleared');

  // Create admin account
  console.log('👑 Creating admin account...');
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@ozar.com',
      password,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+36 20 123 4567',
      role: 'ADMIN',
      locationCity: 'Budapest',
      locationArea: 'District V - Downtown',
      locationLat: 47.4979,
      locationLng: 19.0402,
    },
  });
  console.log('✅ Admin account created: admin@ozar.com / admin123');

  // Get all categories
  const allCategories: ServiceCategory[] = [
    'ELECTRICIAN', 'PLUMBER', 'HANDYMAN', 'HVAC_AC_REPAIR', 'APPLIANCE_REPAIR', 'GAS_TECHNICIAN',
    'PAINTING', 'FLOORING', 'TILE_WORK', 'KITCHEN_BATHROOM_REMODELING', 'DOOR_WINDOW_INSTALLATION',
    'GARDENING_LAWN_MOWING', 'TREE_TRIMMING', 'FENCE_INSTALLATION', 'PRESSURE_WASHING', 'SNOW_REMOVAL',
    'HOME_CLEANING', 'DEEP_CLEANING', 'OFFICE_CLEANING', 'MOVE_IN_OUT_CLEANING', 'CARPET_SOFA_CLEANING', 'POST_CONSTRUCTION_CLEANING',
    'HAIRCUT', 'HAIRSTYLIST', 'BARBER', 'BEARD_GROOMING',
    'MANICURE_PEDICURE', 'MAKEUP_ARTIST', 'NAIL_TECHNICIAN', 'EYELASH_EYEBROW_SERVICES',
    'MASSAGE_THERAPY', 'PHYSIOTHERAPY', 'YOGA_INSTRUCTOR', 'PERSONAL_TRAINER',
    'TV_MOUNTING', 'WIFI_SETUP', 'SMART_HOME_INSTALLATION', 'CCTV_INSTALLATION', 'COMPUTER_LAPTOP_REPAIR', 'PRINTER_SETUP',
    'HOUSE_SHIFTING', 'FURNITURE_MOVING', 'SMALL_DELIVERIES', 'PACKING_UNPACKING', 'JUNK_REMOVAL',
    'COOKING_HOME_CHEF', 'MEAL_PREP', 'BABYSITTING', 'ELDERLY_CARE', 'HOME_HELPER',
    'DOG_WALKING', 'PET_SITTING', 'PET_GROOMING', 'VET_VISIT_ASSISTANCE',
    'PARTY_DECORATORS', 'CATERERS', 'DJS', 'PHOTOGRAPHERS', 'VIDEOGRAPHERS',
    'HOME_TUTORS', 'MUSIC_TEACHERS', 'LANGUAGE_TUTORS', 'FITNESS_TRAINERS',
    'FURNITURE_ASSEMBLY', 'MOUNTING_DRILLING', 'SMALL_FIXES', 'EMERGENCY_ELECTRICIAN', 'EMERGENCY_PLUMBER'
  ];
  console.log(`📋 Creating pros for ${allCategories.length} categories...`);

  let proCount = 0;
  const proPassword = await bcrypt.hash('test123', 10);

  for (let i = 0; i < allCategories.length; i++) {
    const category = allCategories[i];
    const proData = generateProData(category, i);
    
    try {
      const user = await prisma.user.create({
        data: {
          email: proData.email,
          password: proPassword,
          firstName: proData.firstName,
          lastName: proData.lastName,
          phone: proData.phone,
          role: 'PRO',
          locationCity: 'Budapest',
          locationArea: proData.district.name,
          locationLat: proData.district.lat,
          locationLng: proData.district.lng,
          proProfile: {
            create: {
              businessName: proData.businessName,
              bio: proData.bio,
              categories: [category],
              rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
              reviewCount: getRandomInt(5, 50),
              jobsCompleted: getRandomInt(10, 200),
              yearsExperience: proData.yearsExperience,
              verificationStatus: 'APPROVED',
              availabilityStatus: 'AVAILABLE_NOW',
              startingPrice: getRandomInt(5000, 20000),
              currency: 'HUF',
              responseTime: getRandomInt(5, 30),
              serviceAreaCity: 'Budapest',
              serviceAreaRadius: getRandomInt(10, 30),
              locationCity: 'Budapest',
              locationArea: proData.district.name,
              locationLat: proData.district.lat,
              locationLng: proData.district.lng,
            },
          },
        },
        include: {
          proProfile: true,
        },
      });

      // Create 2-3 services for each pro
      const serviceCount = getRandomInt(2, 3);
      for (let j = 0; j < serviceCount; j++) {
        await prisma.service.create({
          data: {
            proId: user.proProfile!.id,
            name: `${proData.businessName} Service ${j + 1}`,
            description: `Professional ${category.toLowerCase().replace(/_/g, ' ')} service`,
            category,
            pricingModel: getRandomElement(['HOURLY', 'FIXED', 'INSPECTION'] as PricingModel[]),
            price: getRandomInt(5000, 30000),
            duration: getRandomInt(30, 240),
            currency: 'HUF',
          },
        });
      }

      proCount++;
      if (proCount % 10 === 0) {
        console.log(`✅ Created ${proCount}/${allCategories.length} pros...`);
      }
    } catch (error) {
      console.error(`❌ Error creating pro for ${category}:`, error);
    }
  }

  console.log(`\n✅ Seed completed! Created ${proCount} professional profiles in Budapest`);
  console.log('📍 All pros are located in various districts of Budapest');
  console.log('🌍 Language: English');
  console.log('💰 Currency: HUF (Hungarian Forint)');
  console.log('\n🔐 Test credentials:');
  console.log('   Admin: admin@ozar.com / admin123');
  console.log('   Pros: [category]@ozar.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
