'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { carsAPI, leadsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface CarImage {
  id: string;
  url: string;
  secure_url: string;
  thumbnail_url: string;
  display_order: number;
}

interface Dealer {
  dealership_name: string;
  phone_number: string;
  email: string;
  location?: string;
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  transmission: string;
  fuel_type: string;
  body_type?: string;
  color?: string;
  description?: string;
  status: string;
  slug: string;
  view_count: number;
  images: CarImage[];
  dealer: Dealer;
}

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  
  // Inquiry form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await carsAPI.getBySlug(slug);
      setCar(response.data);
      // Set default message
      setMessage(`Hi, I'm interested in the ${response.data.make} ${response.data.model} ${response.data.year}. Is it still available?`);
    } catch (error: unknown) {
      console.error('Failed to fetch car:', error);
      toast.error('Car not found');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!car) return;

    setSubmitting(true);
    try {
      await leadsAPI.create({
        car_id: car.id,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_email: buyerEmail || undefined,
        message: message || undefined,
      });

      toast.success('Your inquiry has been sent! The dealer will contact you shortly.');
      setShowInquiryForm(false);
      
      // Reset form
      setBuyerName('');
      setBuyerPhone('');
      setBuyerEmail('');
      setMessage(`Hi, I'm interested in the ${car.make} ${car.model} ${car.year}. Is it still available?`);
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Failed to send inquiry';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
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

  const openWhatsApp = () => {
    if (!car) return;
    const phone = car.dealer.phone_number.replace(/\+/g, '');
    const text = encodeURIComponent(
      `Hi, I'm interested in the ${car.make} ${car.model} ${car.year} listed on CarStrel. Is it still available?\n\nhttps://carstrel.com/cars/${car.slug}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    if (!car) return;
    const text = encodeURIComponent(
      `Check out this ${car.make} ${car.model} ${car.year} - ${formatPrice(car.price)} 🚗\n\nhttps://carstrel.com/cars/${car.slug}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://carstrel.com/cars/${car?.slug}`);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarStrel
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <Link href="/cars" className="text-primary-600 hover:text-primary-700">
            Browse all cars →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarStrel
            </Link>
            <Link href="/cars" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to cars
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              {/* Main Image */}
              <div
                className="relative h-96 bg-gray-200 cursor-pointer"
                onClick={() => setShowLightbox(true)}
              >
                {car.images[selectedImage] ? (
                  <Image
                    src={car.images[selectedImage].url}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                  {selectedImage + 1} / {car.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {car.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index
                          ? 'border-primary-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.thumbnail_url || image.url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.make} {car.model}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{car.year}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Mileage</p>
                  <p className="font-semibold text-gray-900">{formatMileage(car.mileage)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Transmission</p>
                  <p className="font-semibold text-gray-900">{car.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fuel Type</p>
                  <p className="font-semibold text-gray-900">{car.fuel_type}</p>
                </div>
                {car.body_type && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Body Type</p>
                    <p className="font-semibold text-gray-900">{car.body_type}</p>
                  </div>
                )}
                {car.color && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Color</p>
                    <p className="font-semibold text-gray-900">{car.color}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {car.description && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
                </>
              )}
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Share this car</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={shareOnWhatsApp}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
                >
                  Share on WhatsApp
                </button>
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                >
                  Copy Link
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                👁️ {car.view_count} {car.view_count === 1 ? 'person has' : 'people have'} viewed this car
              </p>
            </div>
          </div>

          {/* Right Column - Price & Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">Price</p>
                <p className="text-4xl font-bold text-primary-600 mb-4">
                  {formatPrice(car.price)}
                </p>

                {/* Primary CTA - WhatsApp */}
                <button
                  onClick={openWhatsApp}
                  className="w-full mb-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Dealer
                </button>

                {/* Secondary CTA - Inquiry Form */}
                <button
                  onClick={() => setShowInquiryForm(!showInquiryForm)}
                  className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium border-2 border-gray-300 rounded-lg transition"
                >
                  {showInquiryForm ? 'Hide Form' : 'Send Inquiry'}
                </button>

                {/* Inquiry Form */}
                {showInquiryForm && (
                  <form onSubmit={handleSubmitInquiry} className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g., 0712345678)"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <textarea
                      placeholder="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                    >
                      {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </form>
                )}
              </div>

              {/* Dealer Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dealer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Dealership</p>
                    <p className="font-medium text-gray-900">{car.dealer.dealership_name}</p>
                  </div>
                  {car.dealer.location && (
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{car.dealer.location}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium text-gray-900">{car.dealer.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setShowLightbox(false)}
          >
            ×
          </button>
          
          {/* Previous Button */}
          {selectedImage > 0 && (
            <button
              className="absolute left-4 text-white text-6xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={car.images[selectedImage]?.url}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
              sizes="100vw"
            />
          </div>

          {/* Next Button */}
          {selectedImage < car.images.length - 1 && (
            <button
              className="absolute right-4 text-white text-6xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
            >
              ›
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            {selectedImage + 1} / {car.images.length}
          </div>
        </div>
      )}
    </div>
  );
}