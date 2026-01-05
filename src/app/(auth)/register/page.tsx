'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCar, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash, FaCheck, FaWhatsapp } from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    dealership_name: '',
    phone_number: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format with Kenyan format
    if (value.length > 0) {
      if (value.startsWith('0')) {
        value = '+254' + value.substring(1);
      } else if (!value.startsWith('+')) {
        if (value.length <= 9) {
          value = '+254' + value;
        }
      }
      
      // Format with spaces for readability
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 3) {
        value = '+' + cleaned;
      } else if (cleaned.length <= 6) {
        value = '+' + cleaned.substring(0, 3) + ' ' + cleaned.substring(3);
      } else if (cleaned.length <= 9) {
        value = '+' + cleaned.substring(0, 3) + ' ' + cleaned.substring(3, 6) + ' ' + cleaned.substring(6);
      } else {
        value = '+' + cleaned.substring(0, 3) + ' ' + cleaned.substring(3, 6) + ' ' + cleaned.substring(6, 9) + ' ' + cleaned.substring(9, 12);
      }
    }
    
    setFormData({
      ...formData,
      phone_number: value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaCar className="text-primary-600" />
              CarStrel
            </Link>
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCar className="text-3xl text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Dealer Account</h1>
                <p className="text-gray-600">Get started in 2 minutes. Free forever for car dealers.</p>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealership Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="dealership_name"
                      value={formData.dealership_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., AutoConnect Kenya"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">This will appear on your car listings</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@dealership.co.ke"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        required
                        placeholder="+254 712 345 678"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">We'll use this for WhatsApp communication</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Nairobi, Mombasa Road"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Helps buyers know where you're located</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a secure password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs">
                      <FaCheck className={`mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FaCheck className={`mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FaCheck className={`mr-2 ${/\d/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                        One number
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to CarStrel's{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create Free Account'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column - Benefits & Demo */}
            <div className="space-y-6">
              {/* Benefits Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Dealers Love CarStrel</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <FaWhatsapp className="text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">WhatsApp-First Design</h4>
                      <p className="text-sm text-gray-600">Built for how Kenyans buy and sell cars</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary-600 font-bold">∞</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Free Forever</h4>
                      <p className="text-sm text-gray-600">No hidden fees, no credit card required</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary-600 font-bold">🚀</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">2-Minute Setup</h4>
                      <p className="text-sm text-gray-600">Start listing cars immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary-600 font-bold">📈</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Track Everything</h4>
                      <p className="text-sm text-gray-600">Views, leads, and sales in one dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">See How It Works</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaCar className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Your Dealership Here</div>
                      <div className="text-xs text-gray-500">Car Dealer</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Car Make & Model</span>
                      <span className="font-bold text-primary-600">KES XXX,XXX</span>
                    </div>
                    <div className="text-xs text-gray-500 flex gap-3">
                      <span>📏 XX,XXX km</span>
                      <span>⚙️ Automatic</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-500">Shared via CarStrel</div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Your professional listing on WhatsApp in minutes
                </p>
              </div>

              {/* Trust Badge */}
              <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center gap-4 text-sm text-primary-800">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>100% free</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Made for Kenya</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>No setup fee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              By registering, you confirm this is a legitimate car dealership business in Kenya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}