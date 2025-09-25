'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  MailIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@/components/ui/Icons';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface ValidationErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    // Check if Google OAuth is available
    fetch('/api/auth/providers')
      .then(res => res.json())
      .then(data => {
        setGoogleAvailable(!!data.google);
      })
      .catch(() => {
        setGoogleAvailable(false);
      });
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Uppercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Number');
    }

    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Special character');
    }

    return {
      score,
      feedback,
      isValid: score >= 4
    };
  };

  // Username availability checker
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      const result = await response.json();
      setUsernameAvailable(result.available);
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Real-time validation
  const validateField = (field: keyof RegisterFormData, value: string) => {
    const errors: ValidationErrors = { ...validationErrors };

    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Invalid email format';
        } else {
          delete errors.email;
        }
        break;

      case 'username':
        if (value && value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete errors.username;
          if (value) checkUsernameAvailability(value);
        }
        break;

      case 'password':
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
        if (value && !strength.isValid) {
          errors.password = 'Password does not meet requirements';
        } else {
          delete errors.password;
        }
        break;

      case 'confirmPassword':
        if (value && value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;

      case 'firstName':
        if (value && value.length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        } else {
          delete errors.firstName;
        }
        break;

      case 'lastName':
        if (value && value.length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete errors.lastName;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    validateField(field, value);
  };

  const validateForm = () => {
    // Check required fields (username is now optional)
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Email and password are required');
      return false;
    }

    // Check validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the validation errors below');
      return false;
    }

    // Check password strength
    if (!passwordStrength.isValid) {
      setError('Password does not meet security requirements');
      return false;
    }

    // Check username availability (only if username is provided)
    if (formData.username && usernameAvailable === false) {
      setError('Username is already taken');
      return false;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      setError('Google sign-up failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username || null,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: 'US', // Default country
          legalName: `${formData.firstName} ${formData.lastName}` // Use full name as legal name
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Store token in localStorage
        localStorage.setItem('kushtunes_token', result.data.token);
        localStorage.setItem('kushtunes_user', JSON.stringify(result.data.user));
        
        // Send verification email
        try {
          await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
          });
        } catch (error) {
          console.error('Failed to send verification email:', error);
        }
        
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          window.location.href = `/verify-email?token=temp&email=${encodeURIComponent(formData.email)}`;
        }, 2000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully. Please check your email for verification instructions.
              </p>
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Go to Login
                </Link>
                <Link
                  href="/verify-email"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                >
                  Verify Email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              Create Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="text-xl text-white/80 font-light">
              Join Kushtunes and start distributing your music worldwide
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Google Sign Up Button - Always show for better UX */}
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl shadow-lg bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6 text-lg font-semibold"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing up...' : 'Continue with Google'}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 backdrop-blur-sm text-white/70 rounded-full text-base">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`form-input bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 ${validationErrors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`form-input bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 ${validationErrors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`form-input pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 ${validationErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-white/50" />
                  </div>
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-300">{validationErrors.email}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                  Username <span className="text-white/60 text-sm">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`form-input pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 ${validationErrors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Choose a username"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-white/50" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {isCheckingUsername ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    ) : usernameAvailable === true ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                    ) : usernameAvailable === false ? (
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
                    ) : null}
                  </div>
                </div>
                
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-white/60">
                    Leave blank to use your email as username
                  </p>
                  {usernameAvailable === true && (
                    <span className="text-xs text-green-400 font-medium">Available</span>
                  )}
                  {usernameAvailable === false && (
                    <span className="text-xs text-red-400 font-medium">Taken</span>
                  )}
                </div>
                
                {validationErrors.username && (
                  <p className="mt-1 text-xs text-red-300">{validationErrors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`form-input pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 ${validationErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Create a password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-white/50" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-white/50 hover:text-white" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-white/50 hover:text-white" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 2 ? 'bg-red-400' :
                            passwordStrength.score <= 3 ? 'bg-yellow-400' :
                            passwordStrength.score <= 4 ? 'bg-blue-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-300' :
                        passwordStrength.score <= 3 ? 'text-yellow-300' :
                        passwordStrength.score <= 4 ? 'text-blue-300' : 'text-green-300'
                      }`}>
                        {passwordStrength.score <= 2 ? 'Weak' :
                         passwordStrength.score <= 3 ? 'Fair' :
                         passwordStrength.score <= 4 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-white/70">
                        <p className="mb-1">Password requirements:</p>
                        <ul className="space-y-1">
                          {passwordStrength.feedback.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <span className="text-red-400 mr-1">✗</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {passwordStrength.isValid && (
                      <div className="text-xs text-green-400 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Password meets all requirements
                      </div>
                    )}
                  </div>
                )}
                
                {validationErrors.password && (
                  <p className="mt-1 text-xs text-red-300">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`form-input pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-400 focus:border-blue-400 ${validationErrors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-white/50" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-white/50 hover:text-white" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-white/50 hover:text-white" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-300">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-white/30 rounded mt-1 bg-white/10"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-white/80">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-premium w-full text-lg py-3"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
