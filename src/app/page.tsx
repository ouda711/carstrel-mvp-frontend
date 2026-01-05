'use client';

import Link from 'next/link';
import { FaWhatsapp, FaCar, FaLink, FaShareAlt, FaCheck } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarStrel
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/cars" 
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Browse Cars
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                How It Works
              </Link>
              <Link 
                href="#for-dealers" 
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                For Dealers
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition shadow-sm hover:shadow"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                The Free Inventory Tool for <span className="text-primary-600">Kenyan Car Dealers</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Stop managing cars in messy Excel sheets and WhatsApp chats. Add your cars once, get professional shareable links you can use everywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                >
                  Get Started For Free
                </Link>
                <Link
                  href="/cars"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-lg border-2 border-gray-300 transition flex items-center justify-center gap-2"
                >
                  Browse Marketplace
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>2-minute setup</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Mockup showing CarStrel listing being shared on WhatsApp */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaCar className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold">AutoConnect Kenya</div>
                      <div className="text-sm text-gray-500">Car Dealer</div>
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Car listing preview"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Toyota Fielder 2015</span>
                      <span className="font-bold text-primary-600 text-lg">KES 950,000</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📏 85,000 km</span>
                      <span>⚙️ Automatic</span>
                      <span>⛽ Petrol</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="text-sm text-gray-500">Shared via CarStrel</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>carstrel.com/cars/toyota-fielder-2015-k3m9x2</span>
                  <FaWhatsapp className="text-green-500 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sell Cars 10x Faster
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to transform how you sell cars
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCar className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Add Your Car</h3>
              <p className="text-gray-600">
                Fill a simple form with photos and specs. Takes 3 minutes per car.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLink className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Get Your Link</h3>
              <p className="text-gray-600">
                Instantly generate a beautiful, detailed car page that works on any device.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShareAlt className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Share & Sell</h3>
              <p className="text-gray-600">
                Share the link on WhatsApp, Facebook, Instagram, or anywhere. Track all leads in one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Dealers Love CarStrel
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-3">Sell More Cars</h3>
                <p className="text-gray-600">
                  Professional listings build trust with buyers. Clear details mean fewer questions and faster sales.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl mb-4">⏱️</div>
                <h3 className="text-xl font-bold mb-3">Save Hours Weekly</h3>
                <p className="text-gray-600">
                  No more answering the same questions repeatedly. All information is in one shareable link.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-3">Track Everything</h3>
                <p className="text-gray-600">
                  See how many people viewed your cars and manage all inquiries in one organized dashboard.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-2xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-3">WhatsApp-First</h3>
                <p className="text-gray-600">
                  Built for how Kenyans buy and sell cars. One-click sharing to WhatsApp with pre-filled messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Dealers CTA Section */}
      <section id="for-dealers" className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Car Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the growing number of Kenyan dealers using CarStrel to sell cars faster and smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-primary-600 font-semibold text-lg rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/cars"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white/10 transition"
            >
              See Example Listings
            </Link>
          </div>

          <div className="mt-8 text-white/80">
            <p>✓ No setup fees • ✓ No credit card required • ✓ Free forever for dealers</p>
          </div>
        </div>
      </section>

      {/* Simple Marketplace Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Quality Cars
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              See how CarStrel listings look to buyers
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition"
            >
              Browse All Cars
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CarStrel</h3>
              <p className="text-gray-400">
                The free inventory management tool for Kenyan car dealers.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Dealers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white transition">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Log In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/cars" className="hover:text-white transition">Browse Cars</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CarStrel. Built for Kenyan car dealers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}