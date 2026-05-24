const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getUsers);
router.route('/:id').get(getUser).put(authorize('Admin'), updateUser).delete(authorize('Admin'), deleteUser);

module.exports = router;
