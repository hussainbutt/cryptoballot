import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import NadraDB from './models/nadra.model.js';
import dotenv from 'dotenv';
dotenv.config();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Function to seed the database
const seedDatabase = async (numRecords = 100) => {
    try {
        await NadraDB.deleteMany(); // Clear existing entries

        const nadraEntries = [];

        for (let i = 0; i < numRecords; i++) {
            const entry = {
                fullName: faker.person.fullName(),
                cnic: faker.string.numeric(14),
                phone: faker.string.numeric(12),
                fatherName: faker.person.fullName(),
                dob: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }),
                gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
                address: faker.location.streetAddress(),
                halqa: faker.location.city(),
            };
            nadraEntries.push(entry);
        }

        await NadraDB.insertMany(nadraEntries);
        console.log(`${numRecords} fake NADRA records inserted successfully.`);
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};

seedDatabase();
