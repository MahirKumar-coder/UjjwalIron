'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ phone = '+918340282773' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const pathname = usePathname();

  // Handle initial theme configuration
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-black text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
                UI
              </div>
              <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white">
                UJJWAL <span className="text-blue-500">IRON</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive(link.href) 
                      ? 'text-blue-600 dark:text-blue-500' 
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Call & Theme Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-500" />
              ) : (
                <Moon size={18} className="text-blue-600" />
              )}
            </button>

            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-600/35"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
          </div>

          {/* Mobile Menu & Theme Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-amber-500" />
              ) : (
                <Moon size={16} className="text-blue-600" />
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 pb-6 pt-4 space-y-4 transition-colors duration-300`}
        id="mobile-menu"
      >
        <div className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                  : 'text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Call Now Button inside Mobile menu */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-900">
          <a
            href={`tel:${phone}`}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors"
          >
            <Phone size={18} />
            <span>Call Now</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
