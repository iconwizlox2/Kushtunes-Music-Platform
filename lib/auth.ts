import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

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