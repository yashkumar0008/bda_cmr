const User = require('../models/User');
const Activity = require('../models/Activity');
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, department } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'BDA Employee', phone, department });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, department: user.department } } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful', data: { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, department: user.department } } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, department }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated', data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const file = req.files.avatar;
    if (!file.mimetype.startsWith('image/')) return res.status(400).json({ success: false, message: 'Only image files allowed' });

    const user = await User.findById(req.user._id);
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath || `data:${file.mimetype};base64,${file.data.toString('base64')}`, {
      folder: 'bda_crm/avatars',
      width: 300, height: 300, crop: 'fill',
    });

    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();
    res.json({ success: true, message: 'Avatar uploaded', data: { avatar: result.secure_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
