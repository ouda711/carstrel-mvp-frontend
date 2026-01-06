'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { carsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  transmission: string;
  fuel_type: string;
  status: string;
  slug: string;
  view_count: number;
  created_at: string;
  primary_image?: {
    url: string;
    thumbnail_url: string;
  };
  image_count?: number;
}

export default function MyCarsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, available, sold, reserved
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (user) {
      fetchCars();
    }
  }, [user]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await carsAPI.getMyCars();
      setCars(response.data || []);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (carId: string, newStatus: string) => {
    try {
      await carsAPI.updateStatus(carId, newStatus);
      toast.success(`Car marked as ${newStatus}`);
      fetchCars(); // Refresh list
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(message);
    }
  };

  const handleDelete = async (carId: string, carName: string) => {
    if (!confirm(`Are you sure you want to delete ${carName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await carsAPI.delete(carId);
      toast.success('Car deleted successfully');
      fetchCars(); // Refresh list
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete car';
      toast.error(message);
    }
  };

  const copyShareLink = (slug: string) => {
    const link = `${window.location.origin}/cars/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const shareOnWhatsApp = (car: Car) => {
    const text = encodeURIComponent(
      `Check out my ${car.make} ${car.model} ${car.year} - ${formatPrice(car.price)} 🚗\n\n${window.location.origin}/cars/${car.slug}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
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

  const getStatusBadge = (status: string) => {
    const styles = {
      Available: 'bg-green-100 text-green-800',
      Sold: 'bg-gray-100 text-gray-800',
      Reserved: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const filteredCars = cars.filter((car) => {
    if (filter === 'all') return true;
    return car.status.toLowerCase() === filter.toLowerCase();
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
              <p className="text-sm text-gray-600">Manage your inventory</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                ← Dashboard
              </Link>
              <Link
                href="/dashboard/cars/new"
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
              >
                + Add New Car
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({cars.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'available'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Available ({cars.filter((c) => c.status === 'Available').length})
            </button>
            <button
              onClick={() => setFilter('sold')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'sold'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sold ({cars.filter((c) => c.status === 'Sold').length})
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cars Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Image */}
                  <Link href={`/cars/${car.slug}`} target="_blank" className="block relative h-48 bg-gray-200">
                    {car.primary_image ? (
                      <img
                        src={car.primary_image.thumbnail_url || car.primary_image.url}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(car.status)}`}>
                      {car.status}
                    </span>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/cars/${car.slug}`} target="_blank" className="hover:text-primary-600">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {car.make} {car.model}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{car.year}</p>
                    <p className="text-xl font-bold text-primary-600 mb-3">
                      {formatPrice(car.price)}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span title="Views">👁️ {car.view_count}</span>
                      <span title="Mileage">📏 {formatMileage(car.mileage)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => shareOnWhatsApp(car)}
                        className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
                        title="Share on WhatsApp"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => copyShareLink(car.slug)}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                        title="Copy link"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="mt-2 flex gap-2">
                      {car.status === 'Available' && (
                        <button
                          onClick={() => handleStatusUpdate(car.id, 'Sold')}
                          className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition"
                        >
                          Mark Sold
                        </button>
                      )}
                      {car.status === 'Sold' && (
                        <button
                          onClick={() => handleStatusUpdate(car.id, 'Available')}
                          className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium rounded-lg transition"
                        >
                          Mark Available
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(car.id, `${car.make} ${car.model} ${car.year}`)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link href={`/cars/${car.slug}`} target="_blank" className="flex items-center gap-3 hover:text-primary-600">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                              {car.primary_image ? (
                                <img
                                  src={car.primary_image.thumbnail_url || car.primary_image.url}
                                  alt={`${car.make} ${car.model}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {car.make} {car.model}
                              </p>
                              <p className="text-sm text-gray-600">{car.year}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-900">{formatPrice(car.price)}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(car.status)}`}>
                            {car.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          👁️ {car.view_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => shareOnWhatsApp(car)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Share on WhatsApp"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => copyShareLink(car.slug)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                              title="Copy link"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            {car.status === 'Available' ? (
                              <button
                                onClick={() => handleStatusUpdate(car.id, 'Sold')}
                                className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium rounded-lg transition"
                              >
                                Mark Sold
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusUpdate(car.id, 'Available')}
                                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium rounded-lg transition"
                              >
                                Available
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(car.id, `${car.make} ${car.model} ${car.year}`)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          // Empty State
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No cars yet' : `No ${filter} cars`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Start by adding your first car to your inventory'
                : `You don't have any ${filter} cars at the moment`}
            </p>
            {filter === 'all' ? (
              <Link
                href="/dashboard/cars/new"
                className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition"
              >
                Add Your First Car
              </Link>
            ) : (
              <button
                onClick={() => setFilter('all')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all cars
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}