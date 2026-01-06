'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { leadsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Lead {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string;
  message?: string;
  status: string;
  source: string;
  created_at: string;
  car: {
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
  };
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  closed: number;
  last_7_days: number;
}

export default function LeadsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, contacted, closed
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: capitalize(filter) } : {};
      
      const [leadsRes, statsRes] = await Promise.all([
        leadsAPI.getMyLeads(params),
        leadsAPI.getStats(),
      ]);

      setLeads(leadsRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      await leadsAPI.updateStatus(leadId, newStatus);
      toast.success(`Lead marked as ${newStatus}`);
      fetchData(); // Refresh
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleDelete = async (leadId: string, buyerName: string) => {
    if (!confirm(`Are you sure you want to delete the lead from ${buyerName}?`)) {
      return;
    }

    try {
      await leadsAPI.delete(leadId);
      toast.success('Lead deleted successfully');
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
      fetchData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete lead');
    }
  };

  const openWhatsApp = (phone: string, name: string, car: string) => {
    const cleanPhone = phone.replace(/\+/g, '');
    const text = encodeURIComponent(`Hi ${name}, thanks for your interest in the ${car}! Is it still available?`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-KE', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      New: 'bg-blue-100 text-blue-800',
      Contacted: 'bg-purple-100 text-purple-800',
      Closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
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
              <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
              <p className="text-sm text-gray-600">Manage buyer inquiries</p>
            </div>
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Contacted</p>
              <p className="text-2xl font-bold text-purple-600">{stats.contacted}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Last 7 Days</p>
              <p className="text-2xl font-bold text-green-600">{stats.last_7_days}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'new'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilter('contacted')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'contacted'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contacted
              </button>
              <button
                onClick={() => setFilter('closed')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'closed'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Closed
              </button>
            </div>

            {/* Leads */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : leads.length > 0 ? (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition hover:shadow-md ${
                      selectedLead?.id === lead.id
                        ? 'border-primary-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Car Image */}
                        <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                          {lead.car.primary_image ? (
                            <img
                              src={lead.car.primary_image.thumbnail_url || lead.car.primary_image.url}
                              alt={`${lead.car.make} ${lead.car.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Lead Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {lead.buyer_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {lead.car.make} {lead.car.model} {lead.car.year}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>📞 {lead.buyer_phone}</span>
                            <span>•</span>
                            <span>{formatDate(lead.created_at)}</span>
                          </div>

                          {lead.message && (
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lead.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'No leads yet' : `No ${filter} leads`}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? 'Inquiries will appear here when buyers contact you'
                    : `You don't have any ${filter} leads at the moment`}
                </p>
              </div>
            )}
          </div>

          {/* Lead Details Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {selectedLead ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h3>

                    {/* Car Info */}
                    <Link
                      href={`/cars/${selectedLead.car.slug}`}
                      target="_blank"
                      className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden">
                        {selectedLead.car.primary_image ? (
                          <img
                            src={selectedLead.car.primary_image.thumbnail_url || selectedLead.car.primary_image.url}
                            alt=""
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
                          {selectedLead.car.make} {selectedLead.car.model}
                        </p>
                        <p className="text-sm text-gray-600">{selectedLead.car.year}</p>
                        <p className="text-sm font-semibold text-primary-600">
                          {formatPrice(selectedLead.car.price)}
                        </p>
                      </div>
                    </Link>

                    {/* Buyer Info */}
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Buyer Name</p>
                        <p className="font-medium text-gray-900">{selectedLead.buyer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                        <a
                          href={`tel:${selectedLead.buyer_phone}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {selectedLead.buyer_phone}
                        </a>
                      </div>
                      {selectedLead.buyer_email && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Email</p>
                          <a
                            href={`mailto:${selectedLead.buyer_email}`}
                            className="font-medium text-primary-600 hover:text-primary-700"
                          >
                            {selectedLead.buyer_email}
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Received</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedLead.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Source</p>
                        <p className="font-medium text-gray-900">{selectedLead.source}</p>
                      </div>
                    </div>

                    {/* Message */}
                    {selectedLead.message && (
                      <div className="mb-6">
                        <p className="text-xs text-gray-600 mb-2">Message</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{selectedLead.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-600 mb-2">Update Status</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          openWhatsApp(
                            selectedLead.buyer_phone,
                            selectedLead.buyer_name,
                            `${selectedLead.car.make} ${selectedLead.car.model} ${selectedLead.car.year}`
                          )
                        }
                        className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp {selectedLead.buyer_name}
                      </button>
                      <a
                        href={`tel:${selectedLead.buyer_phone}`}
                        className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition text-center block"
                      >
                        Call {selectedLead.buyer_name}
                      </a>
                      <button
                        onClick={() => handleDelete(selectedLead.id, selectedLead.buyer_name)}
                        className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition"
                      >
                        Delete Lead
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Select a lead to view details and take action
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}