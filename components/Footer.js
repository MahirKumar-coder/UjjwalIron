'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer({
  phone = '+918986043632',
  email = 'sales@ujjwaliron.com',
  gstin = '10AIAPR5590E1ZJ',
  address = 'H/o Lalmati Devi, Ashiyana Digha Road, Digha Ghat, Patna, Bihar 800011',
  mapUrl = 'https://maps.google.com/?q=Ujjwal+Iron+Ashiyana+Digha+Road+Patna'
}) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-650 dark:border-slate-900 dark:bg-slate-950 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="Ujjwal Iron Logo"
                className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 object-cover shadow-sm"
              />
              <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white">
                UJJWAL <span className="text-blue-500">IRON</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Leading wholesale supplier and retailer of industrial steel, structural bars, and roofing solutions. Authorized distributor in Patna.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-slate-200/60 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 w-fit">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-500" />
              <span>GSTIN: {gstin}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-900 dark:text-white uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Product Catalog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact & GST Info</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-900 dark:text-white uppercase mb-4">Sales Desk</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-blue-600 dark:text-blue-500 shrink-0" />
                <a href={`tel:${phone}`} className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-blue-600 dark:text-blue-500 shrink-0" />
                <a href={`mailto:${email}`} className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{email}</a>
              </li>
            </ul>
          </div>

          {/* Location & Map Link */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-900 dark:text-white uppercase mb-4">Our Yard Location</h3>
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{address}</p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 transition-colors mt-1"
                >
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Ujjwal Iron. All rights reserved.</p>
          <p className="text-slate-500 dark:text-slate-600">Authorized Dealer: Tata Structura | Jindal Star | SAIL</p>
        </div>
      </div>
    </footer>
  );
}
