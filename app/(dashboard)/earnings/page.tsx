"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon
} from '@/components/ui/Icons';

interface EarningsData {
  totalEarnings: number;
  availableForPayout: number;
  pendingPayments: number;
  nextPayoutDate: string;
  statements: Statement[];
  transactions: Transaction[];
}

interface Statement {
  id: string;
  period: string;
  totalEarnings: number;
  platforms: PlatformEarning[];
  downloadUrl: string;
  generatedAt: string;
}

interface PlatformEarning {
  platform: string;
  streams: number;
  revenue: number;
  royaltyRate: number;
}

interface Transaction {
  id: string;
  type: 'EARNINGS' | 'PAYOUT' | 'COMMISSION';
  amount: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  release?: string;
  platform?: string;
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [payoutRequesting, setPayoutRequesting] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('kushtunes_token');
      if (!token) return;

      const response = await fetch('/api/earnings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEarnings(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      // Set mock data for demo
      setEarnings({
        totalEarnings: 1247.83,
        availableForPayout: 1127.50,
        pendingPayments: 120.33,
        nextPayoutDate: '2025-02-15',
        statements: [
          {
            id: '1',
            period: 'January 2025',
            totalEarnings: 342.17,
            platforms: [
              { platform: 'Spotify', streams: 25420, revenue: 152.30, royaltyRate: 0.90 },
              { platform: 'Apple Music', streams: 18230, revenue: 124.45, royaltyRate: 0.90 },
              { platform: 'Amazon Music', streams: 8940, revenue: 45.22, royaltyRate: 0.90 },
              { platform: 'YouTube Music', streams: 6780, revenue: 20.20, royaltyRate: 0.90 }
            ],
            downloadUrl: '/api/statements/1/download',
            generatedAt: '2025-02-01T00:00:00Z'
          },
          {
            id: '2',
            period: 'December 2024',
            totalEarnings: 298.65,
            platforms: [
              { platform: 'Spotify', streams: 22150, revenue: 132.45, royaltyRate: 0.90 },
              { platform: 'Apple Music', streams: 16890, revenue: 108.20, royaltyRate: 0.90 },
              { platform: 'Amazon Music', streams: 7650, revenue: 38.90, royaltyRate: 0.90 },
              { platform: 'YouTube Music', streams: 5210, revenue: 19.10, royaltyRate: 0.90 }
            ],
            downloadUrl: '/api/statements/2/download',
            generatedAt: '2025-01-01T00:00:00Z'
          }
        ],
        transactions: [
          {
            id: '1',
            type: 'EARNINGS',
            amount: 152.30,
            description: 'Spotify streaming royalties - January 2025',
            date: '2025-02-01T00:00:00Z',
            status: 'COMPLETED',
            release: 'Summer Vibes',
            platform: 'Spotify'
          },
          {
            id: '2',
            type: 'PAYOUT',
            amount: -450.00,
            description: 'Monthly payout to bank account',
            date: '2025-01-15T00:00:00Z',
            status: 'COMPLETED'
          },
          {
            id: '3',
            type: 'COMMISSION',
            amount: -15.23,
            description: 'Kushtunes commission (10%)',
            date: '2025-02-01T00:00:00Z',
            status: 'COMPLETED'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    setPayoutRequesting(true);
    try {
      const token = localStorage.getItem('kushtunes_token');
      const response = await fetch('/api/payouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: earnings?.availableForPayout
        })
      });

      if (response.ok) {
        alert('Payout request submitted successfully!');
        fetchEarnings(); // Refresh data
      } else {
        alert('Failed to request payout. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
      alert('Error requesting payout. Please try again.');
    } finally {
      setPayoutRequesting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'PROCESSING': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNINGS': return <ChartBarIcon className="h-4 w-4 text-green-600" />;
      case 'PAYOUT': return <BanknotesIcon className="h-4 w-4 text-blue-600" />;
      case 'COMMISSION': return <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />;
      default: return <CurrencyDollarIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-32">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 pt-32">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-black text-white mb-4">
            Earnings &
            <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Statements
            </span>
          </h1>
          <p className="text-2xl text-white/80 font-light">Track your royalties and manage payouts</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">${earnings?.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available for Payout</p>
                <p className="text-3xl font-bold text-gray-900">${earnings?.availableForPayout.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-gray-900">${earnings?.pendingPayments.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CalendarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Payout</p>
                <p className="text-lg font-bold text-gray-900">
                  {earnings?.nextPayoutDate ? new Date(earnings.nextPayoutDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Request */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Payout</h3>
              <p className="text-gray-600">
                You have ${earnings?.availableForPayout.toFixed(2)} available for payout. 
                Minimum payout amount is $50.00.
              </p>
            </div>
            <button
              onClick={requestPayout}
              disabled={payoutRequesting || (earnings?.availableForPayout || 0) < 50}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <BanknotesIcon className="h-5 w-5" />
              <span>
                {payoutRequesting ? 'Requesting...' : 'Request Payout'}
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/20 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'statements', name: 'Monthly Statements', icon: DocumentTextIcon },
              { id: 'transactions', name: 'Transaction History', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'statements' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Monthly Statements</h3>
            {earnings?.statements.map((statement) => (
              <div key={statement.id} className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{statement.period}</h4>
                    <p className="text-gray-600">Generated on {new Date(statement.generatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${statement.totalEarnings.toFixed(2)}</p>
                    <a
                      href={statement.downloadUrl}
                      download
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statement.platforms.map((platform) => (
                    <div key={platform.platform} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900">{platform.platform}</h5>
                      <p className="text-sm text-gray-600">{platform.streams.toLocaleString()} streams</p>
                      <p className="text-lg font-semibold text-gray-900">${platform.revenue.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Royalty Rate: {(platform.royaltyRate * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Transaction History</h3>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings?.transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="text-sm font-medium text-gray-900">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{transaction.description}</div>
                          {transaction.release && (
                            <div className="text-sm text-gray-500">Release: {transaction.release}</div>
                          )}
                          {transaction.platform && (
                            <div className="text-sm text-gray-500">Platform: {transaction.platform}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
