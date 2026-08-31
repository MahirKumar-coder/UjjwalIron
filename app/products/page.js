import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { Filter, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const currentCategory = searchParams?.category || '';
  const currentSubCategory = searchParams?.subCategory || '';
  
  // Connect to DB and fetch products matching category and subCategory filter
  await dbConnect();
  const query = { isActive: true };
  if (currentCategory) {
    query.category = currentCategory;
  }
  if (currentSubCategory) {
    query.subCategory = currentSubCategory;
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
    <div className="min-h-screen py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Digital Product Catalog
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Explore our industrial range of MS Pipes, Tata & Jindal Sheets, HR/CR Pipes, Angles, Channels, MS Bars, and Chaukhats. Wholesale rates delivered directly to your site.
          </p>
        </div>

        {/* Stainless Steel Showcase Banner */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-5 sm:p-6 text-white shadow-lg border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 border border-amber-500/30">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="font-black text-base sm:text-lg text-white">Looking for Stainless Steel (SS 202, 304, 316)?</h4>
              <p className="text-xs sm:text-sm text-slate-300">Explore our dedicated stainless steel pipes, sheets, rods, and architectural fittings section.</p>
            </div>
          </div>
          <Link
            href="/stainless-steel"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all shrink-0"
          >
            <span>View Stainless Steel</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-col gap-5 border-b border-slate-200 dark:border-slate-900 pb-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Filter size={14} className="text-amber-600 dark:text-amber-500" />
            <span>Filter Categories</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = currentCategory === cat.value;
              return (
                <Link
                  key={cat.name}
                  href={cat.value ? `/products?category=${encodeURIComponent(cat.value)}` : '/products'}
                  className={`rounded-full px-5 py-2 text-sm font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Sub-Category Filter Bar for MS Pipes */}
          {currentCategory === 'MS Pipes' && (
            <div className="mt-2 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-3">
                MS Pipe Section Shape (उप-श्रेणी):
              </span>
              <div className="flex flex-wrap gap-2">
                {msPipeSubCategories.map((sub) => {
                  const active = currentSubCategory === sub.value;
                  const targetHref = sub.value 
                    ? `/products?category=MS+Pipes&subCategory=${encodeURIComponent(sub.value)}`
                    : '/products?category=MS+Pipes';
                  return (
                    <Link
                      key={sub.name}
                      href={targetHref}
                      className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                        active
                          ? 'bg-amber-600 border-amber-600 text-white shadow-md'
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

        {/* Catalog Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl py-20 px-4 text-center">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 mb-5">
              <RotateCcw size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              We couldn&apos;t find any products matching &quot;{currentCategory}{currentSubCategory ? ` (${currentSubCategory})` : ''}&quot; in our catalog right now.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-500 transition-colors border border-slate-200 dark:border-slate-800"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
