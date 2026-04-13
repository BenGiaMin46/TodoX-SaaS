const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// @desc    Protect routes - JWT authentication middleware
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access, please login'
        });
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist in the system'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token'
        });
    }
};
