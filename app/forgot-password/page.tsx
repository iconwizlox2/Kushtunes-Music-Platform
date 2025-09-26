import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { render } from "@react-email/render";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import { cookies } from "next/headers";
import crypto from "node:crypto";

export const metadata: Metadata = { 
  title: "Forgot Password - Kushtunes",
  description: "Reset your Kushtunes account password"
};

async function sendReset(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").toLowerCase().trim();
  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  // Always act successful to avoid user enumeration
  if (user) {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    // Delete older tokens for this user
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

    const base = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://kushtunes.com";
    const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    const html = await render(<ResetPasswordEmail url={resetUrl} host={new URL(base).host} />);
    const text = `Reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.`;

    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
    });
    await transport.sendMail({
      to: email,
      from: process.env.SMTP_USER!,
      subject: "Reset your Kushtunes password",
      html, text,
    });
  }

  // flash a short-lived cookie to show success message
  cookies().set("fp_ok", "1", { path: "/forgot-password", maxAge: 30, sameSite: "lax" });
}

export default function ForgotPasswordPage() {
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
            Forgot<span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Password?</span>
          </h1>
          <p className="text-xl text-white/80 font-light">Enter your email and we'll send you a reset link</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
          <form action={sendReset} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-3">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-white/60">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                  </svg>
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg" 
                  placeholder="Enter your email" 
                />
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Send Reset Link
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
