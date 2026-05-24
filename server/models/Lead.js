const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  companyName: { type: String, required: [true, 'Company name is required'], trim: true },
  contactPerson: { type: String, required: [true, 'Contact person is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], lowercase: true },
  phone: { type: String, required: [true, 'Phone is required'] },
  industry: {
    type: String,
    enum: ['Manufacturing', 'Technology', 'Healthcare', 'Finance', 'Retail', 'Construction', 'Automotive', 'Food & Beverage', 'Logistics', 'Other'],
    default: 'Manufacturing'
  },
  dealValue: { type: Number, default: 0, min: 0 },
  leadSource: {
    type: String,
    enum: ['Website', 'Referral', 'Cold Call', 'Trade Show', 'Social Media', 'Email Campaign', 'Other'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
    default: 'New Lead'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  followUpDate: { type: Date, default: null },
  notes: { type: String, default: '' },
  attachments: [{
    url: String,
    publicId: String,
    name: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  lostReason: { type: String, default: '' },
}, { timestamps: true });

leadSchema.index({ companyName: 'text', contactPerson: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
