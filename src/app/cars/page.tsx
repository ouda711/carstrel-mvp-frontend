'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carsAPI } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  transmission: string;
  fuel_type: string;
  slug: string;
  primary_image?: {
    url: string;
    thumbnail_url: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface CarsResponse {
  success: boolean;
  data: Car[];
  pagination: Pagination;
}

interface MakesResponse {
  success: boolean;
  data: string[];
}

export default function CarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [cars, setCars] = useState<Car[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  
  // Filters
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMakes();
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: searchParams.get('page') || 1,
        limit: 12,
      };

      if (searchParams.get('make')) params.make = searchParams.get('make')!;
      if (searchParams.get('transmission')) params.transmission = searchParams.get('transmission')!;
      if (searchParams.get('fuel_type')) params.fuel_type = searchParams.get('fuel_type')!;
      if (searchParams.get('min_price')) params.min_price = searchParams.get('min_price')!;
      if (searchParams.get('max_price')) params.max_price = searchParams.get('max_price')!;
      if (searchParams.get('search')) params.search = searchParams.get('search')!;

      const response = await carsAPI.getAll(params) as unknown as CarsResponse;
      setCars(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const fetchMakes = async () => {
    try {
      const response = await carsAPI.getMakes() as unknown as MakesResponse;
      setMakes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch makes:', error);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedMake) params.set('make', selectedMake);
    if (selectedTransmission) params.set('transmission', selectedTransmission);
    if (selectedFuelType) params.set('fuel_type', selectedFuelType);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', '1');

    router.push(`/cars?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedMake('');
    setSelectedTransmission('');
    setSelectedFuelType('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    router.push('/cars');
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-KE').format(mileage) + ' km';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarStrel
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
              >
                For Dealers
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Make */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">All Makes</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (KES)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={applyFilters}
                className="w-full mb-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
              >
                Clear All
              </button>
            </div>
          </aside>

          {/* Cars Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Cars</h1>
              {pagination && (
                <p className="text-gray-600">
                  Showing {cars.length} of {pagination.total} cars
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <Link key={car.id} href={`/cars/${car.slug}`} className="group">
                      <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition overflow-hidden">
                        <div className="relative h-48 bg-gray-200">
                          {car.primary_image ? (
                            <Image
                              src={car.primary_image.thumbnail_url || car.primary_image.url}
                              alt={`${car.make} ${car.model}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition duration-300"
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
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span>{formatMileage(car.mileage)}</span>
                            <span>•</span>
                            <span>{car.transmission}</span>
                            <span>•</span>
                            <span>{car.fuel_type}</span>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {formatPrice(car.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('page', page.toString());
                          router.push(`/cars?${params.toString()}`);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          page === pagination.page
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No cars found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}