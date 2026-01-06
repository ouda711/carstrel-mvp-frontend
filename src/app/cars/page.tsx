'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carsAPI } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCar, FaFilter, FaWhatsapp, FaSearch, FaTimes, FaGasPump, FaCog } from 'react-icons/fa';

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
  location?: string;
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Get current filter values from URL
  const currentMake = searchParams.get('make') || '';
  const currentTransmission = searchParams.get('transmission') || '';
  const currentFuelType = searchParams.get('fuel_type') || '';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  // Local state for filters
  const [selectedMake, setSelectedMake] = useState(currentMake);
  const [selectedTransmission, setSelectedTransmission] = useState(currentTransmission);
  const [selectedFuelType, setSelectedFuelType] = useState(currentFuelType);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedSort, setSelectedSort] = useState(currentSort);

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

      // Add all filter params
      if (currentMake) params.make = currentMake;
      if (currentTransmission) params.transmission = currentTransmission;
      if (currentFuelType) params.fuel_type = currentFuelType;
      if (currentMinPrice) params.min_price = currentMinPrice;
      if (currentMaxPrice) params.max_price = currentMaxPrice;
      if (currentSearch) params.search = currentSearch;
      if (currentSort) params.sort = currentSort;

      const response = await carsAPI.getAll(params) as unknown as CarsResponse;
      setCars(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentMake, currentTransmission, currentFuelType, currentMinPrice, currentMaxPrice, currentSearch, currentSort]);

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
    params.set('sort', selectedSort);
    params.set('page', '1');

    router.push(`/cars?${params.toString()}`);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSelectedMake('');
    setSelectedTransmission('');
    setSelectedFuelType('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSelectedSort('newest');
    router.push('/cars');
    setMobileFiltersOpen(false);
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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentMake) count++;
    if (currentTransmission) count++;
    if (currentFuelType) count++;
    if (currentMinPrice || currentMaxPrice) count++;
    if (currentSearch) count++;
    if (currentSort !== 'newest') count++;
    return count;
  }, [currentMake, currentTransmission, currentFuelType, currentMinPrice, currentMaxPrice, currentSearch, currentSort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Simpler version */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarStrel
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition text-sm"
              >
                List Your Car Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg w-full justify-center"
          >
            <FaFilter />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cars..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="year_new">Year: Newest</option>
                  <option value="year_old">Year: Oldest</option>
                </select>
              </div>

              {/* Make */}
              <div className="mb-6">
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
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTransmission(selectedTransmission === 'Manual' ? '' : 'Manual')}
                    className={`flex-1 px-3 py-2 border rounded-lg transition ${selectedTransmission === 'Manual' ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    Manual
                  </button>
                  <button
                    onClick={() => setSelectedTransmission(selectedTransmission === 'Automatic' ? '' : 'Automatic')}
                    className={`flex-1 px-3 py-2 border rounded-lg transition ${selectedTransmission === 'Automatic' ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    Automatic
                  </button>
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => setSelectedFuelType(selectedFuelType === fuel ? '' : fuel)}
                      className={`px-3 py-2 border rounded-lg text-sm transition ${selectedFuelType === fuel ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
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

              {/* Apply Button */}
              <button
                onClick={applyFilters}
                className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition shadow-sm hover:shadow"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Cars in Kenya</h1>
                  <p className="text-gray-600">
                    {pagination ? `Showing ${cars.length} of ${pagination.total} available cars` : 'Loading cars...'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium rounded-lg transition text-sm flex items-center gap-2"
                  >
                    <FaCar />
                    Sell Your Car
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {currentMake && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    Make: {currentMake}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('make');
                        router.push(`/cars?${params.toString()}`);
                      }}
                      className="ml-1 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  </span>
                )}
                {currentTransmission && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {currentTransmission}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('transmission');
                        router.push(`/cars?${params.toString()}`);
                      }}
                      className="ml-1 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  </span>
                )}
                {currentFuelType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {currentFuelType}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('fuel_type');
                        router.push(`/cars?${params.toString()}`);
                      }}
                      className="ml-1 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  </span>
                )}
                {(currentMinPrice || currentMaxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    Price: {currentMinPrice ? `KES ${currentMinPrice}` : ''}{currentMinPrice && currentMaxPrice ? ' - ' : ''}{currentMaxPrice ? `KES ${currentMaxPrice}` : ''}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('min_price');
                        params.delete('max_price');
                        router.push(`/cars?${params.toString()}`);
                      }}
                      className="ml-1 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    Search: &quot;{currentSearch}&quot;
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('search');
                        router.push(`/cars?${params.toString()}`);
                      }}
                      className="ml-1 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Cars Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <div key={car.id} className="group">
                      <Link href={`/cars/${car.slug}`}>
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100">
                          <div className="relative h-56 bg-gray-100">
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
                                <FaCar className="text-4xl" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                  {car.make} {car.model}
                                </h3>
                                <p className="text-gray-600 text-sm">{car.year}</p>
                              </div>
                              <span className="text-lg font-bold text-primary-600">
                                {formatPrice(car.price)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <FaCog className="text-gray-400" />
                                {car.transmission}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaGasPump className="text-gray-400" />
                                {car.fuel_type}
                              </span>
                              <span>{formatMileage(car.mileage)}</span>
                            </div>

                            {car.location && (
                              <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                📍 {car.location}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                View Details →
                              </button>
                              <span className="text-xs text-gray-500">
                                Click to view full details
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-sm">
                      Page {pagination.page} of {pagination.total_pages}
                    </p>
                    <div className="flex gap-2">
                      {pagination.page > 1 && (
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', (pagination.page - 1).toString());
                            router.push(`/cars?${params.toString()}`);
                          }}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Previous
                        </button>
                      )}
                      {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (pagination.total_pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.total_pages - 2) {
                          pageNum = pagination.total_pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString());
                              params.set('page', pageNum.toString());
                              router.push(`/cars?${params.toString()}`);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              pageNum === pagination.page
                                ? 'bg-primary-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.page < pagination.total_pages && (
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', (pagination.page + 1).toString());
                            router.push(`/cars?${params.toString()}`);
                          }}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaCar className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {activeFilterCount > 0 
                    ? "No cars match your current filters. Try adjusting your search criteria."
                    : "No cars are currently listed. Be the first to list your car!"}
                </p>
                {activeFilterCount > 0 ? (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
                  >
                    Clear all filters
                  </button>
                ) : (
                  <Link
                    href="/register"
                    className="inline-block px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
                  >
                    List Your Car Free
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Mobile Filter Content - Same as desktop but vertical */}
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cars..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="year_new">Year: Newest</option>
                    <option value="year_old">Year: Oldest</option>
                  </select>
                </div>

                {/* Make */}
                <div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Manual', 'Automatic'].map((transmission) => (
                      <button
                        key={transmission}
                        onClick={() => setSelectedTransmission(selectedTransmission === transmission ? '' : transmission)}
                        className={`px-3 py-2 border rounded-lg transition ${selectedTransmission === transmission ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        {transmission}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
                      <button
                        key={fuel}
                        onClick={() => setSelectedFuelType(selectedFuelType === fuel ? '' : fuel)}
                        className={`px-3 py-2 border rounded-lg text-sm transition ${selectedFuelType === fuel ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (KES)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6 -mx-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}