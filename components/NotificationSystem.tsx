"use client";

import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@/components/ui/Icons';

export function NotificationSystem() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    state.notifications.forEach(notification => {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 5000);
    });
  }, [state.notifications, dispatch]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  if (state.notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm w-full ${getBgColor(notification.type)} 
            border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {notification.message}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


