"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MusicalNoteIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@/components/ui/Icons';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How long does it take for my music to go live on streaming platforms?',
    answer: 'Most releases go live within 7-14 business days. Spotify typically takes 3-5 days, Apple Music 1-7 days, and other platforms vary. We recommend submitting your release at least 2 weeks before your planned release date to ensure it\'s live on time.',
    category: 'Distribution'
  },
  {
    id: '2',
    question: 'What audio formats do you accept?',
    answer: 'We accept WAV, FLAC, and high-quality MP3 files (320kbps minimum). We recommend WAV or FLAC for the best quality. Files should be stereo, 44.1kHz/16-bit or higher. We do not accept files with watermarks or low-quality conversions.',
    category: 'Upload'
  },
  {
    id: '3',
    question: 'How much commission does Kushtunes take?',
    answer: 'Kushtunes takes a 10% commission on all royalties earned from streaming platforms. This means you keep 90% of your earnings. There are no upfront costs, annual fees, or hidden charges.',
    category: 'Pricing'
  },
  {
    id: '4',
    question: 'When do I get paid and what\'s the minimum payout?',
    answer: 'We process payouts monthly on the 15th of each month for earnings from the previous month. The minimum payout threshold is $50. Payments are made via bank transfer, PayPal, or other supported payment methods.',
    category: 'Payments'
  },
  {
    id: '5',
    question: 'Can I update my release after it\'s live?',
    answer: 'You can update certain metadata like song titles, artist names, and descriptions. However, audio files cannot be replaced once live - you\'ll need to submit a new release. Cover art can be updated but may take time to reflect across all platforms.',
    category: 'Distribution'
  },
  {
    id: '6',
    question: 'What happens if my release gets rejected?',
    answer: 'If a platform rejects your release, we\'ll notify you with the specific reason. Common issues include audio quality problems, metadata errors, or copyright concerns. You can fix the issues and resubmit without additional fees.',
    category: 'Distribution'
  },
  {
    id: '7',
    question: 'Do you provide ISRC and UPC codes?',
    answer: 'Yes! We automatically generate ISRC codes for each track and UPC codes for each release at no additional cost. These codes are essential for tracking and royalty collection.',
    category: 'Distribution'
  },
  {
    id: '8',
    question: 'Can I distribute cover songs?',
    answer: 'Yes, but you need proper licensing. For cover songs, you\'ll need a mechanical license. We can help you obtain these through our partnership with licensing agencies, though additional fees may apply.',
    category: 'Legal'
  },
  {
    id: '9',
    question: 'How do I remove my music from streaming platforms?',
    answer: 'You can request takedowns through your dashboard. Note that it can take 7-14 days for music to be removed from all platforms. Some platforms may take longer to process takedown requests.',
    category: 'Distribution'
  },
  {
    id: '10',
    question: 'What analytics and reporting do you provide?',
    answer: 'We provide detailed analytics including stream counts, revenue breakdowns by platform and country, demographic data, playlist placements, and trend analysis. Data is updated daily and you can export reports.',
    category: 'Analytics'
  }
];

const categories = ['All', 'Distribution', 'Upload', 'Pricing', 'Payments', 'Analytics', 'Legal'];

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  const filteredFAQs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Your message has been sent! We\'ll get back to you within 24 hours.');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      alert('Failed to send message. Please try again or contact us directly.');
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 pt-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-white mb-4">
            Support &
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Help Center
            </span>
          </h1>
          <p className="text-2xl text-white/80 font-light max-w-3xl mx-auto">
            Get answers to your questions and support for your music distribution journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse FAQs</h3>
            <p className="text-gray-600 mb-4">Find quick answers to common questions</p>
            <a href="#faqs" className="text-blue-600 hover:text-blue-800 font-medium">
              View FAQs →
            </a>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">Get personalized help from our team</p>
            <a href="#contact" className="text-green-600 hover:text-green-800 font-medium">
              Contact Us →
            </a>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Detailed guides and tutorials</p>
            <Link href="/docs" className="text-purple-600 hover:text-purple-800 font-medium">
              View Docs →
            </Link>
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">support@kushtunes.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <ClockIcon className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Response Time</p>
                <p className="text-gray-600">Within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Support Hours</p>
                <p className="text-gray-600">24/7 via email</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div id="faqs" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {openFAQ === faq.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="pl-20">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact" className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Support</h2>
          
          <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                value={contactForm.priority}
                onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low - General question</option>
                <option value="medium">Medium - Account or technical issue</option>
                <option value="high">High - Payment or distribution problem</option>
                <option value="urgent">Urgent - Critical issue affecting releases</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide as much detail as possible about your question or issue..."
              />
            </div>

            <button
              type="submit"
              disabled={submittingForm}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <EnvelopeIcon className="h-5 w-5" />
              <span>{submittingForm ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            <p>Expected response time: <strong>Within 24 hours</strong></p>
            <p className="mt-2">For urgent issues, please include "URGENT" in your subject line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
