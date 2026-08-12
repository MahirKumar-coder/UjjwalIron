import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ujjwal Iron | Premium Steel Supplier & Distributor in Patna',
  description:
    'Ujjwal Iron is Patna\'s premier supplier of MS Pipes, TMT Bars, Roofing Sheets, and GP Pipes. Authorized dealer of Tata Structura, Jindal Star, and SAIL. Get the latest steel rates today.',
  keywords:
    'Ujjwal Iron, Steel Supplier Patna, MS Pipes Patna, TMT Bars Patna, Tata Structura Patna, Jindal Star Patna, Roofing Sheets Bihar, Steel Dealer Patna',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
