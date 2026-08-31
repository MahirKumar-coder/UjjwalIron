'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  FileText, 
  Award, 
  Package, 
  Building2, 
  Grid,
  Info
} from 'lucide-react';

export default function StainlessSteelPage() {
  const [selectedGrade, setSelectedGrade] = useState('304');
  const [inquiryProduct, setInquiryProduct] = useState('SS Pipes & Tubes');
  const [inquiryGrade, setInquiryGrade] = useState('SS 304');
  const [inquiryQty, setInquiryQty] = useState('');

  const phone = '+918986043632';

  const grades = [
    {
      id: '202',
      name: 'SS 202 Grade',
      tagline: 'Decorative, Architectural & Light Fabrication',
      composition: 'Chromium (14-16%), Nickel (1-1.5%), Manganese (7.5-10%)',
      finish: 'Mirror, Hairline, Satin',
      features: [
        'Cost-effective alternative to SS 304 for indoor aesthetics',
        'High tensile strength and good formability',
        'Ideal for railings, furniture, grills, and architectural decor',
        'Standard magnetic properties after cold working'
      ],
      badge: 'Popular for Fabrication',
      color: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-500'
    },
    {
      id: '304',
      name: 'SS 304 Grade',
      tagline: 'Industry Standard, Food Grade & All-Weather Steel',
      composition: 'Chromium (18-20%), Nickel (8-10.5%), Carbon (<0.08%)',
      finish: '2B, 2D, No. 4 Hairline, 8K Mirror',
      features: [
        'Exceptional resistance to atmospheric oxidation and chemicals',
        'Food grade compliant (commercial kitchens, dairy, hospitals)',
        'Excellent weldability and deep drawing capability',
        'Long life durability in Bihar humid climate conditions'
      ],
      badge: 'Most Versatile / Top Seller',
      color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400'
    },
    {
      id: '316',
      name: 'SS 316 Grade',
      tagline: 'Marine, Acid & High Chemical Resistance',
      composition: 'Chromium (16-18%), Nickel (10-14%), Molybdenum (2-3%)',
      finish: 'Industrial Matte, 2B, Pickled & Passivated',
      features: [
        'Contains 2-3% Molybdenum for pitting resistance against chlorides',
        'Engineered for chemical plants, pharma, effluent treatment & waterworks',
        'Superior high-temperature creep strength',
        'Non-magnetic in annealed condition'
      ],
      badge: 'Heavy Industrial & Marine',
      color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400'
    }
  ];

  const ssProducts = [
    {
      title: 'SS Pipes & Tubes (पाइप्स एवं ट्यूब्स)',
      category: 'SS Hollow Sections',
      desc: 'Seamless & ERW round pipes, square and rectangular box pipes for structural, industrial, and decorative handrail installations.',
      sizes: 'Round (9.5mm to 114mm), Square (12x12mm to 100x100mm), Rectangular (20x10mm to 100x50mm)',
      grades: 'SS 202, SS 304, SS 316',
      standards: 'ASTM A554 (Ornamental), ASTM A312 (Industrial Flow)'
    },
    {
      title: 'SS Sheets & Coils (स्टेनलेस स्टील शीट)',
      category: 'Flat Rolled Products',
      desc: 'Cold rolled & hot rolled stainless steel sheets and coils with premium protective laser film coating.',
      sizes: 'Thickness 0.4mm to 6.0mm | Widths 1000mm, 1250mm, 1500mm',
      grades: 'SS 202, SS 304, SS 316, SS 430',
      standards: 'ASTM A240, IS 6911 | Finishes: 2B, Hairline No.4, 8K Mirror'
    },
    {
      title: 'SS Angles & Channels (एंगल्स एवं चैनल्स)',
      category: 'Structural Stainless',
      desc: 'Hot rolled and laser-welded stainless structural angles and channels for corrosion-free framing and support towers.',
      sizes: 'Angles (25x25x3mm to 100x100x10mm) | Channels (75x40mm to 200x75mm)',
      grades: 'SS 304, SS 316',
      standards: 'ASTM A276, ASTM A479'
    },
    {
      title: 'SS Bright Round Bars & Rods (रॉड एवं बार्स)',
      category: 'Solid Bars & Shafts',
      desc: 'Bright drawn and centerless ground solid stainless round bars, hexagon bars, and square rods for machining and fasteners.',
      sizes: 'Diameter 4mm to 150mm',
      grades: 'SS 202, SS 304, SS 316, SS 410',
      standards: 'H9 / H11 Tolerance with MTC'
    },
    {
      title: 'SS Flat Bars & Strips (पत्ती एवं स्ट्रिप्स)',
      category: 'Flat Bars',
      desc: 'Slit edge and mill edge solid stainless flats for architectural grills, industrial fabrication, and electrical earthing.',
      sizes: 'Width 12mm to 100mm | Thickness 2.0mm to 12.0mm',
      grades: 'SS 202, SS 304',
      standards: 'ASTM A276'
    },
    {
      title: 'SS Railing Accessories & Fittings (रेलिंग फिटिंग्स)',
      category: 'Hardware & Connectors',
      desc: 'Cast and forged 304/316 accessories: elbows, glass brackets, wall flanges, base covers, joiners, and end caps.',
      sizes: 'Standard fit for 1", 1.5", 2", 2.5" pipes',
      grades: 'SS 304, SS 316',
      standards: 'High mirror & satin polish'
    }
  ];

  const buildWhatsAppLink = () => {
    const text = `Hi Ujjwal Iron, I am visiting your Stainless Steel page and want to inquire about:
- *Product:* ${inquiryProduct}
- *Grade:* ${inquiryGrade}
${inquiryQty ? `- *Quantity:* ${inquiryQty}` : ''}
Please share the latest rates, availability, and delivery options in Patna. Thank you!`;
    return `https://wa.me/918986043632?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen transition-colors duration-300 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-500 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">Stainless Steel</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl mb-16">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-6">
              <Sparkles size={14} />
              <span>Premium Stainless Steel Division • Ujjwal Iron</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              High-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">Stainless Steel</span> Solutions
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
              Authorized wholesale distributor and stockist for Jindal Stainless, Salem Steel, and top-tier mills in Patna, Bihar. Supplying SS 202, SS 304, and SS 316 pipes, sheets, structural profiles, rods, and railing fittings.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-amber-600/20 transition-all hover:-translate-y-0.5"
              >
                <MessageSquare size={18} />
                <span>Instant WhatsApp Price Check</span>
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all backdrop-blur-md"
              >
                <Phone size={18} className="text-amber-400" />
                <span>Call Sales Desk: {phone}</span>
              </a>
            </div>

            {/* Feature Badges */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-8 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Mill Test Certificate (MTC)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>SS 202, 304, 316 Ready Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Custom Length Cut-to-Order</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Direct Site Delivery across Bihar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Comparison & Engineering Guide */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Technical Knowledge</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Choose the Right Stainless Steel Grade
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
              Select a grade below to inspect chemical composition, corrosion resistance, and practical applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grades.map((g) => (
              <div 
                key={g.id}
                onClick={() => setSelectedGrade(g.id)}
                className={`cursor-pointer rounded-3xl border-2 p-6 sm:p-8 transition-all duration-300 bg-white dark:bg-slate-900/60 backdrop-blur-md ${
                  selectedGrade === g.id 
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10 -translate-y-1' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-black text-slate-900 dark:text-white">
                    {g.name}
                  </span>
                  <span className="text-3xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {g.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{g.tagline}</h3>

                <div className="space-y-3 mt-4 text-xs">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 block font-bold mb-1">Chemical Composition:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono">{g.composition}</span>
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 block font-bold mb-1">Available Surface Finishes:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{g.finish}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Key Advantages:</span>
                  {g.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Catalog Grid for Stainless Steel */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Inventory Catalog</span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Stainless Steel Product Categories
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View Carbon & Structural Steel Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ssProducts.map((p, idx) => (
              <div 
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:border-amber-500/40 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {p.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">0{idx + 1}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {p.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="mt-5 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available Grades:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{p.grades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Standard Sizes:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-right max-w-[60%]">{p.sizes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Specs / Standard:</span>
                      <span className="font-mono text-3xs text-slate-500 dark:text-slate-400 text-right">{p.standards}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <a
                    href={`https://wa.me/918986043632?text=${encodeURIComponent(`Hi Ujjwal Iron, I want to inquire about rates for ${p.title} in Patna.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-200 px-4 py-2.5 text-xs font-bold transition-colors"
                  >
                    <MessageSquare size={14} />
                    <span>Inquire for {p.category}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick WhatsApp Quote Builder Box */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-white dark:via-slate-900 to-amber-600/5 p-6 sm:p-10 shadow-lg mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Get an Instant Wholesale Quote for Stainless Steel
            </h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Select your specifications below and send an inquiry directly to our sales desk.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Product
                </label>
                <select
                  value={inquiryProduct}
                  onChange={(e) => setInquiryProduct(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="SS Pipes & Tubes">SS Pipes & Tubes</option>
                  <option value="SS Sheets & Coils">SS Sheets & Coils</option>
                  <option value="SS Angles & Channels">SS Angles & Channels</option>
                  <option value="SS Round Bars & Rods">SS Round Bars & Rods</option>
                  <option value="SS Flat Bars & Strips">SS Flat Bars & Strips</option>
                  <option value="SS Railing Accessories">SS Railing Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Grade
                </label>
                <select
                  value={inquiryGrade}
                  onChange={(e) => setInquiryGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="SS 202">SS 202 (Commercial / Railing)</option>
                  <option value="SS 304">SS 304 (Industrial Standard / Food)</option>
                  <option value="SS 316">SS 316 (Marine & High Chemical)</option>
                  <option value="SS 430">SS 430 (Ferritic / Magnetic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Estimated Quantity / Length
                </label>
                <input
                  type="text"
                  value={inquiryQty}
                  onChange={(e) => setInquiryQty(e.target.value)}
                  placeholder="e.g. 500 Kg or 50 Pcs"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-amber-600/20 transition-all hover:scale-105"
              >
                <MessageSquare size={20} />
                <span>Send WhatsApp Inquiry for {inquiryProduct} ({inquiryGrade})</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
