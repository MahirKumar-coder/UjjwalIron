'use client';

import React, { useState } from 'react';
import { Tag, Shield, Maximize2, Scale, X, MessageCircle, Check, Sparkles } from 'lucide-react';

export default function ProductCard({ product, whatsappNumber = '918986043632' }) {
  const {
    name,
    brand,
    category,
    subCategory,
    availableSizes,
    sizeVariants,
    weightPerUnit,
    description,
    price,
    imageUrl,
    specifications,
  } = product;

  // Normalize variants list
  const variants = React.useMemo(() => {
    if (sizeVariants && sizeVariants.length > 0) {
      return sizeVariants;
    }
    if (availableSizes && availableSizes.length > 0) {
      return availableSizes.map((s) => ({ size: s, weight: weightPerUnit || '' }));
    }
    return [];
  }, [sizeVariants, availableSizes, weightPerUnit]);

  // Modal and Interactive Selection State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(10);

  const currentVariant = variants[selectedVariantIdx] || (variants.length > 0 ? variants[0] : null);

  // Extract numeric weight for estimation
  const getCalculatedWeight = () => {
    if (!currentVariant?.weight) return null;
    const match = currentVariant.weight.match(/([0-9]+(\.[0-9]+)?)/);
    if (!match) return null;
    const numWeight = parseFloat(match[1]);
    if (isNaN(numWeight) || numWeight <= 0) return null;
    const totalKg = (numWeight * (Number(quantity) || 1)).toFixed(1);
    const totalTon = (parseFloat(totalKg) / 1000).toFixed(3);
    return {
      unitKg: numWeight,
      totalKg,
      totalTon,
    };
  };

  const calculated = getCalculatedWeight();

  // WhatsApp link generator
  const getWhatsAppInquiryLink = () => {
    let text = `Hi Ujjwal Iron, I want to inquire about:
- *Product:* ${name}
- *Brand:* ${brand}
- *Category:* ${category}${subCategory ? ` (${subCategory})` : ''}`;

    if (currentVariant) {
      text += `\n- *Selected Size:* ${currentVariant.size}`;
      if (currentVariant.weight) {
        text += `\n- *Unit Weight:* ${currentVariant.weight}`;
      }
    }

    if (quantity && quantity > 0) {
      text += `\n- *Quantity:* ${quantity} Units / Pcs`;
    }

    if (calculated) {
      text += `\n- *Total Weight:* ~${calculated.totalKg} Kg (${calculated.totalTon} Ton)`;
    }

    text += `\n\nPlease share the latest wholesale price and availability. Thank you!`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Product Card Container */}
      <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl dark:hover:shadow-amber-950/20">
        
        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 sm:left-3.5 sm:top-3.5 z-10 flex flex-wrap gap-1.5 max-w-[90%] pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50/95 dark:bg-amber-950/90 px-2.5 py-0.5 text-2xs sm:text-xs font-bold text-amber-700 dark:text-amber-300 backdrop-blur-md border border-amber-200/60 dark:border-amber-900/60 shadow-xs">
            <Shield size={11} className="shrink-0" />
            <span className="truncate max-w-[100px]">{brand}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-900/90 px-2.5 py-0.5 text-2xs sm:text-xs font-bold text-slate-700 dark:text-slate-300 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs">
            <Tag size={11} className="shrink-0" />
            <span className="truncate max-w-[110px]">{category}</span>
          </span>
          {subCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 dark:bg-amber-500/25 px-2 py-0.5 text-3xs font-black uppercase text-amber-700 dark:text-amber-300 backdrop-blur-md border border-amber-500/30">
              {subCategory}
            </span>
          )}
        </div>

        {/* Product Image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer"
        >
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
                className="h-12 w-12 text-slate-300 dark:text-slate-800 transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-900"
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
              <span className="mt-1 text-3xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ujjwal Iron</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
          
          {/* Subtle click hint */}
          <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-3xs font-bold text-white flex items-center gap-1 border border-white/10">
            <Scale size={11} className="text-amber-400" />
            <span>Click for Sizes & Weight</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3
            onClick={() => setIsModalOpen(true)}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400 leading-snug cursor-pointer"
          >
            {name}
          </h3>
          
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Sizes & Weights Preview Pills */}
          {variants.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Maximize2 size={9} />
                  <span>Available Sizes ({variants.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-3xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View Weights &rarr;
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-[50px] overflow-hidden">
                {variants.slice(0, 3).map((v, idx) => (
                  <span
                    key={idx}
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer rounded-md bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/50 border border-slate-200 dark:border-slate-700/60 px-2 py-0.5 text-2xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {v.size}
                  </span>
                ))}
                {variants.length > 3 && (
                  <span
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 text-2xs font-bold"
                  >
                    +{variants.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price & Action Buttons */}
          <div className="mt-auto pt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Price</span>
              <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{price}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
              >
                <Scale size={13} />
                <span>Sizes & Weight</span>
              </button>

              <a
                href={getWhatsAppInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIMPLIFIED & USER-FRIENDLY PRODUCT SPECIFICATION MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {brand}
                  </span>
                  <span className="text-2xs text-slate-400">
                    {category} {subCategory ? `• ${subCategory}` : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* 1. Size Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  1. Choose Size (साइज़ चुनें)
                </label>

                {variants.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {variants.map((v, idx) => {
                      const isSelected = selectedVariantIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedVariantIdx(idx)}
                          className={`flex flex-col p-2.5 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-600 dark:border-amber-500 ring-2 ring-amber-500/30 text-slate-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-xs sm:text-sm truncate pr-1">{v.size}</span>
                            {isSelected && <Check size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />}
                          </div>
                          {v.weight && (
                            <span className="text-2xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                              {v.weight}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    Standard & custom dimensions available as per requirements.
                  </p>
                )}
              </div>

              {/* 2. Quantity Presets & Total Weight Box */}
              <div className="rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    2. Quantity & Total Weight (मात्रा और कुल वजन)
                  </label>
                  <Scale size={15} className="text-amber-600 dark:text-amber-400" />
                </div>

                {/* Quick Quantity Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[5, 10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantity(num)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        quantity === num
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-500'
                      }`}
                    >
                      {num} Pcs
                    </button>
                  ))}
                </div>

                {/* Number Input & Weight Result */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Custom Quantity:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-center text-sm font-black text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-amber-500/30 flex flex-col justify-center text-center">
                    <span className="text-3xs font-bold uppercase text-slate-400">Total Approx Weight</span>
                    {calculated ? (
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono leading-tight">
                        ~{calculated.totalKg} Kg
                        <span className="text-3xs font-normal text-slate-500 block">
                          (~{calculated.totalTon} Metric Ton)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {currentVariant?.weight || weightPerUnit || 'On Request'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Specifications */}
              {specifications && specifications.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Specifications (तकनीकी विवरण)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specifications.map((spec, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-3xs text-slate-400 block font-medium">{spec.key}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Sticky Footer CTA */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 shrink-0">
              <a
                href={getWhatsAppInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 px-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-98"
              >
                <MessageCircle size={18} />
                <span>
                  Get WhatsApp Price for {currentVariant?.size || 'Product'} {calculated ? `(~${calculated.totalKg} Kg)` : ''}
                </span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
