import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { Filter, RotateCcw, Sparkles, ArrowRight, Package, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const currentCategory = searchParams?.category || '';
  const currentSubCategory = searchParams?.subCategory || '';
  const searchQuery = searchParams?.q || '';
  
  // Connect to DB and fetch products matching filters
  await dbConnect();
  const query = { isActive: true };
  if (currentCategory) {
    query.category = currentCategory;
  }
  if (currentSubCategory) {
    query.subCategory = currentSubCategory;
  }
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { brand: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
    ];
  }
  
  // Fetch products and serialize MongoDB documents
  const productsRaw = await Product.find(query).sort({ updatedAt: -1 });
  const products = productsRaw.map((doc) => {
    const product = doc.toObject();
    product._id = product._id.toString();
    if (product.createdAt) product.createdAt = product.createdAt.toISOString();
    if (product.updatedAt) product.updatedAt = product.updatedAt.toISOString();
    if (product.specifications) {
      product.specifications = product.specifications.map((s) => ({
        ...s,
        _id: s._id ? s._id.toString() : undefined,
      }));
    }
    if (product.sizeVariants) {
      product.sizeVariants = product.sizeVariants.map((v) => ({
        size: v.size,
        weight: v.weight || '',
        _id: v._id ? v._id.toString() : undefined,
      }));
    } else {
      product.sizeVariants = [];
    }
    product.availableSizes = Array.isArray(product.availableSizes) ? product.availableSizes : [];
    product.weightPerUnit = product.weightPerUnit || '';
    return product;
  });

  const categories = [
    { name: 'All Products', value: '' },
    { name: 'MS Pipes', value: 'MS Pipes' },
    { name: 'Tata Pipe', value: 'Tata Pipe' },
    { name: 'HR Pipe', value: 'HR Pipe' },
    { name: 'CR Pipe', value: 'CR Pipe' },
    { name: 'Tata Sheet', value: 'Tata Sheet' },
    { name: 'Jindal Sheet', value: 'Jindal Sheet' },
    { name: 'MS Angle', value: 'MS Angle' },
    { name: 'MS Flat', value: 'MS Flat' },
    { name: 'MS Channel', value: 'MS Channel' },
    { name: 'MS Bar', value: 'MS Bar' },
    { name: 'MS Plate', value: 'MS Plate' },
    { name: 'Chaukhat', value: 'Chaukhat' },
    { name: 'Other', value: 'Other' },
  ];

  const msPipeSubCategories = [
    { name: 'All MS Pipes', value: '' },
    { name: 'Round (गोल)', value: 'Round' },
    { name: 'Rectangle (आयत)', value: 'Rectangle' },
    { name: 'Square (चौकोर)', value: 'Square' },
  ];

  return (
    <div className="min-h-screen py-8 sm:py-16 lg:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-2xs sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
            <Package size={13} />
            <span>Direct Wholesale Supply • Patna Yard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Digital Product Catalog
          </h1>
          <p className="mt-2.5 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed px-2">
            Explore our industrial range of MS Pipes, Tata & Jindal Sheets, HR/CR Pipes, Angles, Channels, MS Bars, and Chaukhats.
          </p>
        </div>

        {/* Stainless Steel Showcase Banner (Fully Responsive) */}
        <div className="mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-4 sm:p-6 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="rounded-xl bg-amber-500/20 p-2 sm:p-2.5 text-amber-400 border border-amber-500/30 shrink-0">
              <Sparkles size={20} className="sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="font-black text-sm sm:text-base md:text-lg text-white">Looking for Stainless Steel (SS 202, 304, 316)?</h4>
              <p className="text-2xs sm:text-xs md:text-sm text-slate-300">Visit our dedicated division for SS pipes, sheets, rods & designer railing fittings.</p>
            </div>
          </div>
          <Link
            href="/stainless-steel"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all shrink-0 active:scale-95"
          >
            <span>View Stainless Steel</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category Filters Bar (Horizontal Touch Swipe on Mobile, Wrap on Desktop) */}
        <div className="flex flex-col gap-3.5 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8 mb-8 sm:mb-12">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-2xs sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              <Filter size={13} className="text-amber-600 dark:text-amber-500" />
              <span>Categories ({categories.length - 1})</span>
            </div>
            
            <span className="text-2xs sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white font-mono">{products.length}</strong> {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Swipeable Scroll Container on Mobile */}
          <div className="relative -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-2 sm:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
              {categories.map((cat) => {
                const active = currentCategory === cat.value;
                return (
                  <Link
                    key={cat.name}
                    href={cat.value ? `/products?category=${encodeURIComponent(cat.value)}` : '/products'}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold border transition-all duration-200 ${
                      active
                        ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-500/25'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sub-Category Filter Bar for MS Pipes (Responsive) */}
          {currentCategory === 'MS Pipes' && (
            <div className="mt-1 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 p-3 sm:p-4">
              <span className="text-3xs sm:text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-2 sm:mb-3">
                MS Pipe Section Shape (अनुभाग आकार):
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {msPipeSubCategories.map((sub) => {
                  const active = currentSubCategory === sub.value;
                  const targetHref = sub.value 
                    ? `/products?category=MS+Pipes&subCategory=${encodeURIComponent(sub.value)}`
                    : '/products?category=MS+Pipes';
                  return (
                    <Link
                      key={sub.name}
                      href={targetHref}
                      className={`rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-2xs sm:text-xs font-bold border transition-all ${
                        active
                          ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Catalog Grid (Responsive 1-col on phone, 2-col on tablet, 3/4-col on desktop) */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-16 sm:py-20 px-4 text-center">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 mb-4">
              <RotateCcw size={28} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              We couldn&apos;t find any products matching &quot;{currentCategory || 'Selected Filter'}{currentSubCategory ? ` (${currentSubCategory})` : ''}&quot; right now.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 transition-colors border border-slate-200 dark:border-slate-800"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
