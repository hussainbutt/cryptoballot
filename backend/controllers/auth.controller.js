import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import NadraDB from '../models/nadra.model.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    try {
        const { cnic, phone, password } = req.body;

        // Step 1: Check NADRA CNIC validity
        const nadraRecord = await NadraDB.findOne({ cnic });
        console.log("nadara: =============> " + nadraRecord);

        if (!nadraRecord) {
            return res.status(400).json({ message: "Invalid CNIC. Record not found in NADRA." });
        }

        // Step 2: Match phone number
        if (nadraRecord.phone !== phone) {
            return res.status(400).json({ message: "Phone number does not match NADRA record." });
        }

        // Step 3: Check if user already registered
        const existingUser = await User.findOne({ cnic });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered." });
        }

        // Step 4: Save new user (Password hashing handled by pre-save hook)
        const newUser = new User({
            cnic,
            phone,
            password,
        });

        await newUser.save();

        res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const loginUser = async (req, res) => {
    const { cnic, password } = req.body;
    try {
        const user = await User.findOne({ cnic });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
