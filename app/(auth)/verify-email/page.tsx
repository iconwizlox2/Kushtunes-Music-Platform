'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProfessionalLayout } from '@/components/ProfessionalLayout';
import {
  ProfessionalCard,
  ProfessionalButton,
  LoadingSpinner
} from '@/components/ProfessionalUI';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MailIcon,
  ArrowRightIcon
} from '@/components/ui/Icons';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || null;
  const email = searchParams?.get('email') || null;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'missing'>('loading');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setStatus('missing');
      setMessage('Missing verification token or email');
      return;
    }

    // Auto-verify when page loads
    handleVerification();
  }, [token, email]);

  const handleVerification = async () => {
    if (!token || !email) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(result.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Email verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    if (!email) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage(result.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <LoadingSpinner className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your email address has been successfully verified. You can now access all features of Kushtunes.
            </p>
            <div className="space-y-3">
              <ProfessionalButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </ProfessionalButton>
              <ProfessionalButton
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Music
              </ProfessionalButton>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <ProfessionalButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={resendVerification}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MailIcon className="mr-2 h-5 w-5" />
                    Resend Verification Email
                  </>
                )}
              </ProfessionalButton>
              <ProfessionalButton
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                Back to Login
              </ProfessionalButton>
            </div>
          </div>
        );

      case 'missing':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 mb-6">
              This verification link is invalid or has expired. Please request a new verification email.
            </p>
            <div className="space-y-3">
              <ProfessionalButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </ProfessionalButton>
              <ProfessionalButton
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/register'}
              >
                Create New Account
              </ProfessionalButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProfessionalLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <ProfessionalCard className="p-8">
            {renderContent()}
          </ProfessionalCard>
          
          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <Link href="/support" className="font-medium text-blue-600 hover:text-blue-500">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
}
