import React from 'react';
import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';
import { 
  ShieldCheck, 
  Truck, 
  BadgeCheck, 
  Layers, 
  Building2, 
  Settings, 
  Award, 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Sparkles,
  Grid,
  Box,
  FileText
} from 'lucide-react';

export default function Home() {
  const whatsappNumber = '918986043632';
  
  const heroWhatsAppText = encodeURIComponent(
    'Hi Ujjwal Iron, I am visiting your website and want to inquire about steel product rates.'
  );

  const categories = [
    {
      title: 'MS Pipes & Hollow Sections',
      desc: 'Round, Rectangle, and Square mild steel pipes and hollow structural sections.',
      brands: 'Tata Structura, Jindal Star, APL Apollo',
      icon: <Layers className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_ms_pipes.jpg',
      href: '/products?category=MS+Pipes'
    },
    {
      title: 'Tata Sheet & Jindal Sheet',
      desc: 'Genuine color-coated profile sheets, corrugated GI & GP sheets for roofing and sheds.',
      brands: 'Tata Bluescope, JSW Pragati, Jindal',
      icon: <Building2 className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_roofing_sheets.jpg',
      href: '/products?category=Tata+Sheet'
    },
    {
      title: 'HR Sheets & CR Pipe',
      desc: 'Hot Rolled and Cold Rolled precision pipes for automotive, furniture, and engineering fabrication.',
      brands: 'Jindal, Tata, High-Grade Mills',
      icon: <Box className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_ms_pipes.jpg',
      href: '/products?category=HR+Pipe'
    },
    {
      title: 'MS Angle & MS Channel',
      desc: 'Heavy structural angles and channels for fabrication, grids, industrial sheds, and base framing.',
      brands: 'SAIL, VIZAG Steel, Primary Mills',
      icon: <Settings className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_ms_angle_flat.jpg',
      href: '/products?category=MS+Angle'
    },
    {
      title: 'MS Flat & MS Bar',
      desc: 'Solid flat bars, round bars, square rods for iron grills, reinforcement, and structural supports.',
      brands: 'SAIL, RINL, Prime Rolling Mills',
      icon: <Award className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_ms_angle_flat.jpg',
      href: '/products?category=MS+Flat'
    },
    {
      title: 'Tata Pipe & Tata Chaukhat',
      desc: 'Premium Tata brand pipes and standard steel door Tata Chaukhat frames for residential & commercial building.',
      brands: 'Tata Structura, Ujjwal Fabricated',
      icon: <Building2 className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_structural_steel.jpg',
      href: '/products?category=Tata+Pipe'
    },
    {
      title: 'MS Plate & Heavy Sections',
      desc: 'High tensile mild steel plates, chequered plates, and heavy structural base plates.',
      brands: 'SAIL, Jindal, JSPL',
      icon: <Grid className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_structural_steel.jpg',
      href: '/products?category=MS+Plate'
    },
    {
      title: 'Stainless Steel (SS 202, 304, 316)',
      desc: 'Dedicated stainless steel division: SS pipes, sheets, rods, angles, and designer railing accessories.',
      brands: 'Jindal Stainless, Salem Steel',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      imageUrl: '/images/cat_structural_steel.jpg',
      href: '/stainless-steel'
    }
  ];

  const trustPillars = [
    {
      title: 'GST Verified Business',
      desc: '100% transparent invoicing with valid GST details for your commercial accounts.',
      icon: <BadgeCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
    },
    {
      title: 'Fast Yard Loading & Delivery',
      desc: 'Direct-to-site dispatch with flexible fleet options across Patna & Bihar.',
      icon: <Truck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
    },
    {
      title: 'Authorized Brands Only',
      desc: '100% genuine Mill Test Certified materials from Tata, Jindal & SAIL.',
      icon: <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    },
    {
      title: 'Wholesale B2B Pricing',
      desc: 'Daily updated competitive steel rates for builders, fabricators, and contractors.',
      icon: <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading and Value Proposition */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-6">
                <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Patna&apos;s Leading Industrial Steel Distributor</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.1]">
                Direct Wholesale Supply of{' '}
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-400 dark:via-amber-500 dark:to-yellow-400 bg-clip-text text-transparent">
                  Premium Steel Products
                </span> in Patna
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
                Authorized dealers of Tata Structura, Jindal Star, and SAIL. We supply high-grade MS Pipes, Tata/Jindal Sheets, HR/CR Sheet, Angles, Flats & Channels with fast, direct-to-site delivery.
              </p>

              {/* Call to Actions */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-8 py-4 font-bold text-white shadow-xl shadow-amber-600/10 dark:shadow-amber-600/20 transition-all duration-300 hover:bg-amber-500 hover:-translate-y-0.5"
                >
                  <span>View Product Catalog</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/stainless-steel"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-700 px-7 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5"
                >
                  <Sparkles size={18} className="text-amber-400" />
                  <span>Stainless Steel Division</span>
                </Link>
                
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${heroWhatsAppText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-600/5 dark:shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-500 hover:-translate-y-0.5"
                >
                  <MessageSquare size={18} />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Image Panel */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xl dark:shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/hero_steel_yard.jpg" 
                alt="Ujjwal Iron Stockyard Patna" 
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Pillars Banner */}
      <section className="relative -mt-10 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-8 backdrop-blur-md shadow-xl dark:shadow-2xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-800">
            {trustPillars.map((pillar, index) => (
              <div key={index} className="flex flex-col items-start gap-4 lg:px-6 first:pl-0">
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Our Core Categories</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Heavy-duty materials sourced directly from industry-leading mills</p>
          </div>
          <Link href="/products" className="group mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors">
            <span>View full catalog</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Categories Grid Layout with Product Images */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <div key={index} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-lg">
              
              {/* Category Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={cat.imageUrl} 
                  alt={cat.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 dark:bg-slate-900/90 p-2 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 shadow-sm">
                  {cat.icon}
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Popular Brands:</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cat.brands}</span>
                </div>
                <div className="mt-6 pt-2">
                  <Link 
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 dark:group-hover:text-amber-300"
                  >
                    <span>Browse Category</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Direct WhatsApp Callout Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-amber-600 dark:bg-amber-600/90 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
                Need Fast Pricing for Today&apos;s Dispatch?
              </h2>
              <p className="mt-3 text-amber-100 text-base sm:text-lg">
                Connect directly with our yard sales manager on WhatsApp for instant rate cards, weight calculations, and vehicle dispatch planning.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${heroWhatsAppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-amber-600 shadow-xl transition-all duration-300 hover:bg-slate-50 hover:scale-105"
              >
                <MessageSquare size={18} className="text-emerald-600" />
                <span>WhatsApp Live Chat</span>
              </a>
              <a
                href="tel:+918986043632"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-700/60 border border-amber-400/30 px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-amber-700"
              >
                <Phone size={18} />
                <span>Call +91 8986043632</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <InquiryForm />

    </div>
  );
}
