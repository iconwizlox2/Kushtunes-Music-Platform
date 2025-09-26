import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

// Utility functions for legacy API routes
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function verifyToken(token: string): Promise<any> {
  // For now, return a mock user - in production you'd verify the JWT
  // This is a temporary solution for legacy API routes
  return { id: 'legacy-user', email: 'legacy@example.com' };
}

export function generateToken(user: any): string {
  // Mock token generation - replace with actual JWT in production
  return 'mock-token-' + Date.now();
}

export function generateSessionToken(user: any): string {
  return generateToken(user);
}

export function createAuthResponse(user: any, token: string) {
  return {
    success: true,
    user: { id: user.id, email: user.email },
    token
  };
}

export function generateEmailVerificationToken(): string {
  return 'verify-' + Math.random().toString(36).substring(2);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
}

export function isValidUsername(username: string): { valid: boolean; message?: string } {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
}

export default NextAuth({
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const email = String(creds.email).toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(String(creds.password), user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name || null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        
        // Get artist info
        if (session.user?.email) {
          const u = await prisma.user.findUnique({ where: { email: session.user.email } });
          if (u) {
            const artist = await prisma.artist.upsert({
              where: { userId: u.id },
              update: {},
              create: { 
                userId: u.id, 
                email: u.email, 
                name: u.name || u.email.split("@")[0], 
                legalName: u.name || u.email.split("@")[0],
                country: "GB" 
              },
              select: { id: true, role: true, name: true },
            });
            (session as any).user.artistId = artist?.id || null;
            (session as any).user.role = artist?.role || "user";
          }
        }
      }
      return session;
    },
  },
});