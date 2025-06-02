require('dotenv').config({ path: '.env.local' }); // Load environment variables
const mongoose = require('mongoose');
const Trip = require('../models/Trip'); 
const User = require('../models/User'); 

const tripsData = [
    {
        "code": "GALE20240615",
        "name": "Gale Reef",
        "length": "4 nights / 5 days",
        "start": new Date("2024-06-15"),
        "resort": "Blue Lagoon, 4 stars",
        "perPerson": "1299.99",
        "image": "reef1.jpg", 
        "description": "Explore the vibrant marine life of Gale Reef. Dive into crystal-clear waters and discover an underwater paradise teeming with colorful coral and exotic sea creatures."
    },
    {
        "code": "DAWS20240722",
        "name": "Dawson's Reef",
        "length": "4 nights / 5 days",
        "start": new Date("2024-07-22"),
        "resort": "Reef Retreat, 3 stars",
        "perPerson": "1099.99",
        "image": "reef2.jpg",
        "description": "Experience the tranquil beauty of Dawson's Reef. Immerse yourself in a serene underwater world with expert guides and comfortable accommodations."
    },
    {
        "code": "CLAR20240910",
        "name": "Claire's Reef",
        "length": "4 nights / 5 days",
        "start": new Date("2024-09-10"),
        "resort": "Coral Sands, 5 stars",
        "perPerson": "1599.99",
        "image": "reef3.jpg",
        "description": "Discover the luxury of Claire's Reef. Enjoy pristine beaches, world-class diving, and unparalleled marine exploration in a stunning tropical setting."
    }
];

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local. Please add it.');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    // Clear existing trips
    await Trip.deleteMany({});
    console.log('Existing trips deleted.');

    // Insert new trips
    await Trip.insertMany(tripsData);
    console.log('Database seeded successfully with trips.');

    // await User.deleteMany({ email: 'admin@example.com' }); // Clear existing admin if any
    // const adminUser = new User({
    //   name: 'Admin User',
    //   email: 'admin@example.com',
    // });
    // await adminUser.setPassword('password123'); // Set a strong password
    // await adminUser.save();
    // console.log('Admin user seeded.');


  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedDatabase();