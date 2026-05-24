const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  try {
    const { lead, page = 1, limit = 20 } = req.query;
    const query = lead ? { lead } : {};
    const activities = await Activity.find(query)
      .populate('user', 'name email avatar')
      .populate('lead', 'companyName')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Activity.countDocuments(query);
    res.json({ success: true, data: { activities, total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
