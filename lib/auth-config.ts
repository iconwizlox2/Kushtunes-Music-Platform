import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Add additional user data to session
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            avatar: true,
            bio: true,
            website: true,
            location: true,
            isEmailVerified: true,
          },
        });
        
        if (dbUser) {
          session.user = { ...session.user, ...dbUser };
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email!,
                username: user.email!.split('@')[0],
                firstName: user.name?.split(' ')[0] || null,
                lastName: user.name?.split(' ').slice(1).join(' ') || null,
                avatar: user.image,
                isEmailVerified: true,
                role: 'ARTIST',
                isActive: true,
              },
            });
          } else {
            // Update existing user with Google info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                avatar: user.image,
                isEmailVerified: true,
              },
            });
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: 'database' as const,
  },
};

export default NextAuth(authOptions);
