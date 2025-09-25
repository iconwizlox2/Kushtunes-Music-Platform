import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    // Simple security check
    if (secret !== 'create-admin-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const createdAccounts = [];

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
        createdAccounts.push({
          email: account.email,
          status: 'already_exists',
          message: 'Admin account already exists'
        });
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
          role: account.role as any,
          isEmailVerified: account.isEmailVerified,
          isActive: account.isActive
        }
      });

      createdAccounts.push({
        email: account.email,
        username: account.username,
        password: account.password,
        status: 'created',
        message: 'Admin account created successfully'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin accounts processed',
      accounts: createdAccounts
    });

  } catch (error) {
    console.error('Error creating admin accounts:', error);
    return NextResponse.json(
      { error: 'Failed to create admin accounts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
