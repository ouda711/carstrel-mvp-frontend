'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CarSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      router.push('/dashboard');
    }
  }, [slug, router]);

  const shareUrl = `${window.location.origin}/cars/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out my car listing: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!slug) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Car Listed Successfully! 🎉
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your car is now live and ready to be shared with potential buyers
        </p>

        {/* Shareable Link */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Shareable Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
            />
            <button
              onClick={copyLink}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Actions */}
        <div className="space-y-3 mb-8">
          <button
            onClick={shareOnWhatsApp}
            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Share on WhatsApp
          </button>

          <Link
            href={`/cars/${slug}`}
            target="_blank"
            className="block w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition text-center"
          >
            View Listing
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Leads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">✓</p>
            <p className="text-sm text-gray-600">Listed</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">📱 What is Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">1.</span>
              <span>Share the link on WhatsApp, Facebook, Instagram</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">2.</span>
              <span>Post in car buyer groups and forums</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">3.</span>
              <span>Print the link on cards for your showroom</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">4.</span>
              <span>Check your dashboard for leads and views</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/dashboard/cars/new"
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition text-center"
          >
            Add Another Car
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium border-2 border-gray-300 rounded-lg transition text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}