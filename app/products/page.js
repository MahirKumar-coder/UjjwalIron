import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { Filter, RotateCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const currentCategory = searchParams.category || '';
  
  // Connect to DB and fetch products matching category filter
  await dbConnect();
  const query = { isActive: true };
  if (currentCategory) {
    query.category = currentCategory;
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
    { name: 'Roofing Sheets', value: 'Roofing Sheets' },
    { name: 'TMT Bars', value: 'TMT Bars' },
    { name: 'GP Pipes', value: 'GP Pipes' },
    { name: 'Angles & Channels', value: 'Angles & Channels' },
    { name: 'Other', value: 'Other' },
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Digital Product Catalog
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Browse our range of high-grade steel pipes, TMT bars, and sheet profiles. Select a category below and request direct-to-site wholesale quotes.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-900 pb-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500">
            <Filter size={14} className="text-blue-600 dark:text-blue-500" />
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
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Catalog Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl py-20 px-4 text-center">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 mb-5">
              <RotateCcw size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              We couldn&apos;t find any products matching the category &quot;{currentCategory}&quot; in our catalog right now.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-500 transition-colors border border-slate-200 dark:border-slate-800"
            >
              Clear Filters & View All
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>Showing {products.length} {products.length === 1 ? 'product' : 'products'}</span>
              {currentCategory && (
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-900/50">
                  Category: {currentCategory}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
