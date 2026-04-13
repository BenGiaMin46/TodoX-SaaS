const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updateAvatar, googleLogin } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/google', googleLogin);

module.exports = router;
