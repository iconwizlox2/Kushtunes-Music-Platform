const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('./lib/auth');

const prisma = new PrismaClient();

async function createAdminAccounts() {
  try {
    console.log('🚀 Creating sample admin accounts...');

    // Sample admin accounts
    const adminAccounts = [
      {
        email: 'admin@kushtunes.com',
        username: 'admin',
        password: 'Admin123!',
        firstName: 'Kush',
        lastName: 'Admin',
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true
      },
      {
        email: 'superadmin@kushtunes.com',
        username: 'superadmin',
        password: 'SuperAdmin123!',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true
      },
      {
        email: 'demo@kushtunes.com',
        username: 'demo',
        password: 'Demo123!',
        firstName: 'Demo',
        lastName: 'User',
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true
      }
    ];

    for (const account of adminAccounts) {
      // Check if admin already exists
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: account.email },
            { username: account.username }
          ]
        }
      });

      if (existingAdmin) {
        console.log(`⚠️  Admin ${account.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await hashPassword(account.password);

      // Create admin account
      const admin = await prisma.user.create({
        data: {
          email: account.email,
          username: account.username,
          password: hashedPassword,
          firstName: account.firstName,
          lastName: account.lastName,
          role: account.role,
          isEmailVerified: account.isEmailVerified,
          isActive: account.isActive
        }
      });

      console.log(`✅ Created admin account: ${account.email}`);
    }

    console.log('🎉 All admin accounts created successfully!');
    
    // Display login credentials
    console.log('\n📋 Sample Admin Login Credentials:');
    console.log('=====================================');
    adminAccounts.forEach((account, index) => {
      console.log(`\n${index + 1}. ${account.firstName} ${account.lastName}`);
      console.log(`   Email: ${account.email}`);
      console.log(`   Username: ${account.username}`);
      console.log(`   Password: ${account.password}`);
      console.log(`   Role: ${account.role}`);
    });

  } catch (error) {
    console.error('❌ Error creating admin accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminAccounts();
