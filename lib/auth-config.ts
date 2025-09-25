import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Add additional user data to session
        try {
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
        } catch (error) {
          console.error('Error fetching user in session callback:', error);
        }
      }
      return session;
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
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
    error: '/auth/error', // Redirect errors to custom error page
  },
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
