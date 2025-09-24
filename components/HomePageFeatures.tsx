"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CloudArrowUpIcon, BoltIcon, MusicalNoteIcon, ChartBarIcon } from './ui/Icons';

// Stats Component
export function StatsSection() {
  const [stats, setStats] = useState([
    { label: "Artists", value: "10K+", change: "+12%" },
    { label: "Releases", value: "50K+", change: "+8%" },
    { label: "Streams", value: "100M+", change: "+15%" },
    { label: "Countries", value: "180+", change: "+3%" },
  ]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="group rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-6 text-center shadow-soft hover:shadow-hover transition-all duration-500 card-hover dark:border-slate-800/50 dark:bg-slate-900/80"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {stat.change} this month
          </div>
        </div>
      ))}
    </div>
  );
}

// Testimonials Component
export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Milton Kizzy",
      role: "Producer",
      location: "Cairo, Egypt",
      content: "Kushtunes made releasing my music worldwide so easy. The mobile upload process is incredible!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Aya Deng",
      role: "Singer",
      location: "Khartoum, Sudan",
      content: "From the Nile to the World - this platform truly connects African artists globally.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Kwame Asante",
      role: "Musician",
      location: "Accra, Ghana",
      content: "The mobile-first approach is perfect for artists on the go. Love the touch interactions!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          What artists are saying
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Join thousands of creators who trust Kushtunes
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.name}
            className="group rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-soft hover:shadow-hover transition-all duration-500 card-hover dark:border-slate-800/50 dark:bg-slate-900/80"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">{testimonial.location}</div>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 italic">"{testimonial.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pricing Component
export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for new artists",
      features: [
        "Up to 5 releases per month",
        "Basic analytics",
        "Mobile upload",
        "Standard support"
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For growing artists",
      features: [
        "Unlimited releases",
        "Advanced analytics",
        "Priority support",
        "Custom artwork tools",
        "Revenue tracking"
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For labels & studios",
      features: [
        "Everything in Pro",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 support"
      ],
      popular: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Simple, transparent pricing
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Choose the plan that fits your needs
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div 
            key={plan.name}
            className={cn(
              "relative rounded-2xl border p-6 shadow-soft hover:shadow-hover transition-all duration-500 card-hover",
              plan.popular 
                ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20" 
                : "border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{plan.name}</h4>
              <div className="text-3xl font-bold gradient-text mb-1">
                {plan.price}
                {plan.period && <span className="text-lg text-slate-600 dark:text-slate-400">{plan.period}</span>}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className={cn(
              "w-full rounded-xl py-3 font-semibold transition-all duration-300",
              plan.popular
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-hover hover:scale-105"
                : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}>
              {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// How It Works Component
export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Music",
      description: "Upload your WAV/FLAC files and artwork directly from your mobile device",
      icon: <CloudArrowUpIcon className="h-8 w-8" />,
    },
    {
      number: "02", 
      title: "Add Metadata",
      description: "Fill in track details, release date, and distribution territories",
      icon: <MusicalNoteIcon className="h-8 w-8" />,
    },
    {
      number: "03",
      title: "Review & Submit",
      description: "Preview your release and submit for distribution to global platforms",
      icon: <BoltIcon className="h-8 w-8" />,
    },
    {
      number: "04",
      title: "Track Performance",
      description: "Monitor streams, downloads, and earnings in your dashboard",
      icon: <ChartBarIcon className="h-8 w-8" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          How it works
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Get your music out there in 4 simple steps
        </p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div 
            key={step.number}
            className="group text-center"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-slate-100 shadow-soft">
                {step.number}
              </div>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


