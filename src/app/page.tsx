'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { carsAPI } from '@/lib/api';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  slug: string;
  primary_image?: {
    url: string;
    thumbnail_url: string;
  };
}

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [latestCars, setLatestCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const [featured, latest] = await Promise.all([
        carsAPI.getFeatured(6),
        carsAPI.getLatest(6),
      ]);
      setFeaturedCars(featured.data || []);
      setLatestCars(latest.data || []);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarStrel
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/cars" className="text-gray-700 hover:text-primary-600 font-medium transition">
                Browse Cars
              </Link>
              <Link href="/for-dealers" className="text-gray-700 hover:text-primary-600 font-medium transition">
                For Dealers
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition">
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Car<br />
            <span className="text-primary-600">in Kenya</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse trusted car dealers across Kenya. Quality vehicles, transparent pricing, direct contact with sellers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cars"
              className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-200"
            >
              Browse All Cars
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-lg border-2 border-gray-300 transition duration-200"
            >
              I am a Dealer
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Cars</h2>
            <p className="text-gray-600 mt-1">Most viewed vehicles this week</p>
          </div>
          <Link href="/cars" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.slug}`} className="group">
                <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    {car.primary_image ? (
                      <img
                        src={car.primary_image.thumbnail_url || car.primary_image.url}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{car.year}</p>
                    <p className="text-xl font-bold text-primary-600">
                      {formatPrice(car.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured cars available yet.</p>
          </div>
        )}
      </section>

      {/* Latest Cars Section */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Listings</h2>
            <p className="text-gray-600 mt-1">Recently added vehicles</p>
          </div>
          <Link href="/cars" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : latestCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.slug}`} className="group">
                <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    {car.primary_image ? (
                      <img
                        src={car.primary_image.thumbnail_url || car.primary_image.url}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{car.year}</p>
                    <p className="text-xl font-bold text-primary-600">
                      {formatPrice(car.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No cars available yet.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Are You a Car Dealer?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            List your cars for free and reach thousands of buyers across Kenya
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold text-lg rounded-lg hover:bg-gray-100 transition"
          >
            Start Selling Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 CarStrel. Built for Kenyan car dealers.</p>
        </div>
      </footer>
    </div>
  );
}