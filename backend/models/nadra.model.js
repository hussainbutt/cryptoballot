import mongoose from 'mongoose';

const NadraSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    cnic: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{13,14}$/, // CNIC 13 or 14 digits
    },
    phone: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    address: {
        type: String,
    },
    halqa: {
        type: String,
    },
}, { timestamps: true });

const NadraDB = mongoose.model('NadraDB', NadraSchema);

export default NadraDB;
