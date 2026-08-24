'use client';

import React, { useState, useEffect } from 'react';
import { Download, Lock, CheckCircle2, Shield, Calendar, RefreshCw, AlertCircle, Eye, LogOut, FileText, Smartphone } from 'lucide-react';

export default function GstPortal() {
  // Login credentials
  const [gstNo, setGstNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Otp flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  // Dashboard content
  const [customerInfo, setCustomerInfo] = useState(null);
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);

  // Selected Bill for Modal view
  const [selectedBill, setSelectedBill] = useState(null);

  // First time PDF download security verification modal
  const [showVerifyDownloadModal, setShowVerifyDownloadModal] = useState(false);
  const [pendingBillToDownload, setPendingBillToDownload] = useState(null);
  const [downloadVerifyMobile, setDownloadVerifyMobile] = useState('');
  const [downloadOtpSent, setDownloadOtpSent] = useState(false);
  const [downloadOtp, setDownloadOtp] = useState('');
  const [downloadOtpLoading, setDownloadOtpLoading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  // Read session on mount
  useEffect(() => {
    const savedCustomer = sessionStorage.getItem('gst_customer');
    if (savedCustomer) {
      const parsed = JSON.parse(savedCustomer);
      setCustomerInfo(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch bills when logged in
  useEffect(() => {
    if (isLoggedIn && customerInfo) {
      fetchBills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, customerInfo]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const res = await fetch('/api/gst-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstNo: gstNo.toUpperCase().trim(), mobileNo }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpSuccess(
          data.devOtp 
            ? `[Verification Code: ${data.devOtp}] sent to your registered email address.`
            : 'Verification Code (OTP) sent to your registered email address!'
        );
      } else {
        setOtpError(data.error || 'Details do not match. Please verify your GSTIN or contact support.');
      }
    } catch (err) {
      setOtpError('Failed to connect to the server. Please check your internet connection.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/gst-auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstNo: gstNo.toUpperCase().trim(), otp: otpCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setCustomerInfo(data.customer);
        sessionStorage.setItem('gst_customer', JSON.stringify(data.customer));
      } else {
        setOtpError(data.error || 'Incorrect code. Please check and try again.');
      }
    } catch (err) {
      setOtpError('Connection error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCustomerInfo(null);
    setBills([]);
    setGstNo('');
    setMobileNo('');
    setOtpSent(false);
    setOtpCode('');
    sessionStorage.removeItem('gst_customer');
  };

  const fetchBills = async () => {
    if (!customerInfo) return;
    setBillsLoading(true);
    try {
      const res = await fetch(`/api/ca/bills?gstNo=${customerInfo.gstNo}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setBills(data.data);
      }
    } catch (err) {
      console.error('Failed to load bills.');
    } finally {
      setBillsLoading(false);
    }
  };

  // Triggers PDF download or prompts for download OTP
  const handleDownloadClick = async (bill) => {
    if (customerInfo.downloadVerified) {
      executePdfDownload(bill);
    } else {
      setPendingBillToDownload(bill);
      setDownloadVerifyMobile('');
      setDownloadOtpSent(false);
      setDownloadOtp('');
      setDownloadError('');
      setDownloadSuccess('');
      setShowVerifyDownloadModal(true);
    }
  };

  const handleSendDownloadOtp = async () => {
    setDownloadOtpLoading(true);
    setDownloadError('');
    setDownloadSuccess('');

    try {
      const res = await fetch('/api/gst-portal/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          gstNo: customerInfo.gstNo,
          mobileNo: customerInfo.mobileNo,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDownloadOtpSent(true);
        setDownloadSuccess(
          data.devOtp
            ? `[Verification Code: ${data.devOtp}] sent to your registered email address.`
            : 'OTP code sent successfully to your registered email address!'
        );
      } else {
        setDownloadError(data.error || 'Failed to dispatch code.');
      }
    } catch (err) {
      setDownloadError('Connection error.');
    } finally {
      setDownloadOtpLoading(false);
    }
  };

  const handleVerifyDownloadOtp = async (e) => {
    e.preventDefault();
    setDownloadOtpLoading(true);
    setDownloadError('');

    try {
      const res = await fetch('/api/gst-portal/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-otp',
          gstNo: customerInfo.gstNo,
          otp: downloadOtp,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Update local session storage
        const updatedCustomer = { ...customerInfo, downloadVerified: true };
        setCustomerInfo(updatedCustomer);
        sessionStorage.setItem('gst_customer', JSON.stringify(updatedCustomer));

        setShowVerifyDownloadModal(false);

        // Execute download trigger
        executePdfDownload(pendingBillToDownload);
      } else {
        setDownloadError(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      setDownloadError('Connection error.');
    } finally {
      setDownloadOtpLoading(false);
    }
  };

  // Triggers PDF download in new tab
  const executePdfDownload = async (bill) => {
    try {
      let targetUrl = bill.pdfUrl;
      if (targetUrl && targetUrl.includes('image/upload') && targetUrl.toLowerCase().endsWith('.pdf')) {
        targetUrl = targetUrl.replace('image/upload', 'raw/upload');
      }
      if (targetUrl && !targetUrl.toLowerCase().endsWith('.pdf')) {
        targetUrl = targetUrl + '.pdf';
      }
      window.open(targetUrl, '_blank');

      // Log download action to server
      await fetch('/api/gst-portal/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log-download',
          gstNo: customerInfo.gstNo,
          billNo: bill.billNo,
        }),
      });
    } catch (err) {
      console.error('PDF download trigger failed:', err);
    }
  };

  // 1. LOGIN INTERFACE (Unauthenticated state)
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 dark:bg-stone-950 px-4 py-12 transition-colors duration-300">
        <div className="w-full max-w-lg rounded-3xl border-2 border-amber-500/20 bg-white dark:bg-stone-900 p-8 sm:p-10 shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 border-b-2 border-stone-150 dark:border-stone-850 pb-6">
            <div className="rounded-full bg-amber-500/10 p-5 text-amber-600 dark:text-amber-500 mb-4 border border-amber-500/20">
              <Shield size={40} className="stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Customer GST Portal
            </h1>
            <p className="text-amber-600 dark:text-amber-400 font-bold text-sm tracking-wide mt-1 uppercase">
              उज्जवल आयरन ग्राहक बिल पोर्टल
            </p>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-3 font-medium max-w-xs">
              Easily view and download your tax invoices in one place.
            </p>
          </div>

          {!otpSent ? (
            // Form Step 1: GSTIN & Mobile
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="bg-amber-500/5 dark:bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 mb-4 text-xs text-amber-800 dark:text-amber-300 font-semibold space-y-1">
                <p>💡 Hint / संकेत:</p>
                <p>1. Enter your 15-character GSTIN number.</p>
                <p>2. Enter your 10-digit registered mobile number.</p>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-stone-700 dark:text-stone-300 mb-2">
                  1. Enter GSTIN (जीएसटी नंबर डालें)
                </label>
                <input
                  type="text"
                  required
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value.toUpperCase())}
                  placeholder="e.g. 10AIAPR1234A1Z1"
                  className="w-full text-base sm:text-lg font-bold rounded-2xl border-2 border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-5 py-4 text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-stone-700 dark:text-stone-300 mb-2">
                  2. Registered Mobile Number (मोबाइल नंबर)
                </label>
                <div className="relative">
                  <Smartphone size={20} className="absolute left-4 top-4.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength="10"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 10 digit number..."
                    className="w-full pl-12 pr-5 py-4 text-base sm:text-lg font-bold rounded-2xl border-2 border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {otpError && (
                <div className="flex items-start gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 text-sm text-rose-700 dark:text-rose-455 font-bold">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4.5 text-base sm:text-lg font-black text-white shadow-xl shadow-amber-600/20 hover:bg-amber-500 disabled:opacity-50 transition-all duration-350 active:scale-[0.98] cursor-pointer"
              >
                {otpLoading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <span>Request Login Code (ओटीपी भेजें)</span>
                )}
              </button>
            </form>
          ) : (
            // Form Step 2: Verify OTP
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/50 p-4 text-sm text-emerald-800 dark:text-emerald-400 font-bold">
                <span>{otpSuccess}</span>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-stone-700 dark:text-stone-300 mb-2">
                  Enter 6-Digit Code (6 अंकों का कोड दर्ज करें)
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-widest font-mono text-xl sm:text-2xl font-black rounded-2xl border-2 border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-5 py-4.5 text-slate-900 dark:text-slate-100 placeholder-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {otpError && (
                <div className="flex items-start gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 text-sm text-rose-700 dark:text-rose-455 font-bold">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 rounded-2xl border-2 border-stone-300 dark:border-stone-800 py-4 text-sm sm:text-base font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  Go Back (पीछे जाएं)
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-sm sm:text-base font-black text-white hover:bg-amber-500 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {otpLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Verify Code (लॉगिन करें)</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 2. MAIN PORTAL (Logged-in state)
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4">
        
        {/* Welcome Header */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-500/10 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <p className="text-sm font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wide">
              Logged in successfully • ग्राहक पोर्टल
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Welcome, {customerInfo.name}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-stone-500 dark:text-stone-400 text-sm font-mono font-semibold">
              <span>GSTIN: {customerInfo.gstNo}</span>
              <span className="hidden sm:inline">•</span>
              <span>Mobile: {customerInfo.mobileNo}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl border-2 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 px-5 py-3 text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 hover:text-rose-500 transition-all cursor-pointer"
          >
            <LogOut size={18} className="stroke-[2.5]" />
            <span>Sign Out (बाहर निकलें)</span>
          </button>
        </div>

        {/* GST Invoices Section */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-500/10 p-6 sm:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8 border-b-2 border-stone-100 dark:border-stone-850 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Your Uploaded Bills (आपके बिल सूची)
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                Download verified PDF copies of your invoices.
              </p>
            </div>
            
            <button
              onClick={fetchBills}
              disabled={billsLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-stone-200 dark:border-stone-800 rounded-2xl text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors"
              title="Refresh Invoices"
            >
              <RefreshCw size={14} className={`stroke-[2.5] ${billsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {billsLoading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-3">
              <RefreshCw size={40} className="animate-spin text-amber-500 stroke-[2.5]" />
              <p className="text-sm text-stone-500 font-bold">Loading your invoices...</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 dark:bg-stone-950 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-850">
              <FileText className="h-16 w-16 text-stone-300 dark:text-stone-800 mx-auto mb-3" />
              <p className="text-lg font-black text-stone-700 dark:text-stone-300">No GST Invoices Found</p>
              <p className="text-sm text-stone-500 mt-1">If you made a recent purchase, please allow 24-48 hours for upload.</p>
            </div>
          ) : (
            // Minimal Stacked Card Layout for Easy Reading & Tap (Elderly-Friendly)
            <div className="space-y-4">
              {bills.map((bill) => (
                <div 
                  key={bill._id} 
                  className="bg-stone-50 dark:bg-stone-950/40 hover:bg-stone-100/50 dark:hover:bg-stone-950 border-2 border-stone-200/80 dark:border-stone-850 rounded-2xl p-5 sm:p-6 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Bill Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                          Invoice (बिल)
                        </span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                          #{bill.billNo}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-sm font-medium">
                        <Calendar size={16} />
                        <span>Date: {new Date(bill.billDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Amount & CTA Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-850">
                      
                      {/* Price display */}
                      <div className="flex flex-col sm:text-right pr-4">
                        <span className="text-xs text-stone-450 dark:text-stone-500 uppercase font-bold tracking-wide">Total Amount</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          ₹{bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownloadClick(bill)}
                        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-black px-6 py-4.5 rounded-2xl shadow-lg shadow-amber-600/15 hover:shadow-amber-500/25 transition-all text-base cursor-pointer"
                      >
                        <Download size={20} className="stroke-[2.5]" />
                        <span>Download PDF (डाउनलोड करें)</span>
                      </button>

                      {/* View details */}
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="flex items-center justify-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-colors text-sm font-bold cursor-pointer"
                      >
                        <Eye size={16} />
                        <span>View items</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL 1: SIMPLE BILL DETAILS VIEW */}
        {selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-2xl">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-stone-100 dark:border-stone-800 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Tax Invoice Details</h3>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-550 mt-1">Invoice Number: {selectedBill.billNo}</p>
                </div>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="rounded-xl border border-stone-300 dark:border-stone-750 px-3 py-1 text-base font-bold text-stone-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Close &times;
                </button>
              </div>

              {/* Customer info & bill items details */}
              <div className="space-y-4 text-base text-stone-700 dark:text-stone-300">
                <div className="flex justify-between border-b border-stone-100 dark:border-stone-850 pb-2">
                  <span className="text-stone-450">Billed To:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedBill.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 dark:border-stone-850 pb-2">
                  <span className="text-stone-450">GSTIN:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedBill.gstNo}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 dark:border-stone-850 pb-2">
                  <span className="text-stone-450">Invoice Date:</span>
                  <span className="font-bold">{new Date(selectedBill.billDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>

                {/* Items Summary list */}
                <div className="pt-2">
                  <span className="text-stone-450 text-sm font-bold block mb-2">Purchased Items:</span>
                  <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-stone-850 space-y-2 text-sm font-semibold max-h-[140px] overflow-y-auto">
                    {selectedBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-605 dark:text-stone-350">
                        <span>• {item.name} <span className="text-stone-400 font-normal">({item.qty} pcs)</span></span>
                        <span className="font-mono">₹{(item.total || (item.qty * item.rate)).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between border-t-2 border-stone-100 dark:border-stone-850 pt-4 text-lg font-black">
                  <span className="text-slate-900 dark:text-white">Total Bill Amount:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    ₹{selectedBill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t-2 border-stone-100 dark:border-stone-800 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="px-5 py-3 border-2 border-stone-200 dark:border-stone-800 rounded-xl text-sm font-bold hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors cursor-pointer"
                  >
                    Close View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBill(null);
                      handleDownloadClick(selectedBill);
                    }}
                    className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-black hover:shadow-lg transition-colors cursor-pointer"
                  >
                    Download Invoice PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: DOWNLOAD PDF FIRST TIME OTP VERIFICATION */}
        {showVerifyDownloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border-2 border-amber-550/20 bg-white dark:bg-stone-900 p-8 shadow-2xl">
              
              <div className="flex justify-between items-start mb-6 border-b border-stone-150 dark:border-stone-800 pb-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Security Check</h3>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-500 mt-0.5">Please authorize this download</p>
                </div>
                <button
                  onClick={() => {
                    setShowVerifyDownloadModal(false);
                    setDownloadOtp('');
                    setDownloadOtpSent(false);
                  }}
                  className="rounded-xl border border-stone-300 dark:border-stone-750 px-3 py-1 text-base font-bold text-stone-550 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {!downloadOtpSent ? (
                <div className="space-y-6">
                  <p className="text-base text-stone-600 dark:text-stone-350 leading-relaxed font-semibold">
                    For your account security, your first PDF bill download requires email authorization. An OTP code will be sent to your registered email address.
                  </p>
                  
                  <div className="rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 font-bold text-sm space-y-2 text-stone-700 dark:text-stone-300">
                    <div>GSTIN: <span className="font-mono text-slate-900 dark:text-white">{customerInfo.gstNo}</span></div>
                    <div>Registered Mobile: <span className="text-slate-900 dark:text-white">{customerInfo.mobileNo}</span></div>
                  </div>

                  {downloadError && (
                    <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 p-4 text-sm text-rose-700 font-bold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSendDownloadOtp}
                    disabled={downloadOtpLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-base font-black text-white hover:bg-amber-500 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {downloadOtpLoading ? <RefreshCw size={18} className="animate-spin" /> : <span>Send OTP to Email (ओटीपी भेजें)</span>}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyDownloadOtp} className="space-y-6">
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/50 p-4 text-sm text-emerald-800 dark:text-emerald-450 font-bold">
                    <span>{downloadSuccess}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-stone-750 dark:text-stone-300 mb-2">
                      Enter the 6-Digit Email OTP
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength="6"
                      value={downloadOtp}
                      onChange={(e) => setDownloadOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full text-center tracking-widest font-mono text-xl sm:text-2xl font-black rounded-2xl border-2 border-stone-300 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 px-5 py-4 text-slate-900 dark:text-slate-100 placeholder-stone-300 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {downloadError && (
                    <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/30 p-4 text-sm text-rose-700 font-bold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setDownloadOtpSent(false)}
                      className="flex-1 rounded-2xl border-2 border-stone-300 dark:border-stone-800 py-4 text-sm sm:text-base font-bold text-stone-600 dark:text-stone-350 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={downloadOtpLoading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-sm sm:text-base font-black text-white hover:bg-amber-500 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {downloadOtpLoading ? <RefreshCw size={14} className="animate-spin" /> : <span>Verify & Download (डाउनलोड करें)</span>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
