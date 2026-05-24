const express = require('express');
const router = express.Router();
const { createLead, getLeads, getLead, updateLead, deleteLead, assignLead, updateLeadStatus, uploadAttachment, getDashboardStats, getPipelineLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/stats', getDashboardStats);
router.get('/pipeline', getPipelineLeads);
router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);
router.put('/:id/assign', authorize('Admin', 'Sales Manager'), assignLead);
router.put('/:id/status', updateLeadStatus);
router.post('/:id/attachments', uploadAttachment);

module.exports = router;
