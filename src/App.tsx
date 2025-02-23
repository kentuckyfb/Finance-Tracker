import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, History, FileText, LogIn, LogOut, UserCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import type { PurchaseOrder, NewPurchaseOrder } from './types';
import type { User } from '@supabase/supabase-js';

function App() {
  const [view, setView] = useState<'current' | 'history'>('current');
  const [showNewPOForm, setShowNewPOForm] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [user, setUser] = useState<User | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchPurchaseOrders();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchPurchaseOrders();
      } else {
        setPurchaseOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              email
            }
          }
        });
        if (signUpError) throw signUpError;
        
        // Automatically sign in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        
        toast.success('Account created successfully!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success('Signed in successfully!');
      }
      
      setShowAuthForm(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  }

  async function fetchPurchaseOrders() {
    try {
      setLoading(true);
      const query = supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (view === 'current') {
        query.neq('status', 'closed');
      } else {
        query.eq('status', 'closed');
      }

      const { data, error } = await query;
      if (error) throw error;
      setPurchaseOrders(data || []);
    } catch (error) {
      toast.error('Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  }

  async function createPurchaseOrder(po: NewPurchaseOrder) {
    try {
      const { error } = await supabase.from('purchase_orders').insert([{
        ...po,
        user_id: user?.id || ''
      }]);
      if (error) throw error;
      toast.success('Purchase order created successfully');
      setShowNewPOForm(false);
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Failed to create purchase order');
    }
  }

  async function updatePOStatus(id: string, status: PurchaseOrder['status'], poNumber?: string) {
    try {
      const updates: Partial<PurchaseOrder> = { status };
      if (poNumber) updates.po_number = poNumber;

      const { error } = await supabase
        .from('purchase_orders')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated successfully');
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <Toaster position="top-right" />
        
        {showAuthForm ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  required
                  disabled={authLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  required
                  disabled={authLoading}
                  minLength={6}
                />
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
              </div>
              <button
                type="submit"
                className={`w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg flex items-center justify-center ${
                  authLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  authMode === 'signin' ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>
            <p className="mt-4 text-center text-sm">
              {authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-orange-500 hover:text-orange-400"
                disabled={authLoading}
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-500 mb-8">Finance Tracker</h1>
            <button
              onClick={() => setShowAuthForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg flex items-center mx-auto"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Get Started
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-500">Finance Tracker</h1>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('current')}
                  className={`px-4 py-2 rounded-lg ${
                    view === 'current'
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FileText className="w-5 h-5 inline-block mr-2" />
                  Current POs
                </button>
                <button
                  onClick={() => setView('history')}
                  className={`px-4 py-2 rounded-lg ${
                    view === 'history'
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <History className="w-5 h-5 inline-block mr-2" />
                  History
                </button>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <UserCircle className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="ml-4 text-gray-400 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        {view === 'current' && (
          <div className="mb-8">
            <button
              onClick={() => setShowNewPOForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Purchase Order
            </button>
          </div>
        )}

        {/* PO List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 mx-auto"></div>
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No purchase orders found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purchaseOrders.map((po) => (
              <div
                key={po.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{po.agency}</h3>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        po.status === 'approved'
                          ? 'bg-green-900 text-green-300'
                          : po.status === 'pending'
                          ? 'bg-yellow-900 text-yellow-300'
                          : po.status === 'closed'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-blue-900 text-blue-300'
                      }`}
                    >
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="font-medium">Estimate:</span> {po.estimate_number}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> ${po.price.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Start Date:</span>{' '}
                    {format(new Date(po.start_date), 'MMM d, yyyy')}
                  </p>
                  <p>
                    <span className="font-medium">End Date:</span>{' '}
                    {format(new Date(po.end_date), 'MMM d, yyyy')}
                  </p>
                  <p>
                    <span className="font-medium">Deadline:</span>{' '}
                    {format(new Date(po.deadline_date), 'MMM d, yyyy')}
                  </p>
                  {po.po_number && (
                    <p>
                      <span className="font-medium">PO Number:</span> {po.po_number}
                    </p>
                  )}
                </div>

                {view === 'current' && (
                  <div className="mt-6 space-x-2">
                    {po.status !== 'closed' && (
                      <>
                        {po.status === 'draft' && (
                          <button
                            onClick={() => updatePOStatus(po.id, 'pending')}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm"
                          >
                            Submit for Approval
                          </button>
                        )}
                        {po.status === 'pending' && (
                          <button
                            onClick={() => updatePOStatus(po.id, 'approved')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                          >
                            Approve
                          </button>
                        )}
                        {po.status === 'approved' && (
                          <button
                            onClick={() => {
                              const poNumber = prompt('Enter PO Number:');
                              if (poNumber) {
                                updatePOStatus(po.id, 'closed', poNumber);
                              }
                            }}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                          >
                            Close PO
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New PO Form Modal */}
        {showNewPOForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-6">New Purchase Order</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newPO: NewPurchaseOrder = {
                    agency: formData.get('agency') as string,
                    estimate_number: formData.get('estimate_number') as string,
                    price: parseFloat(formData.get('price') as string),
                    start_date: formData.get('start_date') as string,
                    end_date: formData.get('end_date') as string,
                    deadline_date: formData.get('deadline_date') as string,
                    estimate_due_date: formData.get('estimate_due_date') as string,
                    estimate_start_date: formData.get('estimate_start_date') as string,
                    status: 'draft'
                  };
                  createPurchaseOrder(newPO);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Agency</label>
                    <input
                      type="text"
                      name="agency"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estimate Number</label>
                    <input
                      type="text"
                      name="estimate_number"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deadline Date</label>
                    <input
                      type="date"
                      name="deadline_date"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estimate Due Date</label>
                    <input
                      type="date"
                      name="estimate_due_date"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estimate Start Date</label>
                    <input
                      type="date"
                      name="estimate_start_date"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewPOForm(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg"
                  >
                    Create PO
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;