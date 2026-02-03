require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser');
const logger = require('./config/logger');

async function seedAdminUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polytechnic-sis');
    logger.info('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      logger.info('Demo admin user already exists');
      console.log('Demo admin user already exists');
    } else {
      // Create demo admin user
      const demoAdmin = new AdminUser({
        username: 'admin',
        email: 'admin@polytechnic.edu',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        managedBranches: ['All'],
        permissions: ['create', 'read', 'update', 'delete'],
        isActive: true
      });

      await demoAdmin.save();
      logger.info('Demo admin user created successfully');
      console.log('✓ Demo admin user created:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Seed error:', error);
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedAdminUsers();
