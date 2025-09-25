import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
}

export function Input({
  error = false,
  errorMessage,
  leftIcon,
  rightIcon,
  label,
  helperText,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          className={cn(
            'form-input',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'error border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function PasswordInput({
  showPassword = false,
  onTogglePassword,
  ...props
}: PasswordInputProps) {
  const EyeIcon = () => (
    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={onTogglePassword}
          className="focus:outline-none"
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      }
      {...props}
    />
  );
}