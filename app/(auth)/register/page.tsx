'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  MailIcon,
  ArrowRightIcon,
  MusicalNoteIcon
} from '@/components/ui/Icons';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  artistType: 'artist' | 'label';
  legalName: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'GB',
    artistType: 'artist',
    legalName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          artistType: formData.artistType,
          legalName: formData.legalName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to verification page with email info
        const email = formData.email;
        router.push(`/verify-email?email=${encodeURIComponent(email)}&message=${encodeURIComponent(data.message)}`);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 group">
            <ArrowRightIcon className="h-5 w-5 mr-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Join
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kushtunes
            </span>
          </h1>
          <p className="text-xl text-white/80 font-light">Start your music distribution journey</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-6 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl animate-fade-in">
                <p className="text-red-200 font-semibold text-center">{error}</p>
              </div>
            )}

            {/* Artist Type Selection */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('artistType', 'artist')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.artistType === 'artist'
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/30 bg-white/10 text-white/80 hover:border-white/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Artist</div>
                    <div className="text-sm opacity-80">Individual creator</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('artistType', 'label')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.artistType === 'label'
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/30 bg-white/10 text-white/80 hover:border-white/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Label</div>
                    <div className="text-sm opacity-80">Music label</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-3">
                {formData.artistType === 'artist' ? 'Artist Name' : 'Label Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-6 w-6 text-white/60" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder={formData.artistType === 'artist' ? 'Enter your artist name' : 'Enter your label name'}
                />
              </div>
            </div>

            {/* Legal Name Field */}
            <div>
              <label htmlFor="legalName" className="block text-sm font-bold text-white mb-3">
                Legal Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-6 w-6 text-white/60" />
                </div>
                <input
                  id="legalName"
                  name="legalName"
                  type="text"
                  required
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Enter your legal name for contracts"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-3">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailIcon className="h-6 w-6 text-white/60" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-6 w-6 text-white/60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6 text-white/60 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-6 w-6 text-white/60 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-6 w-6 text-white/60" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-6 w-6 text-white/60 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-6 w-6 text-white/60 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block text-sm font-bold text-white mb-3">
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg appearance-none"
                >
                  <option value="GB" className="bg-gray-800 text-white">United Kingdom</option>
                  <option value="US" className="bg-gray-800 text-white">United States</option>
                  <option value="CA" className="bg-gray-800 text-white">Canada</option>
                  <option value="AU" className="bg-gray-800 text-white">Australia</option>
                  <option value="DE" className="bg-gray-800 text-white">Germany</option>
                  <option value="FR" className="bg-gray-800 text-white">France</option>
                  <option value="ES" className="bg-gray-800 text-white">Spain</option>
                  <option value="IT" className="bg-gray-800 text-white">Italy</option>
                  <option value="NL" className="bg-gray-800 text-white">Netherlands</option>
                  <option value="SE" className="bg-gray-800 text-white">Sweden</option>
                  <option value="NO" className="bg-gray-800 text-white">Norway</option>
                  <option value="DK" className="bg-gray-800 text-white">Denmark</option>
                  <option value="FI" className="bg-gray-800 text-white">Finland</option>
                  <option value="JP" className="bg-gray-800 text-white">Japan</option>
                  <option value="KR" className="bg-gray-800 text-white">South Korea</option>
                  <option value="BR" className="bg-gray-800 text-white">Brazil</option>
                  <option value="MX" className="bg-gray-800 text-white">Mexico</option>
                  <option value="IN" className="bg-gray-800 text-white">India</option>
                  <option value="CN" className="bg-gray-800 text-white">China</option>
                  <option value="RU" className="bg-gray-800 text-white">Russia</option>
                  <option value="ZA" className="bg-gray-800 text-white">South Africa</option>
                  <option value="NG" className="bg-gray-800 text-white">Nigeria</option>
                  <option value="EG" className="bg-gray-800 text-white">Egypt</option>
                  <option value="AR" className="bg-gray-800 text-white">Argentina</option>
                  <option value="CL" className="bg-gray-800 text-white">Chile</option>
                  <option value="CO" className="bg-gray-800 text-white">Colombia</option>
                  <option value="PE" className="bg-gray-800 text-white">Peru</option>
                  <option value="VE" className="bg-gray-800 text-white">Venezuela</option>
                  <option value="EC" className="bg-gray-800 text-white">Ecuador</option>
                  <option value="UY" className="bg-gray-800 text-white">Uruguay</option>
                  <option value="PY" className="bg-gray-800 text-white">Paraguay</option>
                  <option value="BO" className="bg-gray-800 text-white">Bolivia</option>
                  <option value="GT" className="bg-gray-800 text-white">Guatemala</option>
                  <option value="CU" className="bg-gray-800 text-white">Cuba</option>
                  <option value="JM" className="bg-gray-800 text-white">Jamaica</option>
                  <option value="TT" className="bg-gray-800 text-white">Trinidad and Tobago</option>
                  <option value="BB" className="bg-gray-800 text-white">Barbados</option>
                  <option value="BS" className="bg-gray-800 text-white">Bahamas</option>
                  <option value="BZ" className="bg-gray-800 text-white">Belize</option>
                  <option value="CR" className="bg-gray-800 text-white">Costa Rica</option>
                  <option value="PA" className="bg-gray-800 text-white">Panama</option>
                  <option value="HN" className="bg-gray-800 text-white">Honduras</option>
                  <option value="SV" className="bg-gray-800 text-white">El Salvador</option>
                  <option value="NI" className="bg-gray-800 text-white">Nicaragua</option>
                  <option value="DO" className="bg-gray-800 text-white">Dominican Republic</option>
                  <option value="HT" className="bg-gray-800 text-white">Haiti</option>
                  <option value="PR" className="bg-gray-800 text-white">Puerto Rico</option>
                  <option value="VI" className="bg-gray-800 text-white">Virgin Islands</option>
                  <option value="AG" className="bg-gray-800 text-white">Antigua and Barbuda</option>
                  <option value="DM" className="bg-gray-800 text-white">Dominica</option>
                  <option value="GD" className="bg-gray-800 text-white">Grenada</option>
                  <option value="KN" className="bg-gray-800 text-white">Saint Kitts and Nevis</option>
                  <option value="LC" className="bg-gray-800 text-white">Saint Lucia</option>
                  <option value="VC" className="bg-gray-800 text-white">Saint Vincent and the Grenadines</option>
                  <option value="SR" className="bg-gray-800 text-white">Suriname</option>
                  <option value="GY" className="bg-gray-800 text-white">Guyana</option>
                  <option value="GF" className="bg-gray-800 text-white">French Guiana</option>
                  <option value="FK" className="bg-gray-800 text-white">Falkland Islands</option>
                  <option value="GS" className="bg-gray-800 text-white">South Georgia and the South Sandwich Islands</option>
                  <option value="BV" className="bg-gray-800 text-white">Bouvet Island</option>
                  <option value="HM" className="bg-gray-800 text-white">Heard Island and McDonald Islands</option>
                  <option value="AQ" className="bg-gray-800 text-white">Antarctica</option>
                  <option value="TF" className="bg-gray-800 text-white">French Southern Territories</option>
                  <option value="IO" className="bg-gray-800 text-white">British Indian Ocean Territory</option>
                  <option value="CX" className="bg-gray-800 text-white">Christmas Island</option>
                  <option value="CC" className="bg-gray-800 text-white">Cocos (Keeling) Islands</option>
                  <option value="NF" className="bg-gray-800 text-white">Norfolk Island</option>
                  <option value="NC" className="bg-gray-800 text-white">New Caledonia</option>
                  <option value="PF" className="bg-gray-800 text-white">French Polynesia</option>
                  <option value="WF" className="bg-gray-800 text-white">Wallis and Futuna</option>
                  <option value="AS" className="bg-gray-800 text-white">American Samoa</option>
                  <option value="GU" className="bg-gray-800 text-white">Guam</option>
                  <option value="MP" className="bg-gray-800 text-white">Northern Mariana Islands</option>
                  <option value="MH" className="bg-gray-800 text-white">Marshall Islands</option>
                  <option value="FM" className="bg-gray-800 text-white">Micronesia</option>
                  <option value="PW" className="bg-gray-800 text-white">Palau</option>
                  <option value="KI" className="bg-gray-800 text-white">Kiribati</option>
                  <option value="TV" className="bg-gray-800 text-white">Tuvalu</option>
                  <option value="NR" className="bg-gray-800 text-white">Nauru</option>
                  <option value="VU" className="bg-gray-800 text-white">Vanuatu</option>
                  <option value="SB" className="bg-gray-800 text-white">Solomon Islands</option>
                  <option value="PG" className="bg-gray-800 text-white">Papua New Guinea</option>
                  <option value="FJ" className="bg-gray-800 text-white">Fiji</option>
                  <option value="TO" className="bg-gray-800 text-white">Tonga</option>
                  <option value="WS" className="bg-gray-800 text-white">Samoa</option>
                  <option value="CK" className="bg-gray-800 text-white">Cook Islands</option>
                  <option value="NU" className="bg-gray-800 text-white">Niue</option>
                  <option value="TK" className="bg-gray-800 text-white">Tokelau</option>
                  <option value="PN" className="bg-gray-800 text-white">Pitcairn</option>
                  <option value="SH" className="bg-gray-800 text-white">Saint Helena</option>
                  <option value="AC" className="bg-gray-800 text-white">Ascension Island</option>
                  <option value="TA" className="bg-gray-800 text-white">Tristan da Cunha</option>
                  <option value="AD" className="bg-gray-800 text-white">Andorra</option>
                  <option value="AL" className="bg-gray-800 text-white">Albania</option>
                  <option value="AT" className="bg-gray-800 text-white">Austria</option>
                  <option value="BY" className="bg-gray-800 text-white">Belarus</option>
                  <option value="BE" className="bg-gray-800 text-white">Belgium</option>
                  <option value="BA" className="bg-gray-800 text-white">Bosnia and Herzegovina</option>
                  <option value="BG" className="bg-gray-800 text-white">Bulgaria</option>
                  <option value="HR" className="bg-gray-800 text-white">Croatia</option>
                  <option value="CY" className="bg-gray-800 text-white">Cyprus</option>
                  <option value="CZ" className="bg-gray-800 text-white">Czech Republic</option>
                  <option value="EE" className="bg-gray-800 text-white">Estonia</option>
                  <option value="GR" className="bg-gray-800 text-white">Greece</option>
                  <option value="HU" className="bg-gray-800 text-white">Hungary</option>
                  <option value="IS" className="bg-gray-800 text-white">Iceland</option>
                  <option value="IE" className="bg-gray-800 text-white">Ireland</option>
                  <option value="LV" className="bg-gray-800 text-white">Latvia</option>
                  <option value="LI" className="bg-gray-800 text-white">Liechtenstein</option>
                  <option value="LT" className="bg-gray-800 text-white">Lithuania</option>
                  <option value="LU" className="bg-gray-800 text-white">Luxembourg</option>
                  <option value="MT" className="bg-gray-800 text-white">Malta</option>
                  <option value="MD" className="bg-gray-800 text-white">Moldova</option>
                  <option value="MC" className="bg-gray-800 text-white">Monaco</option>
                  <option value="ME" className="bg-gray-800 text-white">Montenegro</option>
                  <option value="MK" className="bg-gray-800 text-white">North Macedonia</option>
                  <option value="PL" className="bg-gray-800 text-white">Poland</option>
                  <option value="PT" className="bg-gray-800 text-white">Portugal</option>
                  <option value="RO" className="bg-gray-800 text-white">Romania</option>
                  <option value="SM" className="bg-gray-800 text-white">San Marino</option>
                  <option value="RS" className="bg-gray-800 text-white">Serbia</option>
                  <option value="SK" className="bg-gray-800 text-white">Slovakia</option>
                  <option value="SI" className="bg-gray-800 text-white">Slovenia</option>
                  <option value="CH" className="bg-gray-800 text-white">Switzerland</option>
                  <option value="UA" className="bg-gray-800 text-white">Ukraine</option>
                  <option value="VA" className="bg-gray-800 text-white">Vatican City</option>
                  <option value="IL" className="bg-gray-800 text-white">Israel</option>
                  <option value="PS" className="bg-gray-800 text-white">Palestine</option>
                  <option value="JO" className="bg-gray-800 text-white">Jordan</option>
                  <option value="LB" className="bg-gray-800 text-white">Lebanon</option>
                  <option value="SY" className="bg-gray-800 text-white">Syria</option>
                  <option value="IQ" className="bg-gray-800 text-white">Iraq</option>
                  <option value="IR" className="bg-gray-800 text-white">Iran</option>
                  <option value="KW" className="bg-gray-800 text-white">Kuwait</option>
                  <option value="SA" className="bg-gray-800 text-white">Saudi Arabia</option>
                  <option value="AE" className="bg-gray-800 text-white">United Arab Emirates</option>
                  <option value="QA" className="bg-gray-800 text-white">Qatar</option>
                  <option value="BH" className="bg-gray-800 text-white">Bahrain</option>
                  <option value="OM" className="bg-gray-800 text-white">Oman</option>
                  <option value="YE" className="bg-gray-800 text-white">Yemen</option>
                  <option value="AF" className="bg-gray-800 text-white">Afghanistan</option>
                  <option value="PK" className="bg-gray-800 text-white">Pakistan</option>
                  <option value="BD" className="bg-gray-800 text-white">Bangladesh</option>
                  <option value="LK" className="bg-gray-800 text-white">Sri Lanka</option>
                  <option value="MV" className="bg-gray-800 text-white">Maldives</option>
                  <option value="BT" className="bg-gray-800 text-white">Bhutan</option>
                  <option value="NP" className="bg-gray-800 text-white">Nepal</option>
                  <option value="MM" className="bg-gray-800 text-white">Myanmar</option>
                  <option value="TH" className="bg-gray-800 text-white">Thailand</option>
                  <option value="LA" className="bg-gray-800 text-white">Laos</option>
                  <option value="KH" className="bg-gray-800 text-white">Cambodia</option>
                  <option value="VN" className="bg-gray-800 text-white">Vietnam</option>
                  <option value="MY" className="bg-gray-800 text-white">Malaysia</option>
                  <option value="SG" className="bg-gray-800 text-white">Singapore</option>
                  <option value="BN" className="bg-gray-800 text-white">Brunei</option>
                  <option value="ID" className="bg-gray-800 text-white">Indonesia</option>
                  <option value="TL" className="bg-gray-800 text-white">East Timor</option>
                  <option value="PH" className="bg-gray-800 text-white">Philippines</option>
                  <option value="TW" className="bg-gray-800 text-white">Taiwan</option>
                  <option value="HK" className="bg-gray-800 text-white">Hong Kong</option>
                  <option value="MO" className="bg-gray-800 text-white">Macau</option>
                  <option value="MN" className="bg-gray-800 text-white">Mongolia</option>
                  <option value="KZ" className="bg-gray-800 text-white">Kazakhstan</option>
                  <option value="KG" className="bg-gray-800 text-white">Kyrgyzstan</option>
                  <option value="TJ" className="bg-gray-800 text-white">Tajikistan</option>
                  <option value="TM" className="bg-gray-800 text-white">Turkmenistan</option>
                  <option value="UZ" className="bg-gray-800 text-white">Uzbekistan</option>
                  <option value="GE" className="bg-gray-800 text-white">Georgia</option>
                  <option value="AM" className="bg-gray-800 text-white">Armenia</option>
                  <option value="AZ" className="bg-gray-800 text-white">Azerbaijan</option>
                  <option value="TR" className="bg-gray-800 text-white">Turkey</option>
                  <option value="DZ" className="bg-gray-800 text-white">Algeria</option>
                  <option value="TN" className="bg-gray-800 text-white">Tunisia</option>
                  <option value="LY" className="bg-gray-800 text-white">Libya</option>
                  <option value="MA" className="bg-gray-800 text-white">Morocco</option>
                  <option value="SD" className="bg-gray-800 text-white">Sudan</option>
                  <option value="SS" className="bg-gray-800 text-white">South Sudan</option>
                  <option value="ET" className="bg-gray-800 text-white">Ethiopia</option>
                  <option value="ER" className="bg-gray-800 text-white">Eritrea</option>
                  <option value="DJ" className="bg-gray-800 text-white">Djibouti</option>
                  <option value="SO" className="bg-gray-800 text-white">Somalia</option>
                  <option value="KE" className="bg-gray-800 text-white">Kenya</option>
                  <option value="UG" className="bg-gray-800 text-white">Uganda</option>
                  <option value="TZ" className="bg-gray-800 text-white">Tanzania</option>
                  <option value="RW" className="bg-gray-800 text-white">Rwanda</option>
                  <option value="BI" className="bg-gray-800 text-white">Burundi</option>
                  <option value="CD" className="bg-gray-800 text-white">Democratic Republic of the Congo</option>
                  <option value="CG" className="bg-gray-800 text-white">Republic of the Congo</option>
                  <option value="CF" className="bg-gray-800 text-white">Central African Republic</option>
                  <option value="CM" className="bg-gray-800 text-white">Cameroon</option>
                  <option value="TD" className="bg-gray-800 text-white">Chad</option>
                  <option value="NE" className="bg-gray-800 text-white">Niger</option>
                  <option value="ML" className="bg-gray-800 text-white">Mali</option>
                  <option value="BF" className="bg-gray-800 text-white">Burkina Faso</option>
                  <option value="CI" className="bg-gray-800 text-white">Ivory Coast</option>
                  <option value="GH" className="bg-gray-800 text-white">Ghana</option>
                  <option value="TG" className="bg-gray-800 text-white">Togo</option>
                  <option value="BJ" className="bg-gray-800 text-white">Benin</option>
                  <option value="SN" className="bg-gray-800 text-white">Senegal</option>
                  <option value="GM" className="bg-gray-800 text-white">Gambia</option>
                  <option value="GN" className="bg-gray-800 text-white">Guinea</option>
                  <option value="GW" className="bg-gray-800 text-white">Guinea-Bissau</option>
                  <option value="SL" className="bg-gray-800 text-white">Sierra Leone</option>
                  <option value="LR" className="bg-gray-800 text-white">Liberia</option>
                  <option value="MR" className="bg-gray-800 text-white">Mauritania</option>
                  <option value="ML" className="bg-gray-800 text-white">Mali</option>
                  <option value="BF" className="bg-gray-800 text-white">Burkina Faso</option>
                  <option value="CI" className="bg-gray-800 text-white">Ivory Coast</option>
                  <option value="GH" className="bg-gray-800 text-white">Ghana</option>
                  <option value="TG" className="bg-gray-800 text-white">Togo</option>
                  <option value="BJ" className="bg-gray-800 text-white">Benin</option>
                  <option value="SN" className="bg-gray-800 text-white">Senegal</option>
                  <option value="GM" className="bg-gray-800 text-white">Gambia</option>
                  <option value="GN" className="bg-gray-800 text-white">Guinea</option>
                  <option value="GW" className="bg-gray-800 text-white">Guinea-Bissau</option>
                  <option value="SL" className="bg-gray-800 text-white">Sierra Leone</option>
                  <option value="LR" className="bg-gray-800 text-white">Liberia</option>
                  <option value="MR" className="bg-gray-800 text-white">Mauritania</option>
                  <option value="DZ" className="bg-gray-800 text-white">Algeria</option>
                  <option value="TN" className="bg-gray-800 text-white">Tunisia</option>
                  <option value="LY" className="bg-gray-800 text-white">Libya</option>
                  <option value="MA" className="bg-gray-800 text-white">Morocco</option>
                  <option value="SD" className="bg-gray-800 text-white">Sudan</option>
                  <option value="SS" className="bg-gray-800 text-white">South Sudan</option>
                  <option value="ET" className="bg-gray-800 text-white">Ethiopia</option>
                  <option value="ER" className="bg-gray-800 text-white">Eritrea</option>
                  <option value="DJ" className="bg-gray-800 text-white">Djibouti</option>
                  <option value="SO" className="bg-gray-800 text-white">Somalia</option>
                  <option value="KE" className="bg-gray-800 text-white">Kenya</option>
                  <option value="UG" className="bg-gray-800 text-white">Uganda</option>
                  <option value="TZ" className="bg-gray-800 text-white">Tanzania</option>
                  <option value="RW" className="bg-gray-800 text-white">Rwanda</option>
                  <option value="BI" className="bg-gray-800 text-white">Burundi</option>
                  <option value="CD" className="bg-gray-800 text-white">Democratic Republic of the Congo</option>
                  <option value="CG" className="bg-gray-800 text-white">Republic of the Congo</option>
                  <option value="CF" className="bg-gray-800 text-white">Central African Republic</option>
                  <option value="CM" className="bg-gray-800 text-white">Cameroon</option>
                  <option value="TD" className="bg-gray-800 text-white">Chad</option>
                  <option value="NE" className="bg-gray-800 text-white">Niger</option>
                  <option value="ML" className="bg-gray-800 text-white">Mali</option>
                  <option value="BF" className="bg-gray-800 text-white">Burkina Faso</option>
                  <option value="CI" className="bg-gray-800 text-white">Ivory Coast</option>
                  <option value="GH" className="bg-gray-800 text-white">Ghana</option>
                  <option value="TG" className="bg-gray-800 text-white">Togo</option>
                  <option value="BJ" className="bg-gray-800 text-white">Benin</option>
                  <option value="SN" className="bg-gray-800 text-white">Senegal</option>
                  <option value="GM" className="bg-gray-800 text-white">Gambia</option>
                  <option value="GN" className="bg-gray-800 text-white">Guinea</option>
                  <option value="GW" className="bg-gray-800 text-white">Guinea-Bissau</option>
                  <option value="SL" className="bg-gray-800 text-white">Sierra Leone</option>
                  <option value="LR" className="bg-gray-800 text-white">Liberia</option>
                  <option value="MR" className="bg-gray-800 text-white">Mauritania</option>
                  <option value="DZ" className="bg-gray-800 text-white">Algeria</option>
                  <option value="TN" className="bg-gray-800 text-white">Tunisia</option>
                  <option value="LY" className="bg-gray-800 text-white">Libya</option>
                  <option value="MA" className="bg-gray-800 text-white">Morocco</option>
                  <option value="SD" className="bg-gray-800 text-white">Sudan</option>
                  <option value="SS" className="bg-gray-800 text-white">South Sudan</option>
                  <option value="ET" className="bg-gray-800 text-white">Ethiopia</option>
                  <option value="ER" className="bg-gray-800 text-white">Eritrea</option>
                  <option value="DJ" className="bg-gray-800 text-white">Djibouti</option>
                  <option value="SO" className="bg-gray-800 text-white">Somalia</option>
                  <option value="KE" className="bg-gray-800 text-white">Kenya</option>
                  <option value="UG" className="bg-gray-800 text-white">Uganda</option>
                  <option value="TZ" className="bg-gray-800 text-white">Tanzania</option>
                  <option value="RW" className="bg-gray-800 text-white">Rwanda</option>
                  <option value="BI" className="bg-gray-800 text-white">Burundi</option>
                  <option value="CD" className="bg-gray-800 text-white">Democratic Republic of the Congo</option>
                  <option value="CG" className="bg-gray-800 text-white">Republic of the Congo</option>
                  <option value="CF" className="bg-gray-800 text-white">Central African Republic</option>
                  <option value="CM" className="bg-gray-800 text-white">Cameroon</option>
                  <option value="TD" className="bg-gray-800 text-white">Chad</option>
                  <option value="NE" className="bg-gray-800 text-white">Niger</option>
                  <option value="ML" className="bg-gray-800 text-white">Mali</option>
                  <option value="BF" className="bg-gray-800 text-white">Burkina Faso</option>
                  <option value="CI" className="bg-gray-800 text-white">Ivory Coast</option>
                  <option value="GH" className="bg-gray-800 text-white">Ghana</option>
                  <option value="TG" className="bg-gray-800 text-white">Togo</option>
                  <option value="BJ" className="bg-gray-800 text-white">Benin</option>
                  <option value="SN" className="bg-gray-800 text-white">Senegal</option>
                  <option value="GM" className="bg-gray-800 text-white">Gambia</option>
                  <option value="GN" className="bg-gray-800 text-white">Guinea</option>
                  <option value="GW" className="bg-gray-800 text-white">Guinea-Bissau</option>
                  <option value="SL" className="bg-gray-800 text-white">Sierra Leone</option>
                  <option value="LR" className="bg-gray-800 text-white">Liberia</option>
                  <option value="MR" className="bg-gray-800 text-white">Mauritania</option>
                </select>
              </div>
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-white mb-3">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-white/80 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}