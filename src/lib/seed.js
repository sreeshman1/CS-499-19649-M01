require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const Trip = require('../models/Trip');
const User = require('../models/User');

// Add a check to see if the models are loaded
if (!Trip) {
  console.error('🔴 Trip model failed to load. Check model file and export.');
  process.exit(1);
}
if (!User && process.env.SEED_ADMIN_USER === 'true') { 
  console.error('🔴 User model failed to load. Check model file and export.');
  process.exit(1);
}


const tripsData = [
    {
        "code": "GALE20240615",
        "name": "Gale Reef",
        "length": "4 nights / 5 days",
        "durationNights": 4,
        "start": new Date("2024-06-15"),
        "resort": "Blue Lagoon, 4 stars",
        "rating": 4,
        "perPerson": "1299.99",
        "image": "reef1.jpg",
        "description": "Explore the vibrant marine life of Gale Reef. Dive into crystal-clear waters and discover an underwater paradise teeming with colorful coral and exotic sea creatures."
    },
    {
        "code": "DAWS20240722",
        "name": "Dawson's Reef",
        "length": "4 nights / 5 days",
        "durationNights": 4,
        "start": new Date("2024-07-22"),
        "resort": "Reef Retreat, 3 stars",
        "rating": 3,
        "perPerson": "1099.99",
        "image": "reef2.jpg",
        "description": "Experience the tranquil beauty of Dawson's Reef. Immerse yourself in a serene underwater world with expert guides and comfortable accommodations."
    },
    {
        "code": "CLAR20240910",
        "name": "Claire's Reef",
        "length": "4 nights / 5 days",
        "durationNights": 4,
        "start": new Date("2024-09-10"),
        "resort": "Coral Sands, 5 stars",
        "rating": 5,
        "perPerson": "1599.99",
        "image": "reef3.jpg",
        "description": "Discover the luxury of Claire's Reef. Enjoy pristine beaches, world-class diving, and unparalleled marine exploration in a stunning tropical setting."
    }
];

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('🔴 MONGODB_URI not found in .env.local. Please add it.');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding.');

    // --- Seed Trips ---
    if (Trip) {
        console.log('Deleting existing trips...');
        await Trip.deleteMany({}); 
        console.log('✅ Existing trips deleted.');

        console.log('Inserting new trips...');
        await Trip.insertMany(tripsData);
        console.log('✅ Database seeded successfully with trips.');
    } else {
        console.error("🔴 Trip model is not defined. Skipping trip seeding.");
    }

    if (process.env.SEED_ADMIN_USER === 'true' && User) {
        console.log('Attempting to seed admin user...');
        if (!process.env.JWT_SECRET) {
            console.warn('⚠️ JWT_SECRET is not defined in .env.local. Admin user JWT generation will fail if setPassword or generateJwt relies on it directly or indirectly for User model actions that might be triggered.');
        }
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

        await User.deleteMany({ email: adminEmail });
        console.log(`✅ Cleared any existing user with email: ${adminEmail}`);
        
        const adminUser = new User({
          name: 'Admin User',
          email: adminEmail,
        });
        await adminUser.setPassword(adminPassword); 
        await adminUser.save();
        console.log(`✅ Admin user seeded with email: ${adminEmail}`);
    } else if (process.env.SEED_ADMIN_USER === 'true' && !User) {
        console.error("🔴 User model is not defined. Skipping admin user seeding.");
    }


  } catch (error) {
    console.error('🔴 Error during database seeding process:', error);
    if (error.name === 'ValidationError') {
        console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
    }
  } finally {
    console.log('Attempting to disconnect from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB.');
  }
};

seedDatabase().then(() => {
  console.log('Seeding process finished.');
  process.exit(0);
}).catch(err => {
  console.error('🔴 Unhandled error in seedDatabase promise chain:', err);
  process.exit(1);
});