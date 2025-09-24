"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModernLayout } from '@/components/ModernLayout';
import { 
  LockClosedIcon, 
  UserIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@/components/ui/Icons';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage (in production, use secure storage)
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ModernLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 float-animation blur-xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-20 float-animation-delayed blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 float-animation blur-xl"></div>

        <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur-sm mb-6">
                <LockClosedIcon className="h-4 w-4" />
                Admin Access
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h1>
              
              <p className="text-lg text-gray-300">
                Sign in to access the admin dashboard
              </p>
            </div>

            {/* Login Form */}
            <div className="premium-card rounded-3xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="admin@kushtunes.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-xl bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500 px-8 py-4 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                  <h3 className="text-blue-400 font-medium">Demo Credentials</h3>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><strong>Email:</strong> admin@kushtunes.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}

