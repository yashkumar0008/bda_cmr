const FollowUp = require('../models/FollowUp');
const Activity = require('../models/Activity');

exports.createFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.create({ ...req.body, createdBy: req.user._id });
    await followUp.populate([{ path: 'lead', select: 'companyName contactPerson' }, { path: 'assignedTo', select: 'name email avatar' }]);
    await Activity.create({ user: req.user._id, action: 'Follow-up Added', lead: req.body.lead, description: `Follow-up scheduled: ${req.body.type}` });
    res.status(201).json({ success: true, message: 'Follow-up created', data: { followUp } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFollowUps = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (req.user.role === 'BDA Employee') query.assignedTo = req.user._id;

    const total = await FollowUp.countDocuments(query);
    const followUps = await FollowUp.find(query)
      .populate('lead', 'companyName contactPerson email phone status')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort('date')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: { followUps, total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('lead', 'companyName contactPerson')
      .populate('assignedTo', 'name email avatar');
    if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up not found' });
    res.json({ success: true, message: 'Follow-up updated', data: { followUp } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed', completedAt: new Date(), outcome: req.body.outcome || '' },
      { new: true }
    ).populate('lead', 'companyName contactPerson').populate('assignedTo', 'name email avatar');
    if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up not found' });
    await Activity.create({ user: req.user._id, action: 'Follow-up Completed', lead: followUp.lead?._id, description: `Follow-up completed: ${followUp.type}` });
    res.json({ success: true, message: 'Follow-up completed', data: { followUp } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);
    if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up not found' });
    res.json({ success: true, message: 'Follow-up deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
