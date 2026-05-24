require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({ name: 'Admin User', email: 'admin@bdacrm.com', password: 'Admin@123', role: 'Admin' });
  const manager = await User.create({ name: 'Sarah Johnson', email: 'sarah@bdacrm.com', password: 'Sarah@123', role: 'Sales Manager', phone: '+1-234-567-8900', department: 'Sales' });
  const bda1 = await User.create({ name: 'Raj Sharma', email: 'raj@bdacrm.com', password: 'Raj@123', role: 'BDA Employee', phone: '+1-234-567-8901', department: 'Business Dev' });
  const bda2 = await User.create({ name: 'Priya Patel', email: 'priya@bdacrm.com', password: 'Priya@123', role: 'BDA Employee', phone: '+1-234-567-8902', department: 'Business Dev' });

  const leads = [
    { companyName: 'Tata Steel Ltd', contactPerson: 'Arjun Mehta', email: 'arjun@tatasteel.com', phone: '+91-9876543210', industry: 'Manufacturing', dealValue: 500000, leadSource: 'Trade Show', status: 'Won', priority: 'High', assignedTo: bda1._id, createdBy: admin._id },
    { companyName: 'Mahindra Logistics', contactPerson: 'Deepika Nair', email: 'd.nair@mahindra.com', phone: '+91-9876543211', industry: 'Logistics', dealValue: 250000, leadSource: 'Referral', status: 'Negotiation', priority: 'Critical', assignedTo: bda2._id, createdBy: manager._id },
    { companyName: 'AutoParts India', contactPerson: 'Vikram Singh', email: 'v.singh@autoparts.in', phone: '+91-9876543212', industry: 'Automotive', dealValue: 180000, leadSource: 'Cold Call', status: 'Proposal Sent', priority: 'High', assignedTo: bda1._id, createdBy: admin._id },
    { companyName: 'FreshFarm Foods', contactPerson: 'Sunita Rao', email: 'sunita@freshfarm.com', phone: '+91-9876543213', industry: 'Food & Beverage', dealValue: 120000, leadSource: 'Website', status: 'Contacted', priority: 'Medium', assignedTo: bda2._id, createdBy: manager._id },
    { companyName: 'BuildRight Construction', contactPerson: 'Rahul Gupta', email: 'rahul@buildright.com', phone: '+91-9876543214', industry: 'Construction', dealValue: 450000, leadSource: 'Social Media', status: 'New Lead', priority: 'Medium', createdBy: admin._id },
    { companyName: 'MediCore Healthcare', contactPerson: 'Dr. Anita Kumar', email: 'anita@medicore.com', phone: '+91-9876543215', industry: 'Healthcare', dealValue: 320000, leadSource: 'Email Campaign', status: 'Won', priority: 'High', assignedTo: bda1._id, createdBy: admin._id },
    { companyName: 'TechVision Systems', contactPerson: 'Kiran Joshi', email: 'kiran@techvision.in', phone: '+91-9876543216', industry: 'Technology', dealValue: 95000, leadSource: 'Referral', status: 'Lost', priority: 'Low', assignedTo: bda2._id, createdBy: manager._id },
    { companyName: 'RetailMax Chain', contactPerson: 'Meena Shah', email: 'meena@retailmax.com', phone: '+91-9876543217', industry: 'Retail', dealValue: 200000, leadSource: 'Trade Show', status: 'Negotiation', priority: 'Critical', assignedTo: bda1._id, createdBy: admin._id },
  ];

  await Lead.insertMany(leads);

  console.log('✅ Seed complete!');
  console.log('Admin: admin@bdacrm.com / Admin@123');
  console.log('Manager: sarah@bdacrm.com / Sarah@123');
  console.log('BDA: raj@bdacrm.com / Raj@123');
  console.log('BDA: priya@bdacrm.com / Priya@123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
