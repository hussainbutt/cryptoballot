import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    const { cnic, phone, password } = req.body;
    try {
        const userExists = await User.findOne({ cnic });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ cnic, phone, password });
        const token = generateToken(user._id);

        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
