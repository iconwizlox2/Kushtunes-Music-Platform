import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export const metadata: Metadata = { 
  title: "Reset Password - Kushtunes",
  description: "Set a new password for your Kushtunes account"
};

async function doReset(formData: FormData) {
  "use server";
  const token = String(formData.get("token") || "");
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  if (!token || !email || password.length < 8) throw new Error("Invalid data");

  const vt = await prisma.verificationToken.findUnique({ where: { token } });
  if (!vt || vt.identifier !== email || vt.expires < new Date()) throw new Error("Invalid or expired link");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  // Redirect to login after reset
  redirect("/login?message=Password updated successfully. Please sign in.");
}

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string; email?: string } }) {
  const token = searchParams?.token || "";
  const email = searchParams?.email || "";
  
  if (!token || !email) {
    redirect("/forgot-password");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <a className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 group" href="/">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 mr-3 rotate-180 group-hover:-translate-x-1 transition-transform">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
            </svg>
            <span className="font-semibold">Back to Home</span>
          </a>
          
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-white">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Set New<span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Password</span>
          </h1>
          <p className="text-xl text-white/80 font-light">Choose a strong password for your account</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
          <form action={doReset} className="space-y-6">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="email" value={email} />
            
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-3">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-white/60">
                    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
                  </svg>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  minLength={8}
                  required 
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg" 
                  placeholder="Enter new password" 
                />
              </div>
              <p className="text-white/60 text-sm mt-2">Password must be at least 8 characters long</p>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Update Password
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-white/80 font-medium">
                Remember your password? <a className="text-blue-400 hover:text-blue-300 font-bold transition-colors" href="/login">Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
