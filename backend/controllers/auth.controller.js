import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import NadraDB from '../models/nadra.model.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    try {
        const { cnic, phone, password, provincialHalqa, nationalHalqa } = req.body;

        const nadraRecord = await NadraDB.findOne({ cnic });

        if (!nadraRecord) {
            return res
                .status(400)
                .json({ message: "Invalid CNIC. Record not found in NADRA." });
        }

        if (nadraRecord.phone !== phone) {
            return res
                .status(400)
                .json({ message: "Phone number does not match NADRA record." });
        }

        const existingUser = await User.findOne({ cnic });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered." });
        }

        const newUser = new User({
            cnic,
            phone,
            password,
            name: nadraRecord.fullName,
            provincialHalqa,
            nationalHalqa,
        });

        await newUser.save();
        res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};




export const loginUser = async (req, res) => {

    console.log("agya login me");

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

export const updateUser = async (req, res) => {
    try {
        console.log("reached update user");

        const { cnic } = req.params;  // CNIC should be passed as a parameter
        const { phone, newPassword } = req.body;

        //Check if user exists
        const user = await User.findOne({ cnic });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Update user fields (phone number and/or password)
        if (phone) {
            // Update phone number if provided
            user.phone = phone;
        }

        if (newPassword) {
            // Update password if provided
            user.password = newPassword;
        }

        // Save updated user info
        await user.save();

        // Step 3: Return response
        res.status(200).json({ message: "User updated successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { cnic } = req.params;

        const user = await User.findOne({ cnic });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await User.deleteOne({ cnic });

        res.status(200).json({ message: "Account deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
