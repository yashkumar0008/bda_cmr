const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: [true, 'Follow-up date is required'] },
  type: {
    type: String,
    enum: ['Call', 'Email', 'Meeting', 'Demo', 'Follow-up', 'Proposal', 'Other'],
    default: 'Call'
  },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Pending' },
  completedAt: { type: Date, default: null },
  outcome: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
