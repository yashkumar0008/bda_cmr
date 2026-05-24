const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: ['Lead Created', 'Lead Updated', 'Status Changed', 'Lead Assigned', 'Follow-up Added',
           'Follow-up Completed', 'Lead Deleted', 'Note Added', 'Attachment Added', 'Deal Won', 'Deal Lost'],
    required: true
  },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
  description: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
