const express = require('express');
const router = express.Router();
const { createFollowUp, getFollowUps, updateFollowUp, completeFollowUp, deleteFollowUp } = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getFollowUps).post(createFollowUp);
router.route('/:id').put(updateFollowUp).delete(deleteFollowUp);
router.put('/:id/complete', completeFollowUp);

module.exports = router;
