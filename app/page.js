import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Phone, 
  Award, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MessageSquare, 
  Settings, 
  Layers, 
  Building2, 
  BadgeCheck 
} from 'lucide-react';

export default function Home() {
  const whatsappNumber = '918986043632';
  const phoneNumber = '+918986043632';
  
  const heroWhatsAppText = encodeURIComponent(
    'Hi Ujjwal Iron, I am visiting your website and want to inquire about steel product rates.'
  );

  const categories = [
    {
      title: 'MS Pipes & Tubes',
      desc: 'High durability Mild Steel pipes, structural hollow sections (RHS/SHS), and water pipes.',
      brands: 'Jindal Star, Tata Structura, APL Apollo',
      icon: <Layers className="h-5 w-5 text-amber-500 dark:text-amber-450" />,
      imageUrl: '/images/cat_ms_pipes.jpg',
      href: '/products?category=MS+Pipes'
    },
    {
      title: 'Roofing Sheets',
      desc: 'Premium color-coated profile sheets, polycarbonate sheets, and accessories for industrial sheds.',
      brands: 'Tata Bluescope, JSW Pragati',
      icon: <Building2 className="h-5 w-5 text-amber-500 dark:text-amber-450" />,
      imageUrl: '/images/cat_roofing_sheets.jpg',
      href: '/products?category=Roofing+Sheets'
    },
    {
      title: 'MS Angle & MS Flat',
      desc: 'Top quality Mild Steel structural Angles and flat iron bars for structural fabrication, grids, and frames.',
      brands: 'SAIL, VIZAG Steel, local high-grade mills',
      icon: <Settings className="h-5 w-5 text-amber-500 dark:text-amber-450" />,
      imageUrl: '/images/cat_ms_angle_flat.jpg',
      href: '/products?category=MS+Angle+%26+MS+Flat'
    },
    {
      title: 'Structural Steel',
      desc: 'Heavy structural members including MS Angles, Channels, I-Beams, and flat sections.',
      brands: 'SAIL, Vizag Steel, local high-grade mills',
      icon: <Award className="h-5 w-5 text-amber-500 dark:text-amber-450" />,
      imageUrl: '/images/cat_structural_steel.jpg',
      href: '/products?category=Structural+Steel'
    }
  ];

  const trustPillars = [
    {
      title: 'GST Verified Business',
      desc: '100% transparent invoicing with valid GST details for your commercial accounts.',
      icon: <BadgeCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
    },
    {
      title: 'Authorized Dealerships',
      desc: 'Genuine materials sourced directly from Tata, Jindal, JSW, and SAIL mills.',
      icon: <ShieldCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
    },
    {
      title: 'Fast On-Site Delivery',
      desc: 'Dedicated transport fleet to deliver raw steel directly to your project site in Patna & Bihar.',
      icon: <Truck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
    },
    {
      title: 'Real-time Daily Rates',
      desc: 'Dynamic, fair pricing tailored to wholesale market rates for bulk procurement.',
      icon: <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
    }
  ];

  return (
    <div className="flex flex-col transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-900 pb-20 pt-24 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-40">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Radial decorative light */}
        <div className="absolute -top-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/5 dark:bg-amber-950/10 blur-[120px] pointer-events-none"></div>
 
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-950/30 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 backdrop-blur-md mb-6">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                {"Patna's Premier Structural Steel Yard"}
              </div>

              {/* Main Headline */}
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Your Trusted Partner for <br />
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-400 dark:via-amber-500 dark:to-yellow-400 bg-clip-text text-transparent">
                  Premium Steel Products
                </span> in Patna
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-lg text-slate-650 dark:text-slate-400 sm:text-xl">
                Authorized dealers of Tata Structura, Jindal Star, and SAIL. We supply high-grade MS Pipes, Roofing Sheets, and MS Angles & Flats with fast, direct-to-site delivery.
              </p>

              {/* Call to Actions */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-8 py-4 font-bold text-white shadow-xl shadow-amber-600/10 dark:shadow-amber-600/20 transition-all duration-300 hover:bg-amber-550 hover:-translate-y-0.5"
                >
                  <span>View Product Catalog</span>
                  <ArrowRight size={18} />
                </Link>
                
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${heroWhatsAppText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-xl shadow-emerald-600/5 dark:shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-500 hover:-translate-y-0.5"
                >
                  <MessageSquare size={18} />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Image Panel */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-105 dark:bg-slate-900 shadow-xl dark:shadow-2xl">
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
        <div className="rounded-3xl border border-slate-202 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-8 backdrop-blur-md shadow-xl dark:shadow-2xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-800">
            {trustPillars.map((pillar, index) => (
              <div key={index} className="flex flex-col items-start gap-4 lg:px-6 first:pl-0">
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-950 p-3 border border-slate-202 dark:border-slate-800">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-660 dark:text-slate-400 leading-relaxed">{pillar.desc}</p>
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
            <p className="mt-2 text-slate-600 dark:text-slate-400">Heavy-duty materials sourced from industry-leading mills</p>
          </div>
          <Link href="/products" className="group mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors">
            <span>View all products</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Categories Grid Layout with Product Images */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <div key={index} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none">
              
              {/* Category Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={cat.imageUrl} 
                  alt={cat.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Floating Icon Badge overlaying the image */}
                <div className="absolute right-4 bottom-4 rounded-xl bg-white/90 dark:bg-slate-950/90 p-2 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
                  {cat.icon}
                </div>
              </div>

              {/* Text details container */}
              <div className="flex flex-col flex-grow p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-650 dark:text-slate-400 leading-relaxed flex-grow">
                  {cat.desc}
                </p>
                
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-2">Dealerships</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{cat.brands}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Brand Logos Trust Strip */}
      <section className="border-t border-b border-slate-202 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-950/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 mb-6">
            Authorized supply network of top manufacturers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-lg font-black tracking-wider text-slate-700 dark:text-slate-300">TATA STRUCTURA</span>
            <span className="text-lg font-black tracking-wider text-slate-700 dark:text-slate-300">JINDAL STAR</span>
            <span className="text-lg font-black tracking-wider text-slate-700 dark:text-slate-300">APL APOLLO</span>
            <span className="text-lg font-black tracking-wider text-slate-700 dark:text-slate-300">JSW STEEL</span>
            <span className="text-lg font-black tracking-wider text-slate-700 dark:text-slate-300">SAIL</span>
          </div>
        </div>
      </section>

      {/* Call to Action Quote Panel */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-100 via-slate-50 to-amber-100/10 dark:from-slate-900 dark:via-slate-950 dark:to-amber-955/20 p-8 sm:p-12 md:p-16 shadow-xl dark:shadow-none">
          
          {/* Background decoration */}
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-600/5 blur-[100px] pointer-events-none"></div>
          
          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              Get an Instant Wholesale Quote for Your Project
            </h2>
            <p className="mt-4 text-base text-slate-650 dark:text-slate-400 leading-relaxed sm:text-lg">
              Send us your list of materials, required sizes, and delivery address. Our sales team will prepare a competitive, customized quotation with delivery logistics included.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 dark:shadow-amber-600/25 transition-all duration-300 hover:bg-amber-500"
              >
                <Phone size={16} />
                <span>Call Sales Engineer</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${heroWhatsAppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-202 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <MessageSquare size={16} className="text-emerald-605 dark:text-emerald-500" />
                <span>Send Material List</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
