'use client';

import React, { useState, useEffect } from 'react';
import { Download, Lock, CheckCircle2, Shield, Calendar, RefreshCw, AlertCircle, Eye, LogOut } from 'lucide-react';

export default function GstPortal() {
  // Login credentials
  const [gstNo, setGstNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  // Login session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  // Bills list
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);

  // Selected bill detail modal
  const [selectedBill, setSelectedBill] = useState(null);

  // Download verification flow (for first-time download)
  const [showVerifyDownloadModal, setShowVerifyDownloadModal] = useState(false);
  const [pendingBillToDownload, setPendingBillToDownload] = useState(null);
  const [downloadOtp, setDownloadOtp] = useState('');
  const [downloadOtpSent, setDownloadOtpSent] = useState(false);
  const [downloadOtpLoading, setDownloadOtpLoading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  // Check customer session
  useEffect(() => {
    const cachedCust = localStorage.getItem('ujjwal_gst_customer');
    if (cachedCust) {
      const parsed = JSON.parse(cachedCust);
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
        body: JSON.stringify({ gstNo: gstNo.toUpperCase().trim(), mobileNo: mobileNo.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpSuccess(data.message);
        if (data.devOtp) {
          console.log(`[Dev OTP] Your verification code is: ${data.devOtp}`);
        }
      } else {
        setOtpError(data.error || 'Failed to generate code.');
      }
    } catch (err) {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const res = await fetch('/api/gst-auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstNo: gstNo.toUpperCase().trim(), otp: otp.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setCustomerInfo(data.customer);
        localStorage.setItem('ujjwal_gst_customer', JSON.stringify(data.customer));
      } else {
        setOtpError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setOtpError('Network error.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCustomerInfo(null);
    setGstNo('');
    setMobileNo('');
    setOtp('');
    setOtpSent(false);
    localStorage.removeItem('ujjwal_gst_customer');
  };

  const fetchBills = async () => {
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

  // Helper check for the 2-day billing delay
  const getBillDelayStatus = (billDate) => {
    const diffTime = Math.abs(new Date() - new Date(billDate));
    const diffHours = diffTime / (1000 * 60 * 60);
    const isLocked = diffHours < 48;
    const hoursLeft = Math.ceil(48 - diffHours);

    return {
      isLocked,
      hoursLeft,
    };
  };

  // Triggers PDF download or prompts for download OTP
  const handleDownloadClick = (bill) => {
    setPendingBillToDownload(bill);
    setDownloadError('');
    setDownloadSuccess('');

    if (!customerInfo.downloadVerified) {
      setShowVerifyDownloadModal(true);
    } else {
      executePdfDownload(bill);
    }
  };

  // Sends OTP to verify mobile for first-time downloads
  const handleSendDownloadOtp = async () => {
    setDownloadOtpLoading(true);
    setDownloadError('');
    setDownloadSuccess('');

    try {
      const res = await fetch('/api/gst-portal/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-otp',
          gstNo: customerInfo.gstNo,
          mobileNo: customerInfo.mobileNo,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDownloadOtpSent(true);
        setDownloadSuccess(data.message);
        if (data.devOtp) {
          console.log(`[Dev OTP] Your download verification code is: ${data.devOtp}`);
        }
      } else {
        setDownloadError(data.error || 'Failed to dispatch code.');
      }
    } catch (err) {
      setDownloadError('Network error.');
    } finally {
      setDownloadOtpLoading(false);
    }
  };

  // Verifies download OTP
  const handleVerifyDownloadOtp = async (e) => {
    e.preventDefault();
    setDownloadOtpLoading(true);
    setDownloadError('');
    setDownloadSuccess('');

    try {
      const res = await fetch('/api/gst-portal/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-otp',
          gstNo: customerInfo.gstNo,
          otp: downloadOtp.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Update state session
        const updatedInfo = { ...customerInfo, downloadVerified: true };
        setCustomerInfo(updatedInfo);
        localStorage.setItem('ujjwal_gst_customer', JSON.stringify(updatedInfo));

        setShowVerifyDownloadModal(false);
        setDownloadOtp('');
        setDownloadOtpSent(false);

        // Run download
        executePdfDownload(pendingBillToDownload);
      } else {
        setDownloadError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setDownloadError('Network error.');
    } finally {
      setDownloadOtpLoading(false);
    }
  };

  // Triggers PDF assembly and browser download
  const executePdfDownload = async (bill) => {
    try {
      // 1. Open the Cloudinary secure PDF file link directly to download/view
      window.open(bill.pdfUrl, '_blank');

      // 2. Log download action to server
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

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 transition-colors duration-300">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/50 p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-amber-600/10 dark:bg-amber-955/40 border border-amber-500/20 p-4 text-amber-600 dark:text-amber-500 mb-3">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">GST Customer Portal</h1>
            <p className="text-sm text-stone-550 dark:text-stone-400 mt-1">Access tax invoices & download verified bills</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Your GSTIN Number</label>
                <input
                  type="text"
                  required
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value.toUpperCase())}
                  placeholder="e.g. 10AIAPR5590E1ZJ"
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Registered Mobile No</label>
                <input
                  type="text"
                  required
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-955 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {otpError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-550 disabled:opacity-50 transition-all duration-300 animate-pulse"
              >
                {otpLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Send OTP Code</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-200 dark:border-emerald-900/30 p-3.5 text-xs text-emerald-700">
                <span>{otpSuccess}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-widest font-mono text-lg rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-955 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {otpError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 rounded-xl border border-stone-200 dark:border-stone-850 px-4 py-3 text-xs font-bold text-stone-605 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-550 disabled:opacity-50 transition-colors"
                >
                  {otpLoading ? <RefreshCw size={14} className="animate-spin" /> : <span>Verify OTP</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-955 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 dark:border-stone-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Welcome, {customerInfo.name}</span>
            </h1>
            <p className="text-sm text-stone-500 mt-1">GSTIN Registered Account: <span className="font-mono text-amber-605 font-bold">{customerInfo.gstNo}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-605 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

        {/* Invoice catalog list */}
        <div className="rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/40 p-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Your Tax Invoices History</h3>

          {billsLoading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={32} className="animate-spin text-stone-400" />
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-20 text-stone-500">No GST Invoices found under your GSTIN number.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 rounded-l-xl">Bill No</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Taxable Value</th>
                    <th className="px-6 py-3">Total Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {bills.map((bill) => {
                    const delayStatus = getBillDelayStatus(bill.billDate);
                    return (
                      <tr key={bill._id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{bill.billNo}</td>
                        <td className="px-6 py-4 flex items-center gap-1.5"><Calendar size={14} className="text-stone-400" />{new Date(bill.billDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-mono">₹{(bill.totalAmount - bill.cgst - bill.sgst - bill.igst).toFixed(2)}</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">₹{bill.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {delayStatus.isLocked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/40 px-2.5 py-1 rounded-full">
                              Pending (Available in {delayStatus.hoursLeft}h)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-650 bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-250/50 px-2.5 py-1 rounded-full">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setSelectedBill(bill)}
                              className="text-stone-605 hover:text-slate-900 dark:text-stone-300 dark:hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                            <button
                              disabled={delayStatus.isLocked}
                              onClick={() => handleDownloadClick(bill)}
                              className="text-amber-605 hover:text-amber-550 text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <Download size={14} />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* MODAL 1: VIEW BILL DETAILS */}
        {selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xl">
              <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-850 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tax Invoice Details</h3>
                  <p className="text-xs text-stone-500 mt-1">Invoice Number: {selectedBill.billNo}</p>
                </div>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="text-stone-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold font-mono"
                >
                  Close &times;
                </button>
              </div>

              <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">Billed To:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedBill.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">GSTIN:</span>
                  <span className="font-mono font-semibold">{selectedBill.gstNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Invoice Date:</span>
                  <span>{new Date(selectedBill.billDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-t border-stone-105 dark:border-stone-800 pt-3 text-base font-bold">
                  <span className="text-slate-900 dark:text-white">Grand Total Amount:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">₹{selectedBill.totalAmount.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-stone-105 dark:border-stone-800 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="px-4 py-2 border border-stone-200 dark:border-stone-850 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    Close View
                  </button>
                  <button
                    disabled={getBillDelayStatus(selectedBill.billDate).isLocked}
                    onClick={() => {
                      setSelectedBill(null);
                      handleDownloadClick(selectedBill);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-550 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: DOWNLOAD PDF FIRST TIME OTP VERIFICATION */}
        {showVerifyDownloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security Verification</h3>
                  <p className="text-xs text-stone-500 mt-1">Please authorize your first invoice download</p>
                </div>
                <button
                  onClick={() => {
                    setShowVerifyDownloadModal(false);
                    setDownloadOtp('');
                    setDownloadOtpSent(false);
                  }}
                  className="text-stone-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold"
                >
                  Close &times;
                </button>
              </div>

              {!downloadOtpSent ? (
                <div className="space-y-4">
                  <p className="text-sm text-stone-605 dark:text-stone-400 leading-relaxed">
                    For security reasons, your first PDF download requires an OTP. A code will be delivered to your registered email address.
                  </p>
                  <div className="rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 font-medium text-xs space-y-1 text-stone-600 dark:text-stone-300">
                    <div>GSTIN: <span className="font-mono font-bold text-slate-950 dark:text-white">{customerInfo.gstNo}</span></div>
                    <div>Registered Mobile: <span className="font-bold text-slate-950 dark:text-white">{customerInfo.mobileNo}</span></div>
                  </div>

                  {downloadError && (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSendDownloadOtp}
                    disabled={downloadOtpLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-550 disabled:opacity-50 transition-colors"
                  >
                    {downloadOtpLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Send Verification OTP</span>}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyDownloadOtp} className="space-y-4">
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-250/50 p-3 text-xs text-emerald-700">
                    <span>{downloadSuccess}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={downloadOtp}
                      onChange={(e) => setDownloadOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full text-center tracking-widest font-mono text-lg rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-955 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {downloadError && (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDownloadOtpSent(false)}
                      className="flex-1 rounded-xl border border-stone-250 px-4 py-3 text-xs font-bold text-stone-605 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={downloadOtpLoading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white hover:bg-amber-550 disabled:opacity-50 transition-colors"
                    >
                      {downloadOtpLoading ? <RefreshCw size={14} className="animate-spin" /> : <span>Verify & Download</span>}
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
