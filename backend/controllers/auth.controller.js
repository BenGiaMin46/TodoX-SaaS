const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || 'Error registering user'
        });
    }
};

// @desc    Authenticating user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Login error',
            error: err.message
        });
    }
};

// @desc    Get current user info
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Could not fetch user info',
            error: err.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'This email is already taken by another user'
                    });
                }
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    avatar: updatedUser.avatar,
                    token: generateToken(updatedUser._id)
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || 'Error updating info'
        });
    }
};

// @desc    Update avatar
// @route   PUT /api/auth/avatar
// @access  Private
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please choose an image file'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        user.avatar = avatarPath;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || 'Error uploading avatar'
        });
    }
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: 'Internal token authentication failed'
            });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists
            user = await User.create({
                name,
                email,
                avatar: picture, // Use Google profile picture as initial avatar
                password: Math.random().toString(36).slice(-10) // Random password (not used for OAuth)
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Google authentication sync failed',
            error: err.message
        });
    }
};
