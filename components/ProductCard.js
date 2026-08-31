'use client';

import React from 'react';
import { Tag, Shield } from 'lucide-react';

export default function ProductCard({ product, whatsappNumber = '918986043632' }) {
  const { name, brand, category, subCategory, description, price, imageUrl, specifications } = product;

  // Build dynamic pre-filled WhatsApp message
  const getWhatsAppLink = () => {
    const text = `Hi Ujjwal Iron, I want to know the latest price and details for:
- *Product:* ${name}
- *Brand:* ${brand}
- *Category:* ${category}${subCategory ? ` (${subCategory})` : ''}
${specifications && specifications.length > 0 
  ? `- *Specs:* ${specifications.map(s => `${s.key}: ${s.value}`).join(', ')}` 
  : ''
}
Please share the current pricing. Thank you!`;
    
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl dark:hover:shadow-amber-950/20">
      
      {/* Brand & Category Badges */}
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <span className="flex items-center gap-1 rounded-full bg-amber-50/95 dark:bg-amber-950/80 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/50">
          <Shield size={12} />
          {brand}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-slate-100/95 dark:bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 backdrop-blur-md border border-slate-200 dark:border-slate-800/50">
          <Tag size={12} />
          {category}
        </span>
        {subCategory && (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 backdrop-blur-md border border-amber-500/30">
            {subCategory}
          </span>
        )}
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        {imageUrl && imageUrl !== '/images/placeholder.jpg' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%230f172a"/><path d="M150 100 L250 100 L250 200 L150 200 Z" fill="none" stroke="%23334155" stroke-width="4"/><line x1="150" y1="100" x2="250" y2="200" stroke="%23334155" stroke-width="2"/><line x1="250" y1="100" x2="150" y2="200" stroke="%23334155" stroke-width="2"/><text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" fill="%23475569" font-family="sans-serif" font-size="14">Steel Product Showcase</text></svg>';
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-700">
            <svg
              className="h-16 w-16 text-slate-350 dark:text-slate-800 transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ujjwal Iron</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-40 dark:opacity-60"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
          {name}
        </h3>
        
        {description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Specifications List */}
        {specifications && specifications.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-200 dark:border-slate-800/80 pt-3">
            {specifications.slice(0, 3).map((spec, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-400 dark:text-slate-500">{spec.key}:</span>
                <span className="text-slate-700 dark:text-slate-300">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Row */}
        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Price</span>
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-450">{price}</span>
          </div>

          {/* Normal Solid WhatsApp CTA Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-605/20 dark:hover:shadow-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
          >
            {/* WhatsApp Icon */}
            <svg
              className="h-5 w-5 fill-current shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.022-.079-.085-.125-.27-.218l-1.353-.666c-.19-.094-.326-.062-.43.094l-.603.743c-.11.135-.22.15-.41.06-.186-.094-.787-.29-1.5-.928-.553-.493-.928-1.103-1.036-1.293-.11-.19-.012-.293.08-.386l.262-.3c.09-.1.12-.17.18-.282.06-.11.03-.21-.015-.3l-.666-1.6c-.183-.44-.363-.377-.497-.384l-.423-.008c-.144 0-.378.054-.576.27-.198.22-.756.74-.756 1.8 0 1.06.773 2.083.88 2.23.11.147 1.522 2.322 3.69 3.258.516.223.918.356 1.233.456.518.165.99.14 1.36.085.414-.06 1.272-.518 1.452-1.02.18-.5.18-.93.125-1.018l-.262-.132zm-5.467 6.471h-.002c-1.897 0-3.758-.51-5.385-1.471l-.386-.23-4.004 1.048 1.068-3.905-.25-.397c-1.054-1.68-1.61-3.627-1.61-5.644 0-5.75 4.68-10.43 10.43-10.43 2.785 0 5.405 1.085 7.37 3.055 1.968 1.97 3.05 4.588 3.05 7.375 0 5.753-4.68 10.434-10.43 10.434zM12 0C5.373 0 0 5.373 0 12c0 2.102.544 4.156 1.583 5.975L0 24l6.19-1.624C7.96 23.36 9.94 24 12 24c6.627 0 12-5.373 12-12 0-3.206-1.25-6.22-3.513-8.487C18.22 1.25 15.206 0 12 0z" />
            </svg>
            <span>Get Latest Price</span>
          </a>
        </div>

      </div>
    </div>
  );
}
