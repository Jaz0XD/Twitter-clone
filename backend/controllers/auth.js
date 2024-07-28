import bcrypt from 'bcryptjs';
import passwordSchema from '../models/passwordSchema.js';
import User from '../models/userSchema.js';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { email, username, fullName, password } = req.body;

        // Check username existence
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check email existence
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email address is already registered' });
        }

        // Check password format
        const validationErrors = passwordSchema.validate(password, { list: true });
        if (validationErrors.length > 0) {
            const errorMessages = getPasswordErrorMessage(validationErrors);
            return res.status(400).json({ error: errorMessages.join('') });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email: email,
            fullName: fullName,
            username: username,
            password: hashedPassword,
        });

        if (newUser) {
            // Save the new user to the database
            await newUser.save();

            // Generate token and set cookie
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        // Check username and password match
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid username or password' });
        } else {
            generateTokenAndSetCookie(user._id, res);

            return res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
            });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", " ", {maxAge:0})
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Server error'})
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log('Error in getMe controller', error.message);
        res.status(500).json({ error: 'Server error'})
    }
};

const getPasswordErrorMessage = (validationErrors) => {
    const errorMessages = {
        min: 'Password must be at least 8 characters long.',
        max: 'Password must be at most 100 characters long.',
        uppercase: 'Password must contain at least one uppercase letter.',
        lowercase: 'Password must contain at least one lowercase letter.',
        digits: 'Password must contain at least one number.',
        spaces: 'Password should not contain spaces.',
        symbols: 'Password must contain at least one special character (e.g., !@#$%^&*).'
    };

    return validationErrors.map(error => errorMessages[error]);
};