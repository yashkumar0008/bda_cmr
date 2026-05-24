const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload({ useTempFiles: false, limits: { fileSize: 10 * 1024 * 1024 } }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/followups', require('./routes/followUpRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'BDA CRM API is running' }));

app.use(errorHandler);

module.exports = app;
