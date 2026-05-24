const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role, phone, department, isActive }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated', data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
