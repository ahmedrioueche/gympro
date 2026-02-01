import { UserRole } from '@ahmedrioueche/gympro-client';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AppModule } from '../src/app.module';
import { User } from '../src/common/schemas/user.schema';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>(getModelToken(User.name));

  const adminEmail = 'admin@gympro.com';
  const adminPassword = 'adminpassword123';

  console.log(`🔍 Checking if admin exists...`);

  // Check if admin already exists
  const existingAdmin = await userModel.findOne({
    'profile.email': adminEmail,
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists.');

    // Update role if needed
    if (existingAdmin.role !== UserRole.Admin) {
      existingAdmin.role = UserRole.Admin;
      existingAdmin.dashboardAccess = ['admin']; // Enforce admin-only access
      await existingAdmin.save();
      console.log(
        '✅ Updated existing user to Admin role and fixed dashboard access.',
      );
    } else if (existingAdmin?.dashboardAccess?.includes('member')) {
      // Remove member access if present
      existingAdmin.dashboardAccess = ['admin'];
      await existingAdmin.save();
      console.log('✅ Removed member access from existing admin.');
    }

    await app.close();
    return;
  }

  console.log('🌱 Creating admin user...');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const newAdmin = new userModel({
    profile: {
      username: 'admin',
      email: adminEmail,
      fullName: 'Super Admin',
      password: hashedPassword,
      isValidated: true,
      phoneNumberVerified: true,
      accountStatus: 'active',
      isOnBoarded: true,
      isActive: true,
    },
    role: UserRole.Admin,
    memberships: [],
    dashboardAccess: ['admin'],
    subscriptionHistory: [],
    notifications: [],
    // Provide default empty appPermissions to avoid schema validation errors if any
    appPermissions: [],
  });

  try {
    await newAdmin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }

  await app.close();
}

run();
