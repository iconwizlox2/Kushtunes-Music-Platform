'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MailIcon,
  ArrowRightIcon,
  EyeIcon
} from '@/components/ui/Icons';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired' | 'already-verified';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = searchParams?.get('token');
    const email = searchParams?.get('email');
    const message = searchParams?.get('message');
    
    if (email && message) {
      // User just registered, show success message
      setStatus('success');
      setMessage(decodeURIComponent(message));
      setUserEmail(decodeURIComponent(email));
      return;
    }
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        setUserEmail(data.data.user.email);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        if (data.message.includes('expired')) {
          setStatus('expired');
        } else if (data.message.includes('already verified')) {
          setStatus('already-verified');
        } else {
          setStatus('error');
        }
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  const resendVerification = async () => {
    if (!userEmail) return;
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('A new verification email has been sent to your email address.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Failed to resend verification email. Please try again.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircleIcon className="h-16 w-16 text-red-500" />;
      case 'already-verified':
        return <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />;
      default:
        return <MailIcon className="h-16 w-16 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'expired':
        return 'text-red-600';
      case 'already-verified':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      case 'expired':
        return 'Link Expired';
      case 'already-verified':
        return 'Already Verified';
      default:
        return 'Verifying Email...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {getStatusTitle()}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500">Please wait while we verify your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  {userEmail && !searchParams?.get('token') 
                    ? 'Please check your email and click the verification link to complete your account setup.'
                    : 'You\'ll be redirected to your dashboard in a few seconds...'
                  }
                </p>
              </div>
              
              {userEmail && !searchParams?.get('token') ? (
                <div className="space-y-3">
                  <button
                    onClick={resendVerification}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <MailIcon className="h-5 w-5" />
                    <span>Resend Verification Email</span>
                  </button>
                  
                  <Link href="/login">
                    <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2">
                      <EyeIcon className="h-5 w-5" />
                      <span>Back to Login</span>
                    </button>
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard">
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2">
                    <span>Go to Dashboard</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </Link>
              )}
            </div>
          )}

          {(status === 'error' || status === 'expired') && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  {status === 'expired' 
                    ? 'This verification link has expired. Please request a new one.'
                    : 'There was an issue verifying your email. Please try again.'
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MailIcon className="h-5 w-5" />
                  <span>Resend Verification Email</span>
                </button>
                
                <Link href="/login">
                  <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2">
                    <EyeIcon className="h-5 w-5" />
                    <span>Back to Login</span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {status === 'already-verified' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-700">
                  Your email is already verified. You can proceed to login.
                </p>
              </div>
              
              <Link href="/login">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2">
                  <EyeIcon className="h-5 w-5" />
                  <span>Go to Login</span>
                </button>
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@kushtunes.com" className="text-blue-600 hover:underline">
                support@kushtunes.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}