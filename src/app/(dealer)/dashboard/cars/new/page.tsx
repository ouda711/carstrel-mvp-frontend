'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { carsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const POPULAR_MAKES = [
  'Toyota', 'Nissan', 'Honda', 'Mazda', 'Subaru', 'Mitsubishi',
  'Mercedes-Benz', 'BMW', 'Volkswagen', 'Suzuki', 'Isuzu',
  'Land Rover', 'Audi', 'Peugeot', 'Volvo'
];

export default function AddCarPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate max 8 images
    if (images.length + files.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }

    // Validate file size (5MB each)
    const oversized = files.find(file => file.size > 5 * 1024 * 1024);
    if (oversized) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    // Validate file type
    const invalidType = files.find(file => !file.type.startsWith('image/'));
    if (invalidType) {
      toast.error('Only image files are allowed');
      return;
    }

    // Add new images
    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('make', make);
      formData.append('model', model);
      formData.append('year', year);
      formData.append('price', price);
      formData.append('mileage', mileage);
      formData.append('transmission', transmission);
      formData.append('fuel_type', fuelType);
      if (bodyType) formData.append('body_type', bodyType);
      if (color) formData.append('color', color);
      if (description) formData.append('description', description);

      // Append images
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await carsAPI.create(formData);

      toast.success('Car listed successfully!');
      
      // Redirect to success page or car detail
      const slug = response.data.car.slug;
      router.push(`/dashboard/cars/success?slug=${slug}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create car listing';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Add New Car</h1>
              <p className="text-sm text-gray-600">Create a new listing</p>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Images Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Images <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload 1-8 images. First image will be the main photo. Max 5MB each.
            </p>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 8 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition">
                <div className="flex flex-col items-center">
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WEBP (max 5MB each)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Car Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select make</option>
                  {POPULAR_MAKES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  placeholder="e.g., Fielder, X-Trail, Fit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  placeholder="2015"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KES) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  placeholder="950000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                  min="0"
                  placeholder="85000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission <span className="text-red-500">*</span>
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Type (Optional)
                </label>
                <input
                  type="text"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  placeholder="e.g., Sedan, SUV, Hatchback"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color (Optional)
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Silver, Black, White"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g., Well maintained, fresh import from Japan, full service history, accident-free..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide details about the car&apos;s condition, features, and history
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              {submitting ? 'Creating Listing...' : 'Create Listing'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}