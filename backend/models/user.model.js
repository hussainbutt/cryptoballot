import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    cnic: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{13,14}$/, 'CNIC must be exactly 14 digits'],
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10,15}$/, 'Invalid phone number'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
