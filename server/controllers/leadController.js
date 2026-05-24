const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const cloudinary = require('../config/cloudinary');

const logActivity = async (userId, action, leadId, description, metadata = {}) => {
  try {
    await Activity.create({ user: userId, action, lead: leadId, description, metadata });
  } catch (e) { console.error('Activity log error:', e); }
};

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user._id });
    await lead.populate(['assignedTo', 'createdBy'], 'name email avatar');
    await logActivity(req.user._id, 'Lead Created', lead._id, `New lead created: ${lead.companyName}`);
    res.status(201).json({ success: true, message: 'Lead created successfully', data: { lead } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { search, status, priority, industry, assignedTo, leadSource, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (industry) query.industry = industry;
    if (assignedTo) query.assignedTo = assignedTo;
    if (leadSource) query.leadSource = leadSource;

    if (req.user.role === 'BDA Employee') query.assignedTo = req.user._id;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: { leads, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: { lead } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const oldStatus = lead.status;
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');

    if (oldStatus !== updated.status) {
      await logActivity(req.user._id, 'Status Changed', lead._id, `Status: ${oldStatus} → ${updated.status}`, { from: oldStatus, to: updated.status });
    } else {
      await logActivity(req.user._id, 'Lead Updated', lead._id, `Lead updated: ${lead.companyName}`);
    }

    res.json({ success: true, message: 'Lead updated', data: { lead: updated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    if (req.user.role === 'BDA Employee') return res.status(403).json({ success: false, message: 'Not authorized' });

    // Delete attachments from cloudinary
    for (const att of lead.attachments) {
      if (att.publicId) await cloudinary.uploader.destroy(att.publicId);
    }

    await lead.deleteOne();
    await logActivity(req.user._id, 'Lead Deleted', null, `Lead deleted: ${lead.companyName}`);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { assignedTo }, { new: true })
      .populate('assignedTo', 'name email avatar');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    await logActivity(req.user._id, 'Lead Assigned', lead._id, `Lead assigned to ${lead.assignedTo?.name}`);
    res.json({ success: true, message: 'Lead assigned', data: { lead } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();
    await lead.populate('assignedTo', 'name email avatar');
    await logActivity(req.user._id, 'Status Changed', lead._id, `Status: ${oldStatus} → ${status}`, { from: oldStatus, to: status });
    res.json({ success: true, message: 'Status updated', data: { lead } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.files || !req.files.attachment) return res.status(400).json({ success: false, message: 'No file' });
    const file = req.files.attachment;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const result = await cloudinary.uploader.upload(file.tempFilePath || `data:${file.mimetype};base64,${file.data.toString('base64')}`, { folder: 'bda_crm/attachments' });
    lead.attachments.push({ url: result.secure_url, publicId: result.public_id, name: file.name });
    await lead.save();
    await logActivity(req.user._id, 'Attachment Added', lead._id, `File attached: ${file.name}`);
    res.json({ success: true, message: 'Attachment uploaded', data: { attachment: lead.attachments[lead.attachments.length - 1] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const matchQuery = req.user.role === 'BDA Employee' ? { assignedTo: req.user._id } : {};
    const [total, won, lost, contacted, proposal, negotiation] = await Promise.all([
      Lead.countDocuments(matchQuery),
      Lead.countDocuments({ ...matchQuery, status: 'Won' }),
      Lead.countDocuments({ ...matchQuery, status: 'Lost' }),
      Lead.countDocuments({ ...matchQuery, status: 'Contacted' }),
      Lead.countDocuments({ ...matchQuery, status: 'Proposal Sent' }),
      Lead.countDocuments({ ...matchQuery, status: 'Negotiation' }),
    ]);

    const revenueResult = await Lead.aggregate([
      { $match: { ...matchQuery, status: 'Won' } },
      { $group: { _id: null, total: { $sum: '$dealValue' } } }
    ]);

    const pendingFollowUps = await Lead.countDocuments({ ...matchQuery, followUpDate: { $gte: new Date() }, status: { $nin: ['Won', 'Lost'] } });

    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, '$dealValue', 0] } } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({ success: true, data: {
      stats: { total, active: total - won - lost, won, lost, contacted, proposal, negotiation, revenue: revenueResult[0]?.total || 0, pendingFollowUps },
      monthlyLeads
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPipelineLeads = async (req, res) => {
  try {
    const matchQuery = req.user.role === 'BDA Employee' ? { assignedTo: req.user._id } : {};
    const leads = await Lead.find(matchQuery)
      .populate('assignedTo', 'name email avatar')
      .sort('-updatedAt');
    const pipeline = {
      'New Lead': leads.filter(l => l.status === 'New Lead'),
      'Contacted': leads.filter(l => l.status === 'Contacted'),
      'Proposal Sent': leads.filter(l => l.status === 'Proposal Sent'),
      'Negotiation': leads.filter(l => l.status === 'Negotiation'),
      'Won': leads.filter(l => l.status === 'Won'),
      'Lost': leads.filter(l => l.status === 'Lost'),
    };
    res.json({ success: true, data: { pipeline } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
