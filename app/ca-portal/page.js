'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserCheck, Receipt, LogOut, Lock, Send, RefreshCw, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';

export default function CaPortal() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'customers' or 'billing'
  const [activeTab, setActiveTab] = useState('customers');

  // Customer State
  const [customers, setCustomers] = useState([]);
  const [custLoading, setCustLoading] = useState(false);
  const [custForm, setCustForm] = useState({ name: '', gstNo: '', mobileNo: '', email: '' });
  const [custError, setCustError] = useState('');
  const [custSuccess, setCustSuccess] = useState('');

  // Billing Form State (Direct PDF Upload)
  const [billForm, setBillForm] = useState({
    billNo: '',
    gstNo: '',
    billDate: new Date().toISOString().split('T')[0],
    pdfUrl: '',
    totalAmount: '',
  });
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [billError, setBillError] = useState('');
  const [billSuccess, setBillSuccess] = useState('');

  // Check login on load
  useEffect(() => {
    const savedPass = localStorage.getItem('ujjwal_ca_password');
    if (savedPass) {
      setPassword(savedPass);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch Customers when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCustomers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/ca/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('ujjwal_ca_password', password);
      } else {
        setLoginError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      setLoginError('Network error. Check server logs.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    localStorage.removeItem('ujjwal_ca_password');
  };

  const fetchCustomers = async () => {
    setCustLoading(true);
    try {
      const res = await fetch('/api/ca/customers', {
        headers: { 'x-ca-password': password },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error('Failed to load customers');
    } finally {
      setCustLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setCustError('');
    setCustSuccess('');

    try {
      const res = await fetch('/api/ca/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ca-password': password,
        },
        body: JSON.stringify(custForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCustSuccess('Customer registered successfully!');
        setCustForm({ name: '', gstNo: '', mobileNo: '', email: '' });
        fetchCustomers();
      } else {
        setCustError(data.error || 'Failed to add customer.');
      }
    } catch (err) {
      setCustError('Connection error.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm('Are you sure you want to delete this customer? This deletes all their bills too.')) return;
    setCustError('');
    setCustSuccess('');

    try {
      const res = await fetch(`/api/ca/customers?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-ca-password': password },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCustSuccess('Customer and records removed.');
        fetchCustomers();
      } else {
        setCustError(data.error || 'Failed to remove.');
      }
    } catch (err) {
      setCustError('Connection error.');
    }
  };

  // Direct PDF Uploader trigger
  const handlePdfFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setBillError('Only PDF documents are supported for GST Bill uploads.');
      return;
    }

    setPdfUploading(true);
    setPdfUploadSuccess(false);
    setBillError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-ca-password': password,
        },
        body: uploadData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBillForm((prev) => ({ ...prev, pdfUrl: data.url }));
        setPdfUploadSuccess(true);
      } else {
        setBillError(data.error || 'Failed to upload PDF file to Cloudinary.');
      }
    } catch (err) {
      setBillError('Network connection error during PDF upload.');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSaveBill = async (e) => {
    e.preventDefault();
    setBillError('');
    setBillSuccess('');
    setBillLoading(true);

    if (!billForm.gstNo) {
      setBillError('Please select a registered GST Customer.');
      setBillLoading(false);
      return;
    }

    if (!billForm.pdfUrl) {
      setBillError('Please upload the GST Bill PDF file first.');
      setBillLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/ca/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ca-password': password,
        },
        body: JSON.stringify(billForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBillSuccess(`Bill #${billForm.billNo} saved successfully!`);
        setBillForm({
          billNo: '',
          gstNo: '',
          billDate: new Date().toISOString().split('T')[0],
          pdfUrl: '',
          totalAmount: '',
        });
        setPdfUploadSuccess(false);

        // Reset file element value
        const fileElement = document.getElementById('pdf-file-uploader');
        if (fileElement) fileElement.value = '';
      } else {
        setBillError(data.error || 'Failed to save bill details.');
      }
    } catch (err) {
      setBillError('Connection error saving bill.');
    } finally {
      setBillLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 transition-colors duration-300">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/50 p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-amber-600/10 dark:bg-amber-950/20 border border-amber-500/20 p-4 text-amber-600 dark:text-amber-500 mb-3">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">CA Admin Gateway</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Authorized financial officer access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">CA Access Passcode</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {loginError && (
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 p-3 text-xs text-rose-600 dark:text-rose-400 font-bold">
                <AlertCircle size={16} className="shrink-0 animate-bounce" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 disabled:opacity-50 transition-all duration-300"
            >
              {loginLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 dark:border-stone-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">CA Auditing Panel</h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Ujjwal Iron GST Client Registry & Invoice Manager</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex border-b border-stone-200 dark:border-stone-900 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'customers'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white'
            }`}
          >
            <UserCheck size={16} />
            <span>Register Verified Customer</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'billing'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white'
            }`}
          >
            <Receipt size={16} />
            <span>Upload GST Bill PDF</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'customers' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Customer Add Column */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/40 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Register Verified Customer</h3>
                
                <form onSubmit={handleAddCustomer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Company / Customer Name</label>
                    <input
                      type="text"
                      required
                      value={custForm.name}
                      onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                      placeholder="e.g. Shyam Builders Patna"
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      required
                      value={custForm.gstNo}
                      onChange={(e) => setCustForm({ ...custForm, gstNo: e.target.value.toUpperCase() })}
                      placeholder="e.g. 10AIAPR5590E1ZJ"
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Registered Mobile No</label>
                    <input
                      type="text"
                      required
                      value={custForm.mobileNo}
                      onChange={(e) => setCustForm({ ...custForm, mobileNo: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Registered Email (OTP Delivery)</label>
                    <input
                      type="email"
                      required
                      value={custForm.email}
                      onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                      placeholder="e.g. billing@shyam.com"
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {custError && (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{custError}</span>
                    </div>
                  )}

                  {custSuccess && (
                    <div className="flex items-start gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 p-3 text-xs text-emerald-600">
                      <CheckCircle size={14} className="shrink-0" />
                      <span>{custSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-500 transition-colors duration-250 shadow-md shadow-amber-600/10"
                  >
                    <Plus size={16} />
                    <span>Register Customer</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Customer List Column */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/40 p-6 shadow-sm overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Verified GST Customer Accounts</h3>

                {custLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <RefreshCw size={24} className="animate-spin text-stone-400" />
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-12 text-sm text-stone-500">No GST customers registered yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 rounded-l-xl">Name</th>
                          <th className="px-4 py-3">GSTIN</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3 rounded-r-xl text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-900 text-stone-700 dark:text-stone-300">
                        {customers.map((c) => (
                          <tr key={c._id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                            <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                            <td className="px-4 py-4 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">{c.gstNo}</td>
                            <td className="px-4 py-4">{c.mobileNo}</td>
                            <td className="px-4 py-4 text-xs">{c.email}</td>
                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => handleDeleteCustomer(c._id)}
                                className="text-rose-600 hover:text-rose-500 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/40 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Upload Verified GST Invoice PDF</h3>

              <form onSubmit={handleSaveBill} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Select GST Customer</label>
                  <select
                    required
                    value={billForm.gstNo}
                    onChange={(e) => setBillForm({ ...billForm, gstNo: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">-- Choose Client --</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c.gstNo}>
                        {c.name} ({c.gstNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Bill / Invoice Number</label>
                    <input
                      type="text"
                      required
                      value={billForm.billNo}
                      onChange={(e) => setBillForm({ ...billForm, billNo: e.target.value })}
                      placeholder="e.g. UI/2026/089"
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Invoice Date</label>
                    <input
                      type="date"
                      required
                      value={billForm.billDate}
                      onChange={(e) => setBillForm({ ...billForm, billDate: e.target.value })}
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Total Bill Amount (Gross INR)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={billForm.totalAmount}
                    onChange={(e) => setBillForm({ ...billForm, totalAmount: e.target.value })}
                    placeholder="e.g. 150000"
                    className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* PDF File Uploader Input */}
                <div className="border-2 border-dashed border-stone-300 dark:border-stone-800 rounded-2xl p-6 text-center bg-stone-50/50 dark:bg-stone-900/20">
                  <div className="flex flex-col items-center">
                    <Upload size={28} className="text-stone-400 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">Upload Bill Document (PDF Only)</span>
                    <input
                      type="file"
                      id="pdf-file-uploader"
                      accept="application/pdf"
                      required
                      onChange={handlePdfFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="pdf-file-uploader"
                      className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition-colors shadow-sm inline-flex items-center gap-1.5"
                    >
                      {pdfUploading ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={12} />
                          <span>Browse Files</span>
                        </>
                      )}
                    </label>

                    {pdfUploadSuccess && (
                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 px-3 py-1 rounded-full font-bold">
                        <FileText size={12} />
                        <span>PDF Invoice Attached successfully!</span>
                      </div>
                    )}
                  </div>
                </div>

                {billError && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 p-3.5 text-xs text-rose-600 font-bold">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{billError}</span>
                  </div>
                )}

                {billSuccess && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 p-3.5 text-xs text-emerald-600 font-bold">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{billSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={billLoading || pdfUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-amber-550 transition-all duration-300 disabled:opacity-50"
                >
                  <Send size={16} />
                  <span>Submit & Save GST Bill</span>
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
