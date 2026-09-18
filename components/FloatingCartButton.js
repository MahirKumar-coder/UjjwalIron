'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';

export default function FloatingCartButton() {
  const { totalItemsCount, totalWeightKg, setIsCartOpen, itemTypesCount, toastMessage, setToastMessage } = useCart();

  return (
    <>
      {/* Toast Notification when adding item */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-950/90 text-white px-4 py-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-3xs font-black uppercase text-white tracking-wider flex items-center gap-1"
          >
            <span>View Cart</span>
            <ArrowRight size={10} />
          </button>
        </div>
      )}

      {/* Floating Cart Button */}
      {itemTypesCount > 0 && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-40 animate-in fade-in zoom-in duration-300">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-slate-900 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white px-4 sm:px-5 py-3 shadow-2xl shadow-slate-900/50 dark:shadow-amber-600/40 border border-white/20 transition-all hover:scale-105 active:scale-95"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag size={20} className="text-amber-400 dark:text-white" />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-3xs font-black text-white shadow-xs">
                {itemTypesCount}
              </span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs font-black leading-tight">
                View Cart ({totalItemsCount})
              </span>
              {parseFloat(totalWeightKg) > 0 && (
                <span className="text-3xs font-mono font-medium text-slate-300 dark:text-amber-100">
                  ~{totalWeightKg} Kg total
                </span>
              )}
            </div>
          </button>
        </div>
      )}
    </>
  );
}
