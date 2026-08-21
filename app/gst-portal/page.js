'use client';

import React, { useState, useEffect } from 'react';
import { Download, Lock, CheckCircle2, Shield, Calendar, RefreshCw, AlertCircle, Eye, LogOut } from 'lucide-react';

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
            ? `[DEV Mode] Verification OTP sent: ${data.devOtp} (Sent to registered email)`
            : 'OTP Sent successfully to your registered email address!'
        );
      } else {
        setOtpError(data.error || 'Failed to request code. Check registered details.');
      }
    } catch (err) {
      setOtpError('Connection error. Try again.');
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
        setOtpError(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setOtpError('Connection error. Try again.');
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
            ? `[DEV Mode] Verification OTP: ${data.devOtp} (Sent to registered email)`
            : 'OTP Sent successfully to your registered email address!'
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
        setDownloadError(data.error || 'Invalid OTP code.');
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
      window.open(targetUrl, '_blank');

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
            <div className="rounded-full bg-amber-600/10 dark:bg-amber-500/10 border border-amber-500/20 p-4 text-amber-600 dark:text-amber-500 mb-3">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customer GST Portal</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Access tax invoices & download verified bills</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Your GSTIN Number</label>
                <input
                  type="text"
                  required
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value.toUpperCase())}
                  placeholder="Enter GSTIN (e.g. 10AIAPR...)"
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Registered Mobile Number</label>
                <input
                  type="text"
                  required
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  placeholder="Enter Mobile No..."
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {otpError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-3 text-xs text-rose-600 font-bold">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-amber-500 disabled:opacity-50 transition-all duration-300"
              >
                {otpLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Request Verification OTP</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 p-3.5 text-xs text-emerald-700 dark:text-emerald-400">
                <span>{otpSuccess}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP code..."
                  className="w-full text-center tracking-widest font-mono text-lg rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {otpError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-3 text-xs text-rose-600 font-bold">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white hover:bg-amber-500 disabled:opacity-50 transition-colors"
                >
                  {otpLoading ? <RefreshCw size={14} className="animate-spin" /> : <span>Verify Code</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 dark:border-stone-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{customerInfo.name}</h1>
            <p className="text-sm text-stone-500 mt-1 font-mono">GSTIN: {customerInfo.gstNo} | Email: {customerInfo.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* GST Invoices Section */}
        <div className="rounded-3xl border border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-900/40 p-6 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Uploaded GST Bills</h2>
            <button
              onClick={fetchBills}
              className="p-2 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 hover:text-slate-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Refresh Invoices"
            >
              <RefreshCw size={14} className={billsLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {billsLoading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={32} className="animate-spin text-stone-400" />
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-20 text-stone-500">No GST Invoices found under your GSTIN number.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 rounded-l-xl">Bill No</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Total Amount</th>
                    <th className="px-6 py-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {bills.map((bill) => {
                    return (
                      <tr key={bill._id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{bill.billNo}</td>
                        <td className="px-6 py-4 text-stone-600 dark:text-stone-300 flex items-center gap-1.5"><Calendar size={14} className="text-stone-400 shrink-0" /><span>{new Date(bill.billDate).toLocaleDateString()}</span></td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">₹{bill.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setSelectedBill(bill)}
                              className="text-stone-500 hover:text-slate-900 dark:text-stone-300 dark:hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Eye size={14} />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleDownloadClick(bill)}
                              className="text-amber-600 hover:text-amber-500 text-xs font-bold flex items-center gap-1 transition-colors"
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
              <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
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
                <div className="flex justify-between border-t border-stone-200 dark:border-stone-850 pt-3 text-base font-bold">
                  <span className="text-slate-900 dark:text-white">Grand Total Amount:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">₹{selectedBill.totalAmount.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-stone-850 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    Close View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBill(null);
                      handleDownloadClick(selectedBill);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 transition-colors"
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
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    For security reasons, your first PDF download requires an OTP. A code will be delivered to your registered email address.
                  </p>
                  <div className="rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 font-medium text-xs space-y-1 text-stone-600 dark:text-stone-300">
                    <div>GSTIN: <span className="font-mono font-bold text-slate-900 dark:text-white">{customerInfo.gstNo}</span></div>
                    <div>Registered Mobile: <span className="font-bold text-slate-900 dark:text-white">{customerInfo.mobileNo}</span></div>
                  </div>

                  {downloadError && (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSendDownloadOtp}
                    disabled={downloadOtpLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-500 disabled:opacity-50 transition-colors"
                  >
                    {downloadOtpLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Send Verification OTP</span>}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyDownloadOtp} className="space-y-4">
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-250/50 p-3 text-xs text-emerald-700">
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
                      className="w-full text-center tracking-widest font-mono text-lg rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {downloadError && (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 p-3 text-xs text-rose-600">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDownloadOtpSent(false)}
                      className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={downloadOtpLoading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white hover:bg-amber-500 disabled:opacity-50 transition-colors"
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
