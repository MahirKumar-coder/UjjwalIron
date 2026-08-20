import React from 'react';
import InquiryForm from '@/components/InquiryForm';
import { Phone, Mail, MapPin, BadgeCheck, ShieldCheck, Building2, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact & About Us | Ujjwal Iron Patna',
  description:
    'Find Ujjwal Iron yard location, verified GST details, and contact information. Get in touch for structural steel supplies, MS Pipes, and MS Angles & Flats in Patna.',
};

export default function ContactPage() {
  const phone = '+918986043632';
  const email = 'sales@ujjwaliron.com';
  const gstin = '10AIAPR5590E1ZJ';
  const address = 'H/o Lalmati Devi, Ashiyana Digha Road, Digha Ghat, Patna, Bihar 800011';
  
  // Custom Google Map embed src pointing to Digha Ghat, Patna
  const googleMapEmbedSrc = "https://maps.google.com/maps?q=Ashiyana%20Digha%20Road,%20Digha%20Ghat,%20Patna,%20Bihar%20800011&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="min-h-screen py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            About & Contact Us
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Learn more about Ujjwal Iron and get in touch with our sales office for commercial or residential inquiries.
          </p>
        </div>

        {/* Section 1: History and Credibility */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-250 dark:border-amber-900/50 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-6">
              <Building2 size={12} />
              <span>Our Legacy</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
              Your Trusted Structural Steel Partner Since 2012
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Established in Patna, Ujjwal Iron has grown from a local merchant yard into one of Bihar’s most reliable suppliers of structural and industrial steel products. We serve contractors, developers, and retailers with transparency and efficiency.
              </p>
              <p>
                As authorized dealers of prominent manufacturers, we ensure that every batch of MS Pipes, MS Angles, MS Flats, and Roofing Sheets conforms to standard industry parameters and carries authentic manufacturer test certificates.
              </p>
            </div>

            {/* Verification details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 shadow-sm dark:shadow-none">
                <BadgeCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">GST Registered</h4>
                  <p className="text-xs text-slate-500">{gstin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 shadow-sm dark:shadow-none">
                <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Authorized Dealer</h4>
                  <p className="text-xs text-slate-500">Tata, Jindal, SAIL</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm dark:shadow-none">
            {/* Visual representation of warehouse */}
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-400 dark:text-slate-700 p-6 text-center">
              <svg className="h-20 w-20 text-slate-350 dark:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-4 font-bold text-slate-800 dark:text-slate-400">Patna Warehousing Stockyard</h3>
              <p className="text-xs text-slate-550 dark:text-slate-500 mt-2 max-w-xs">
                Featuring robust storage for raw pipes, structural angles, and flat steel, enabling prompt dispatches.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-500 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Our Stockyard & Office</h5>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{address}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-500 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Call Sales Desk</h5>
                    <a href={`tel:${phone}`} className="text-base font-bold text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                      {phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-500 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Email Inquiries</h5>
                    <a href={`mailto:${email}`} className="text-sm text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-500 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Yard Hours</h5>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Mon - Sat: 09:00 AM - 07:00 PM</p>
                    <p className="text-xs text-slate-550 mt-1">Sundays Closed</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <InquiryForm />
          </div>
        </div>

        {/* Section 3: Maps Frame */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 shadow-xl dark:shadow-none">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-455 dark:text-slate-500">
            <MapPin size={14} className="text-amber-600 dark:text-amber-500" />
            <span>Interactive Yard Route (Google Maps)</span>
          </div>
          <iframe
            src={googleMapEmbedSrc}
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full grayscale dark:contrast-125 dark:opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
