'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCar, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';

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
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2 hover:opacity-80 transition">
              <FaCar className="text-3xl" />
              <span>CarStrel</span>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCar className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Dealer Account</h1>
              <p className="text-gray-600">Free forever for car dealers</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Location <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Nairobi, Mombasa Road"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
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
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400"
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
                    <span className={formData.password.length >= 8 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <FaCheck className={`mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <FaCheck className={`mr-2 ${/\d/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={/\d/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-500'}>
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
                  I agree to CarStrel&apos;s{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span style={{ color: 'white' }}>Creating account...</span>
                  </>
                ) : (
                  <span style={{ color: 'white' }}>Create Free Account</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
