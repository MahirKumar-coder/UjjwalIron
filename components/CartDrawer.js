'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  Scale, 
  Plus, 
  Minus, 
  MapPin, 
  User, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer({ whatsappNumber = '918986043632' }) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    totalWeightKg,
    totalWeightTons,
    itemTypesCount,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  if (!isCartOpen) return null;

  // Build structured multi-item WhatsApp Order message
  const handleSendToWhatsApp = () => {
    if (cart.length === 0) return;

    let text = `*New Bulk Steel Order / Rate Inquiry - Ujjwal Iron*\n`;
    
    if (customerName.trim()) {
      text += `*Customer / Firm:* ${customerName.trim()}\n`;
    }
    if (deliveryLocation.trim()) {
      text += `*Delivery Site:* ${deliveryLocation.trim()}\n`;
    }
    if (orderNotes.trim()) {
      text += `*Special Note:* ${orderNotes.trim()}\n`;
    }

    text += `\n*Material List (${itemTypesCount} Items):*\n`;

    cart.forEach((item, idx) => {
      text += `\n${idx + 1}. *${item.name}* (${item.brand})`;
      if (item.size) {
        text += `\n   - *Size:* ${item.size}`;
      }
      if (item.weight) {
        text += `\n   - *Unit Weight:* ${item.weight}`;
      }
      text += `\n   - *Required Qty:* ${item.quantity} Units / Pcs`;
      if (item.totalWeightKg > 0) {
        text += ` (~${item.totalWeightKg} Kg)`;
      }
    });

    text += `\n\n--------------------------------------\n`;
    text += `*Total Units:* ${totalItemsCount} Pcs\n`;
    if (parseFloat(totalWeightKg) > 0) {
      text += `*Total Estimated Weight:* ~${totalWeightKg} Kg (${totalWeightTons} Metric Ton)\n`;
    }
    text += `--------------------------------------\n`;
    text += `Please share current wholesale rates per Ton/Piece, payment terms, and delivery timeline. Thank you!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Steel Order Cart
                </h2>
                <p className="text-2xs text-slate-500 font-medium">
                  {itemTypesCount} item{itemTypesCount !== 1 ? 's' : ''} selected • {totalItemsCount} total units
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-2xs font-bold transition-colors"
                  title="Clear Cart"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
                <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                  <ShoppingBag size={36} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Your Cart is Empty</h3>
                <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-relaxed">
                  Select your required MS Pipes, Sheets, Angles, or Chaukhat to estimate total weight and send a multi-item quote request to the owner.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all"
                >
                  <span>Browse Product Catalog</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="h-16 w-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                          {item.imageUrl && item.imageUrl !== '/images/placeholder.jpg' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Scale size={20} className="text-slate-400" />
                          )}
                        </div>

                        {/* Title & Specs */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-3xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {item.brand}
                            </span>
                            <span className="text-3xs text-slate-400 truncate">
                              {item.category}
                            </span>
                          </div>

                          {/* Selected Size & Weight Badge */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-2xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                              Size: {item.size}
                            </span>
                            {item.weight && (
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                • {item.weight}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Calculated Weight Row */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 5)}
                            className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center text-2xs active:scale-95"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center active:scale-95"
                          >
                            <Minus size={11} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="h-7 w-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-xs font-black text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center active:scale-95"
                          >
                            <Plus size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 5)}
                            className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center text-2xs active:scale-95"
                          >
                            +5
                          </button>
                          <span className="text-3xs text-slate-400 font-bold ml-1">Pcs</span>
                        </div>

                        {/* Calculated weight for this item */}
                        <div className="text-right">
                          {item.totalWeightKg > 0 ? (
                            <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                              ~{item.totalWeightKg} Kg
                            </span>
                          ) : (
                            <span className="text-2xs font-semibold text-slate-400">
                              Qty: {item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Customer Information Form */}
                <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-2.5">
                  <span className="text-3xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                    Customer & Site Info (Optional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center gap-1 text-3xs font-bold text-slate-500 mb-1">
                        <User size={10} />
                        <span>Your Name / Firm</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-3xs font-bold text-slate-500 mb-1">
                        <MapPin size={10} />
                        <span>Delivery Site / City</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Danapur, Patna"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Summary and Direct WhatsApp Dispatch */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 space-y-3 shadow-lg">
              
              {/* Overall Total Weight Card */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">
                    Total Estimated Weight
                  </span>
                  <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono leading-tight">
                    ~{totalWeightKg} Kg
                    {parseFloat(totalWeightTons) > 0 && (
                      <span className="text-2xs font-normal text-slate-500 ml-1">
                        (~{totalWeightTons} MT)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">
                    Total Quantity
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {totalItemsCount} Units
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Send Button */}
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3.5 px-4 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
              >
                <MessageCircle size={19} />
                <span>Send {itemTypesCount} Items to Owner on WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-3xs text-slate-400">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Instant direct quotation from Ujjwal Iron yard management</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
