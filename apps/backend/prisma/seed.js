"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const budapestLocations = [
    { area: 'District V - Belváros', lat: 47.4979, lng: 19.0402 },
    { area: 'District VI - Terézváros', lat: 47.5050, lng: 19.0619 },
    { area: 'District VII - Erzsébetváros', lat: 47.4979, lng: 19.0649 },
    { area: 'District VIII - Józsefváros', lat: 47.4875, lng: 19.0707 },
    { area: 'District IX - Ferencváros', lat: 47.4813, lng: 19.0783 },
    { area: 'District XIII - Újlipótváros', lat: 47.5167, lng: 19.0547 },
    { area: 'District II - Rózsadomb', lat: 47.5167, lng: 19.0236 },
    { area: 'District XII - Hegyvidék', lat: 47.5089, lng: 18.9789 },
    { area: 'District I - Várnegyed', lat: 47.4925, lng: 19.0394 },
    { area: 'District III - Óbuda', lat: 47.5400, lng: 19.0419 },
    { area: 'District XI - Újbuda', lat: 47.4761, lng: 19.0494 },
    { area: 'District XIV - Zugló', lat: 47.5167, lng: 19.1089 },
    { area: 'District IV - Újpest', lat: 47.5611, lng: 19.0889 },
    { area: 'District X - Kőbánya', lat: 47.4778, lng: 19.1444 },
    { area: 'District XV - Rákospalota', lat: 47.5667, lng: 19.1167 },
];
async function main() {
    console.log('🌱 Starting database seed with Budapest locations...');
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
    const testCustomer = await prisma.user.create({
        data: {
            email: 'customer@test.com',
            password: await bcrypt.hash('test123', 10),
            firstName: 'Test',
            lastName: 'Customer',
            phone: '+36 20 123 4567',
            role: 'CUSTOMER',
            locationCity: 'Budapest',
            locationArea: 'District V - Belváros',
            locationLat: 47.4979,
            locationLng: 19.0402,
        },
    });
    const testAdmin = await prisma.user.create({
        data: {
            email: 'admin@test.com',
            password: await bcrypt.hash('test123', 10),
            firstName: 'Test',
            lastName: 'Admin',
            phone: '+36 20 123 4568',
            role: 'ADMIN',
        },
    });
    const testPro = await prisma.user.create({
        data: {
            email: 'pro@test.com',
            password: await bcrypt.hash('test123', 10),
            firstName: 'Test',
            lastName: 'Pro',
            phone: '+36 20 123 4569',
            role: 'PRO',
            proProfile: {
                create: {
                    businessName: 'Test Pro Services',
                    bio: 'Test professional for development and testing.',
                    categories: ['ELECTRICIAN', 'PLUMBER'],
                    rating: 5.0,
                    reviewCount: 1,
                    jobsCompleted: 1,
                    yearsExperience: 5,
                    verificationStatus: 'APPROVED',
                    availabilityStatus: 'AVAILABLE_NOW',
                    startingPrice: 15000,
                    currency: 'HUF',
                    responseTime: 10,
                    serviceAreaCity: 'Budapest',
                    serviceAreaRadius: 20,
                    locationCity: 'Budapest',
                    locationArea: 'District VI - Terézváros',
                    locationLat: 47.5050,
                    locationLng: 19.0619,
                },
            },
        },
    });
    console.log('✅ Created test accounts');
    const getRandomLocation = () => budapestLocations[Math.floor(Math.random() * budapestLocations.length)];
    const prosData = [
        { email: 'john.electrician@demo.com', firstName: 'John', lastName: 'Smith', phone: '+36 20 111 0001',
            businessName: 'Smith Electric Solutions', bio: 'Licensed electrician with 15 years of experience. Specializing in residential and commercial electrical work.',
            categories: ['ELECTRICIAN'], services: [
                { name: 'Electrical Inspection', price: 12000, duration: 60, category: 'ELECTRICIAN' },
                { name: 'Wiring Installation', price: 25000, duration: 180, category: 'ELECTRICIAN' }
            ]
        },
        { email: 'peter.electrician@demo.com', firstName: 'Peter', lastName: 'Nagy', phone: '+36 20 111 0002',
            businessName: 'Nagy Electrical Services', bio: 'Expert in home automation and smart lighting systems.',
            categories: ['ELECTRICIAN', 'EMERGENCY_ELECTRICIAN'], services: [
                { name: 'Emergency Electrical Repair', price: 18000, duration: 90, category: 'EMERGENCY_ELECTRICIAN' }
            ]
        },
        { email: 'mike.plumber@demo.com', firstName: 'Mike', lastName: 'Johnson', phone: '+36 20 111 0003',
            businessName: 'Johnson Plumbing Pro', bio: 'Expert plumber specializing in leak repairs and pipe installations.',
            categories: ['PLUMBER'], services: [
                { name: 'Leak Repair', price: 15000, duration: 90, category: 'PLUMBER' },
                { name: 'Pipe Installation', price: 30000, duration: 180, category: 'PLUMBER' }
            ]
        },
        { email: 'andras.plumber@demo.com', firstName: 'András', lastName: 'Kovács', phone: '+36 20 111 0004',
            businessName: 'Kovács Plumbing', bio: 'Bathroom and kitchen plumbing specialist with 10 years experience.',
            categories: ['PLUMBER', 'EMERGENCY_PLUMBER'], services: [
                { name: 'Emergency Plumbing', price: 20000, duration: 120, category: 'EMERGENCY_PLUMBER' }
            ]
        },
        { email: 'dave.handyman@demo.com', firstName: 'Dave', lastName: 'Wilson', phone: '+36 20 111 0005',
            businessName: 'Wilson Handyman Services', bio: 'All-around handyman for home repairs and maintenance.',
            categories: ['HANDYMAN'], services: [
                { name: 'General Home Repairs', price: 10000, duration: 120, category: 'HANDYMAN' }
            ]
        },
        { email: 'gabor.handyman@demo.com', firstName: 'Gábor', lastName: 'Tóth', phone: '+36 20 111 0006',
            businessName: 'Tóth Home Maintenance', bio: 'Reliable handyman for all your home repair needs.',
            categories: ['HANDYMAN', 'SMALL_FIXES'], services: [
                { name: 'Small Repairs', price: 8000, duration: 60, category: 'SMALL_FIXES' }
            ]
        },
        { email: 'tom.hvac@demo.com', firstName: 'Tom', lastName: 'Brown', phone: '+36 20 111 0007',
            businessName: 'Brown HVAC Services', bio: 'AC and heating specialist with certified technicians.',
            categories: ['HVAC_AC_REPAIR'], services: [
                { name: 'AC Repair & Maintenance', price: 22000, duration: 120, category: 'HVAC_AC_REPAIR' }
            ]
        },
        { email: 'laszlo.hvac@demo.com', firstName: 'László', lastName: 'Szabó', phone: '+36 20 111 0008',
            businessName: 'Szabó Climate Control', bio: 'Expert in air conditioning installation and repair.',
            categories: ['HVAC_AC_REPAIR'], services: [
                { name: 'AC Installation', price: 80000, duration: 240, category: 'HVAC_AC_REPAIR' }
            ]
        },
        { email: 'sam.appliance@demo.com', firstName: 'Sam', lastName: 'Davis', phone: '+36 20 111 0009',
            businessName: 'Davis Appliance Repair', bio: 'Appliance repair expert for all major brands.',
            categories: ['APPLIANCE_REPAIR'], services: [
                { name: 'Appliance Diagnostics & Repair', price: 12000, duration: 90, category: 'APPLIANCE_REPAIR' }
            ]
        },
        { email: 'istvan.appliance@demo.com', firstName: 'István', lastName: 'Horváth', phone: '+36 20 111 0010',
            businessName: 'Horváth Appliance Service', bio: 'Washing machine, dishwasher, and refrigerator specialist.',
            categories: ['APPLIANCE_REPAIR'], services: [
                { name: 'Washing Machine Repair', price: 14000, duration: 90, category: 'APPLIANCE_REPAIR' }
            ]
        },
        { email: 'gas.tech@demo.com', firstName: 'Robert', lastName: 'Miller', phone: '+36 20 111 0011',
            businessName: 'Miller Gas Services', bio: 'Certified gas technician for safe installations.',
            categories: ['GAS_TECHNICIAN'], services: [
                { name: 'Gas Line Installation', price: 35000, duration: 180, category: 'GAS_TECHNICIAN' }
            ]
        },
        { email: 'paul.painter@demo.com', firstName: 'Paul', lastName: 'Martinez', phone: '+36 20 111 0012',
            businessName: 'Martinez Professional Painting', bio: 'Professional painting services for homes and offices.',
            categories: ['PAINTING'], services: [
                { name: 'Interior Painting', price: 80000, duration: 480, category: 'PAINTING' },
                { name: 'Exterior Painting', price: 120000, duration: 600, category: 'PAINTING' }
            ]
        },
        { email: 'zoltan.painter@demo.com', firstName: 'Zoltán', lastName: 'Kiss', phone: '+36 20 111 0013',
            businessName: 'Kiss Painting Studio', bio: 'Creative painter with attention to detail.',
            categories: ['PAINTING'], services: [
                { name: 'Room Painting', price: 45000, duration: 300, category: 'PAINTING' }
            ]
        },
        { email: 'rick.flooring@demo.com', firstName: 'Rick', lastName: 'Garcia', phone: '+36 20 111 0014',
            businessName: 'Garcia Flooring Experts', bio: 'Flooring installation specialist - hardwood, laminate, tile.',
            categories: ['FLOORING'], services: [
                { name: 'Hardwood Floor Installation', price: 150000, duration: 600, category: 'FLOORING' }
            ]
        },
        { email: 'jozsef.flooring@demo.com', firstName: 'József', lastName: 'Varga', phone: '+36 20 111 0015',
            businessName: 'Varga Flooring Solutions', bio: 'Expert in all types of flooring installations.',
            categories: ['FLOORING'], services: [
                { name: 'Laminate Flooring', price: 90000, duration: 480, category: 'FLOORING' }
            ]
        },
        { email: 'tony.tile@demo.com', firstName: 'Tony', lastName: 'Rodriguez', phone: '+36 20 111 0016',
            businessName: 'Rodriguez Tile Masters', bio: 'Expert tile installation for bathrooms and kitchens.',
            categories: ['TILE_WORK'], services: [
                { name: 'Bathroom Tile Installation', price: 60000, duration: 360, category: 'TILE_WORK' }
            ]
        },
        { email: 'bela.tile@demo.com', firstName: 'Béla', lastName: 'Molnár', phone: '+36 20 111 0017',
            businessName: 'Molnár Tile Works', bio: 'Precision tile work for residential and commercial spaces.',
            categories: ['TILE_WORK'], services: [
                { name: 'Kitchen Backsplash', price: 35000, duration: 240, category: 'TILE_WORK' }
            ]
        },
        { email: 'kitchen.remodel@demo.com', firstName: 'Daniel', lastName: 'Thompson', phone: '+36 20 111 0018',
            businessName: 'Thompson Kitchen & Bath', bio: 'Complete kitchen and bathroom remodeling services.',
            categories: ['KITCHEN_BATHROOM_REMODELING'], services: [
                { name: 'Kitchen Remodeling', price: 500000, duration: 2400, category: 'KITCHEN_BATHROOM_REMODELING' }
            ]
        },
        { email: 'door.window@demo.com', firstName: 'Mark', lastName: 'Anderson', phone: '+36 20 111 0019',
            businessName: 'Anderson Doors & Windows', bio: 'Professional door and window installation.',
            categories: ['DOOR_WINDOW_INSTALLATION'], services: [
                { name: 'Window Installation', price: 45000, duration: 180, category: 'DOOR_WINDOW_INSTALLATION' }
            ]
        },
        { email: 'jim.gardening@demo.com', firstName: 'Jim', lastName: 'Lee', phone: '+36 20 111 0020',
            businessName: 'Lee Garden Services', bio: 'Professional lawn care and gardening services.',
            categories: ['GARDENING_LAWN_MOWING'], services: [
                { name: 'Lawn Mowing & Maintenance', price: 8000, duration: 60, category: 'GARDENING_LAWN_MOWING' }
            ]
        },
        { email: 'attila.garden@demo.com', firstName: 'Attila', lastName: 'Farkas', phone: '+36 20 111 0021',
            businessName: 'Farkas Gardening', bio: 'Garden design and maintenance specialist.',
            categories: ['GARDENING_LAWN_MOWING'], services: [
                { name: 'Garden Maintenance', price: 12000, duration: 120, category: 'GARDENING_LAWN_MOWING' }
            ]
        },
        { email: 'bob.tree@demo.com', firstName: 'Bob', lastName: 'Walker', phone: '+36 20 111 0022',
            businessName: 'Walker Tree Service', bio: 'Professional tree trimming and removal services.',
            categories: ['TREE_TRIMMING'], services: [
                { name: 'Tree Trimming', price: 30000, duration: 180, category: 'TREE_TRIMMING' }
            ]
        },
        { email: 'fence.install@demo.com', firstName: 'George', lastName: 'White', phone: '+36 20 111 0023',
            businessName: 'White Fence Installation', bio: 'Quality fence installation for homes and businesses.',
            categories: ['FENCE_INSTALLATION'], services: [
                { name: 'Fence Installation', price: 120000, duration: 480, category: 'FENCE_INSTALLATION' }
            ]
        },
        { email: 'pressure.wash@demo.com', firstName: 'Steve', lastName: 'Harris', phone: '+36 20 111 0024',
            businessName: 'Harris Pressure Washing', bio: 'Professional pressure washing for driveways and exteriors.',
            categories: ['PRESSURE_WASHING'], services: [
                { name: 'Pressure Washing', price: 15000, duration: 120, category: 'PRESSURE_WASHING' }
            ]
        },
        { email: 'snow.removal@demo.com', firstName: 'Jack', lastName: 'Martin', phone: '+36 20 111 0025',
            businessName: 'Martin Snow Removal', bio: 'Fast and reliable snow removal services.',
            categories: ['SNOW_REMOVAL'], services: [
                { name: 'Snow Removal', price: 10000, duration: 90, category: 'SNOW_REMOVAL' }
            ]
        },
        { email: 'lisa.cleaning@demo.com', firstName: 'Lisa', lastName: 'Hall', phone: '+36 20 111 0026',
            businessName: 'Hall Home Cleaning', bio: 'Professional home cleaning with eco-friendly products.',
            categories: ['HOME_CLEANING'], services: [
                { name: 'Standard Home Cleaning', price: 12000, duration: 120, category: 'HOME_CLEANING' }
            ]
        },
        { email: 'eva.cleaning@demo.com', firstName: 'Éva', lastName: 'Németh', phone: '+36 20 111 0027',
            businessName: 'Németh Cleaning Services', bio: 'Reliable and thorough home cleaning.',
            categories: ['HOME_CLEANING'], services: [
                { name: 'Weekly Home Cleaning', price: 10000, duration: 90, category: 'HOME_CLEANING' }
            ]
        },
        { email: 'mary.deep@demo.com', firstName: 'Mary', lastName: 'Allen', phone: '+36 20 111 0028',
            businessName: 'Allen Deep Clean Specialists', bio: 'Deep cleaning specialist for move-ins and spring cleaning.',
            categories: ['DEEP_CLEANING'], services: [
                { name: 'Deep Cleaning Service', price: 25000, duration: 240, category: 'DEEP_CLEANING' }
            ]
        },
        { email: 'office.clean@demo.com', firstName: 'Patricia', lastName: 'Young', phone: '+36 20 111 0029',
            businessName: 'Young Office Cleaning', bio: 'Professional office cleaning services.',
            categories: ['OFFICE_CLEANING'], services: [
                { name: 'Office Cleaning', price: 18000, duration: 150, category: 'OFFICE_CLEANING' }
            ]
        },
        { email: 'move.clean@demo.com', firstName: 'Susan', lastName: 'King', phone: '+36 20 111 0030',
            businessName: 'King Move-In/Out Cleaning', bio: 'Specialized in move-in and move-out cleaning.',
            categories: ['MOVE_IN_OUT_CLEANING'], services: [
                { name: 'Move-In/Out Cleaning', price: 30000, duration: 240, category: 'MOVE_IN_OUT_CLEANING' }
            ]
        },
        { email: 'carpet.clean@demo.com', firstName: 'Karen', lastName: 'Wright', phone: '+36 20 111 0031',
            businessName: 'Wright Carpet Cleaning', bio: 'Professional carpet and upholstery cleaning.',
            categories: ['CARPET_SOFA_CLEANING'], services: [
                { name: 'Carpet & Sofa Cleaning', price: 20000, duration: 180, category: 'CARPET_SOFA_CLEANING' }
            ]
        },
        { email: 'construction.clean@demo.com', firstName: 'Nancy', lastName: 'Lopez', phone: '+36 20 111 0032',
            businessName: 'Lopez Post-Construction Cleaning', bio: 'Expert in post-construction cleanup.',
            categories: ['POST_CONSTRUCTION_CLEANING'], services: [
                { name: 'Post-Construction Cleaning', price: 40000, duration: 300, category: 'POST_CONSTRUCTION_CLEANING' }
            ]
        },
        { email: 'sarah.hair@demo.com', firstName: 'Sarah', lastName: 'Johnson', phone: '+36 20 111 0033',
            businessName: 'Johnson Hair Studio', bio: 'Professional hairstylist specializing in modern cuts and colors.',
            categories: ['HAIRSTYLIST', 'HAIRCUT'], services: [
                { name: 'Haircut & Style', price: 8000, duration: 60, category: 'HAIRCUT' },
                { name: 'Hair Coloring', price: 15000, duration: 120, category: 'HAIRSTYLIST' }
            ]
        },
        { email: 'anna.hair@demo.com', firstName: 'Anna', lastName: 'Balogh', phone: '+36 20 111 0034',
            businessName: 'Balogh Hair Design', bio: 'Creative hairstylist with 10 years of experience.',
            categories: ['HAIRSTYLIST', 'HAIRCUT'], services: [
                { name: 'Women\'s Haircut', price: 7000, duration: 45, category: 'HAIRCUT' }
            ]
        },
        { email: 'james.barber@demo.com', firstName: 'James', lastName: 'King', phone: '+36 20 111 0035',
            businessName: 'King Barbershop', bio: 'Traditional barbershop with modern techniques.',
            categories: ['BARBER', 'BEARD_GROOMING'], services: [
                { name: 'Men\'s Haircut', price: 5000, duration: 30, category: 'BARBER' },
                { name: 'Beard Trim & Grooming', price: 3000, duration: 20, category: 'BEARD_GROOMING' }
            ]
        },
        { email: 'tamas.barber@demo.com', firstName: 'Tamás', lastName: 'Papp', phone: '+36 20 111 0036',
            businessName: 'Papp Barber Studio', bio: 'Expert barber specializing in classic and modern styles.',
            categories: ['BARBER', 'BEARD_GROOMING'], services: [
                { name: 'Haircut & Beard Package', price: 7000, duration: 45, category: 'BARBER' }
            ]
        },
        { email: 'emma.nails@demo.com', firstName: 'Emma', lastName: 'Wright', phone: '+36 20 111 0037',
            businessName: 'Wright Nail Studio', bio: 'Professional manicure and pedicure services.',
            categories: ['MANICURE_PEDICURE', 'NAIL_TECHNICIAN'], services: [
                { name: 'Manicure & Pedicure', price: 9000, duration: 90, category: 'MANICURE_PEDICURE' }
            ]
        },
        { email: 'reka.nails@demo.com', firstName: 'Réka', lastName: 'Simon', phone: '+36 20 111 0038',
            businessName: 'Simon Nail Art', bio: 'Creative nail technician specializing in nail art.',
            categories: ['NAIL_TECHNICIAN', 'MANICURE_PEDICURE'], services: [
                { name: 'Gel Nails', price: 12000, duration: 120, category: 'NAIL_TECHNICIAN' }
            ]
        },
        { email: 'olivia.makeup@demo.com', firstName: 'Olivia', lastName: 'Lopez', phone: '+36 20 111 0039',
            businessName: 'Lopez Makeup Artistry', bio: 'Professional makeup artist for all occasions.',
            categories: ['MAKEUP_ARTIST'], services: [
                { name: 'Bridal Makeup', price: 25000, duration: 90, category: 'MAKEUP_ARTIST' },
                { name: 'Event Makeup', price: 15000, duration: 60, category: 'MAKEUP_ARTIST' }
            ]
        },
        { email: 'eyelash.expert@demo.com', firstName: 'Sophie', lastName: 'Green', phone: '+36 20 111 0040',
            businessName: 'Green Lash & Brow Studio', bio: 'Eyelash extensions and eyebrow shaping specialist.',
            categories: ['EYELASH_EYEBROW_SERVICES'], services: [
                { name: 'Eyelash Extensions', price: 18000, duration: 120, category: 'EYELASH_EYEBROW_SERVICES' }
            ]
        },
        { email: 'anna.massage@demo.com', firstName: 'Anna', lastName: 'Hill', phone: '+36 20 111 0041',
            businessName: 'Hill Massage Therapy', bio: 'Licensed massage therapist specializing in therapeutic massage.',
            categories: ['MASSAGE_THERAPY'], services: [
                { name: 'Swedish Massage', price: 12000, duration: 60, category: 'MASSAGE_THERAPY' },
                { name: 'Deep Tissue Massage', price: 15000, duration: 90, category: 'MASSAGE_THERAPY' }
            ]
        },
        { email: 'katalin.massage@demo.com', firstName: 'Katalin', lastName: 'Lakatos', phone: '+36 20 111 0042',
            businessName: 'Lakatos Wellness', bio: 'Holistic massage and wellness therapist.',
            categories: ['MASSAGE_THERAPY'], services: [
                { name: 'Relaxation Massage', price: 10000, duration: 60, category: 'MASSAGE_THERAPY' }
            ]
        },
        { email: 'dr.smith@demo.com', firstName: 'Dr. Robert', lastName: 'Smith', phone: '+36 20 111 0043',
            businessName: 'Smith Physiotherapy Clinic', bio: 'Licensed physiotherapist with sports injury expertise.',
            categories: ['PHYSIOTHERAPY'], services: [
                { name: 'Physiotherapy Session', price: 15000, duration: 60, category: 'PHYSIOTHERAPY' }
            ]
        },
        { email: 'yoga.maya@demo.com', firstName: 'Maya', lastName: 'Patel', phone: '+36 20 111 0044',
            businessName: 'Patel Yoga Studio', bio: 'Certified yoga instructor offering private and group sessions.',
            categories: ['YOGA_INSTRUCTOR'], services: [
                { name: 'Private Yoga Session', price: 8000, duration: 60, category: 'YOGA_INSTRUCTOR' }
            ]
        },
        { email: 'trainer.mike@demo.com', firstName: 'Mike', lastName: 'Chen', phone: '+36 20 111 0045',
            businessName: 'Chen Personal Training', bio: 'Certified personal trainer specializing in weight loss and strength.',
            categories: ['PERSONAL_TRAINER', 'FITNESS_TRAINERS'], services: [
                { name: 'Personal Training Session', price: 10000, duration: 60, category: 'PERSONAL_TRAINER' }
            ]
        },
        { email: 'norbert.trainer@demo.com', firstName: 'Norbert', lastName: 'Fekete', phone: '+36 20 111 0046',
            businessName: 'Fekete Fitness', bio: 'Experienced fitness trainer for all levels.',
            categories: ['FITNESS_TRAINERS', 'PERSONAL_TRAINER'], services: [
                { name: 'Fitness Training', price: 9000, duration: 60, category: 'FITNESS_TRAINERS' }
            ]
        },
        { email: 'tech.alex@demo.com', firstName: 'Alex', lastName: 'Turner', phone: '+36 20 111 0047',
            businessName: 'Turner Tech Services', bio: 'TV mounting and smart home installation expert.',
            categories: ['TV_MOUNTING', 'SMART_HOME_INSTALLATION'], services: [
                { name: 'TV Wall Mounting', price: 15000, duration: 90, category: 'TV_MOUNTING' },
                { name: 'Smart Home Setup', price: 25000, duration: 180, category: 'SMART_HOME_INSTALLATION' }
            ]
        },
        { email: 'wifi.expert@demo.com', firstName: 'Chris', lastName: 'Anderson', phone: '+36 20 111 0048',
            businessName: 'Anderson WiFi Solutions', bio: 'WiFi and network specialist for homes and offices.',
            categories: ['WIFI_SETUP'], services: [
                { name: 'WiFi Network Setup', price: 12000, duration: 60, category: 'WIFI_SETUP' }
            ]
        },
        { email: 'cctv.install@demo.com', firstName: 'David', lastName: 'Brown', phone: '+36 20 111 0049',
            businessName: 'Brown Security Systems', bio: 'CCTV installation and security system expert.',
            categories: ['CCTV_INSTALLATION'], services: [
                { name: 'CCTV Installation', price: 80000, duration: 240, category: 'CCTV_INSTALLATION' }
            ]
        },
        { email: 'computer.repair@demo.com', firstName: 'Kevin', lastName: 'Taylor', phone: '+36 20 111 0050',
            businessName: 'Taylor Computer Repair', bio: 'Computer and laptop repair specialist.',
            categories: ['COMPUTER_LAPTOP_REPAIR'], services: [
                { name: 'Computer Repair', price: 15000, duration: 120, category: 'COMPUTER_LAPTOP_REPAIR' }
            ]
        },
        { email: 'printer.setup@demo.com', firstName: 'Brian', lastName: 'Moore', phone: '+36 20 111 0051',
            businessName: 'Moore Printer Services', bio: 'Printer setup and troubleshooting expert.',
            categories: ['PRINTER_SETUP'], services: [
                { name: 'Printer Installation', price: 8000, duration: 45, category: 'PRINTER_SETUP' }
            ]
        },
        { email: 'movers.pro@demo.com', firstName: 'Dan', lastName: 'White', phone: '+36 20 111 0052',
            businessName: 'White Moving Services', bio: 'Professional moving services for homes and offices.',
            categories: ['HOUSE_SHIFTING', 'FURNITURE_MOVING'], services: [
                { name: 'House Moving', price: 80000, duration: 480, category: 'HOUSE_SHIFTING' },
                { name: 'Furniture Moving', price: 25000, duration: 180, category: 'FURNITURE_MOVING' }
            ]
        },
        { email: 'delivery.fast@demo.com', firstName: 'Kevin', lastName: 'Harris', phone: '+36 20 111 0053',
            businessName: 'Harris Quick Delivery', bio: 'Fast and reliable small delivery service.',
            categories: ['SMALL_DELIVERIES'], services: [
                { name: 'Small Package Delivery', price: 5000, duration: 60, category: 'SMALL_DELIVERIES' }
            ]
        },
        { email: 'packing.service@demo.com', firstName: 'Laura', lastName: 'Clark', phone: '+36 20 111 0054',
            businessName: 'Clark Packing Services', bio: 'Professional packing and unpacking for moves.',
            categories: ['PACKING_UNPACKING'], services: [
                { name: 'Packing Service', price: 30000, duration: 240, category: 'PACKING_UNPACKING' }
            ]
        },
        { email: 'junk.removal@demo.com', firstName: 'Scott', lastName: 'Lewis', phone: '+36 20 111 0055',
            businessName: 'Lewis Junk Removal', bio: 'Fast junk removal and disposal service.',
            categories: ['JUNK_REMOVAL'], services: [
                { name: 'Junk Removal', price: 20000, duration: 120, category: 'JUNK_REMOVAL' }
            ]
        },
        { email: 'chef.home@demo.com', firstName: 'Maria', lastName: 'Gonzalez', phone: '+36 20 111 0056',
            businessName: 'Gonzalez Home Chef', bio: 'Professional home chef for all cuisines.',
            categories: ['COOKING_HOME_CHEF', 'MEAL_PREP'], services: [
                { name: 'Home Cooking Service', price: 20000, duration: 180, category: 'COOKING_HOME_CHEF' },
                { name: 'Weekly Meal Prep', price: 35000, duration: 240, category: 'MEAL_PREP' }
            ]
        },
        { email: 'babysitter.pro@demo.com', firstName: 'Jennifer', lastName: 'Taylor', phone: '+36 20 111 0057',
            businessName: 'Taylor Childcare', bio: 'Experienced and certified babysitter.',
            categories: ['BABYSITTING'], services: [
                { name: 'Babysitting Service', price: 3000, duration: 60, category: 'BABYSITTING' }
            ]
        },
        { email: 'elderly.care@demo.com', firstName: 'Nancy', lastName: 'Moore', phone: '+36 20 111 0058',
            businessName: 'Moore Elderly Care', bio: 'Compassionate elderly care and companionship.',
            categories: ['ELDERLY_CARE'], services: [
                { name: 'Elderly Care Service', price: 4000, duration: 60, category: 'ELDERLY_CARE' }
            ]
        },
        { email: 'home.helper@demo.com', firstName: 'Sandra', lastName: 'Adams', phone: '+36 20 111 0059',
            businessName: 'Adams Home Help', bio: 'General home help and assistance.',
            categories: ['HOME_HELPER'], services: [
                { name: 'Home Helper Service', price: 3500, duration: 60, category: 'HOME_HELPER' }
            ]
        },
        { email: 'dog.walker@demo.com', firstName: 'Steve', lastName: 'Clark', phone: '+36 20 111 0060',
            businessName: 'Clark Dog Walking', bio: 'Professional and reliable dog walker.',
            categories: ['DOG_WALKING'], services: [
                { name: 'Dog Walking', price: 3000, duration: 30, category: 'DOG_WALKING' }
            ]
        },
        { email: 'pet.sitter@demo.com', firstName: 'Rachel', lastName: 'Lewis', phone: '+36 20 111 0061',
            businessName: 'Lewis Pet Sitting', bio: 'Trusted pet sitter for all types of pets.',
            categories: ['PET_SITTING'], services: [
                { name: 'Pet Sitting', price: 5000, duration: 60, category: 'PET_SITTING' }
            ]
        },
        { email: 'pet.groomer@demo.com', firstName: 'Linda', lastName: 'Robinson', phone: '+36 20 111 0062',
            businessName: 'Robinson Pet Grooming', bio: 'Professional pet grooming for dogs and cats.',
            categories: ['PET_GROOMING'], services: [
                { name: 'Dog Grooming', price: 8000, duration: 90, category: 'PET_GROOMING' }
            ]
        },
        { email: 'vet.assist@demo.com', firstName: 'Dr. Emily', lastName: 'Walker', phone: '+36 20 111 0063',
            businessName: 'Walker Vet Assistance', bio: 'Veterinary visit assistance and pet transport.',
            categories: ['VET_VISIT_ASSISTANCE'], services: [
                { name: 'Vet Visit Assistance', price: 6000, duration: 90, category: 'VET_VISIT_ASSISTANCE' }
            ]
        },
        { email: 'party.decorator@demo.com', firstName: 'Jessica', lastName: 'Scott', phone: '+36 20 111 0064',
            businessName: 'Scott Party Decorations', bio: 'Creative party decorator for all occasions.',
            categories: ['PARTY_DECORATORS'], services: [
                { name: 'Party Decoration', price: 40000, duration: 240, category: 'PARTY_DECORATORS' }
            ]
        },
        { email: 'caterer.pro@demo.com', firstName: 'David', lastName: 'Green', phone: '+36 20 111 0065',
            businessName: 'Green Catering Services', bio: 'Professional catering for events and parties.',
            categories: ['CATERERS'], services: [
                { name: 'Event Catering', price: 150000, duration: 360, category: 'CATERERS' }
            ]
        },
        { email: 'dj.music@demo.com', firstName: 'Marcus', lastName: 'Adams', phone: '+36 20 111 0066',
            businessName: 'Adams DJ Entertainment', bio: 'Professional DJ for weddings and events.',
            categories: ['DJS'], services: [
                { name: 'DJ Service', price: 80000, duration: 240, category: 'DJS' }
            ]
        },
        { email: 'photographer.pro@demo.com', firstName: 'Sophie', lastName: 'Baker', phone: '+36 20 111 0067',
            businessName: 'Baker Photography', bio: 'Professional event and portrait photographer.',
            categories: ['PHOTOGRAPHERS'], services: [
                { name: 'Event Photography', price: 100000, duration: 300, category: 'PHOTOGRAPHERS' }
            ]
        },
        { email: 'videographer.pro@demo.com', firstName: 'Michael', lastName: 'Turner', phone: '+36 20 111 0068',
            businessName: 'Turner Videography', bio: 'Professional videographer for weddings and events.',
            categories: ['VIDEOGRAPHERS'], services: [
                { name: 'Event Videography', price: 120000, duration: 360, category: 'VIDEOGRAPHERS' }
            ]
        },
        { email: 'tutor.math@demo.com', firstName: 'Brian', lastName: 'Nelson', phone: '+36 20 111 0069',
            businessName: 'Nelson Tutoring', bio: 'Experienced math and science tutor.',
            categories: ['HOME_TUTORS'], services: [
                { name: 'Math Tutoring', price: 6000, duration: 60, category: 'HOME_TUTORS' }
            ]
        },
        { email: 'music.teacher@demo.com', firstName: 'Emily', lastName: 'Carter', phone: '+36 20 111 0070',
            businessName: 'Carter Music Academy', bio: 'Piano, guitar, and violin teacher.',
            categories: ['MUSIC_TEACHERS'], services: [
                { name: 'Piano Lessons', price: 7000, duration: 60, category: 'MUSIC_TEACHERS' }
            ]
        },
        { email: 'language.tutor@demo.com', firstName: 'Carlos', lastName: 'Rivera', phone: '+36 20 111 0071',
            businessName: 'Rivera Language School', bio: 'English, Spanish, and German tutor.',
            categories: ['LANGUAGE_TUTORS'], services: [
                { name: 'English Tutoring', price: 6500, duration: 60, category: 'LANGUAGE_TUTORS' }
            ]
        },
        { email: 'assembly.pro@demo.com', firstName: 'Greg', lastName: 'Mitchell', phone: '+36 20 111 0072',
            businessName: 'Mitchell Assembly Services', bio: 'Furniture assembly specialist for IKEA and more.',
            categories: ['FURNITURE_ASSEMBLY', 'MOUNTING_DRILLING'], services: [
                { name: 'Furniture Assembly', price: 10000, duration: 90, category: 'FURNITURE_ASSEMBLY' },
                { name: 'Wall Mounting', price: 8000, duration: 60, category: 'MOUNTING_DRILLING' }
            ]
        },
        { email: 'quick.fix@demo.com', firstName: 'Ryan', lastName: 'Perez', phone: '+36 20 111 0073',
            businessName: 'Perez Quick Fixes', bio: 'On-demand handyman for quick repairs.',
            categories: ['SMALL_FIXES'], services: [
                { name: 'Quick Repair Service', price: 7000, duration: 60, category: 'SMALL_FIXES' }
            ]
        },
    ];
    console.log(`📝 Creating ${prosData.length} professionals...`);
    for (const proData of prosData) {
        const location = getRandomLocation();
        const user = await prisma.user.create({
            data: {
                email: proData.email,
                password: await bcrypt.hash('demo123', 10),
                firstName: proData.firstName,
                lastName: proData.lastName,
                phone: proData.phone,
                role: 'PRO',
            },
        });
        const proProfile = await prisma.proProfile.create({
            data: {
                userId: user.id,
                businessName: proData.businessName,
                bio: proData.bio,
                categories: proData.categories,
                rating: 4.0 + Math.random() * 1.0,
                reviewCount: Math.floor(Math.random() * 80) + 10,
                jobsCompleted: Math.floor(Math.random() * 150) + 20,
                yearsExperience: Math.floor(Math.random() * 12) + 3,
                verificationStatus: 'APPROVED',
                availabilityStatus: Math.random() > 0.4 ? 'AVAILABLE_NOW' : 'AVAILABLE_SOON',
                startingPrice: proData.services[0].price,
                currency: 'HUF',
                responseTime: Math.floor(Math.random() * 40) + 10,
                serviceAreaCity: 'Budapest',
                serviceAreaRadius: 15,
                locationCity: 'Budapest',
                locationArea: location.area,
                locationLat: location.lat,
                locationLng: location.lng,
            },
        });
        for (const serviceData of proData.services) {
            await prisma.service.create({
                data: {
                    proId: proProfile.id,
                    name: serviceData.name,
                    description: `Professional ${serviceData.name.toLowerCase()} service with quality guarantee.`,
                    category: serviceData.category,
                    pricingModel: 'FIXED',
                    price: serviceData.price,
                    duration: serviceData.duration,
                    currency: 'HUF',
                },
            });
        }
        console.log(`✅ Created: ${proData.businessName} in ${location.area}`);
    }
    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Created ${prosData.length + 1} professionals across ALL service categories`);
    console.log('🏙️  All professionals located in Budapest, Hungary');
    console.log('🔑 Test accounts:');
    console.log('   Customer: customer@test.com / test123');
    console.log('   Pro: pro@test.com / test123');
    console.log('   Admin: admin@test.com / test123');
    console.log('   All demo pros: demo123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map