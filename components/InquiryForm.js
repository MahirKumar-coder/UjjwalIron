'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    productNeeded: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: '' });

    // Client-side validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus({ success: false, message: 'Name and Phone number are required.' });
      setLoading(false);
      return;
    }

    try {
      // Step 1: Call Backend API to send Email
      const response = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          success: true,
          message: 'Inquiry submitted! Redirecting to WhatsApp...',
        });

        // Step 2: Trigger WhatsApp Redirect (Owner ka number yahan daalo)
        const ownerWhatsAppNumber = '918986043632'; // Make sure 91 is prepended
        const text = `Hi Ujjwal Iron, I have a new inquiry:
- *Name:* ${formData.name}
- *Phone:* ${formData.phone}
${formData.productNeeded ? `- *Product Needed:* ${formData.productNeeded}` : ''}
${formData.message ? `- *Details:* ${formData.message}` : ''}`;
        
        const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(text)}`;
        
        // Open WhatsApp in new tab
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500); // 1.5 second delay so they can read the success message

        // Clear form
        setFormData({ name: '', phone: '', productNeeded: '', message: '' });
      } else {
        setStatus({
          success: false,
          message: result.error || 'Failed to send inquiry. Please try again.',
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Network error. Please check your internet connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-sm dark:shadow-none">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send a Quick Inquiry</h3>

      {status.success === true && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/60 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>{status.message}</span>
        </div>
      )}

      {status.success === false && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-250 dark:border-rose-900/60 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kumar"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Phone input */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 99999 99999"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-655 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Product Needed */}
        <div>
          <label htmlFor="productNeeded" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Products Needed
          </label>
          <input
            type="text"
            id="productNeeded"
            name="productNeeded"
            value={formData.productNeeded}
            onChange={handleChange}
            placeholder="e.g. 5 Tons of MS Square Pipe 50mm, 20 TMT Rebars"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-655 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Additional Specifications (Message)
          </label>
          <textarea
            id="message"
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your size, thickness, grade, or delivery location details..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-655 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          ) : (
            <>
              <Send size={16} />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
