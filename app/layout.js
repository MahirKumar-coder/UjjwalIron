import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ujjwal Iron | Premium Steel Supplier & Distributor in Patna',
  description:
    'Ujjwal Iron is Patna\'s premier supplier of MS Pipes, MS Angles, MS Flats, Roofing Sheets, and GP Pipes. Authorized dealer of Tata Structura, Jindal Star, and SAIL. Get the latest steel rates today.',
  keywords:
    'Ujjwal Iron, Steel Supplier Patna, MS Pipes Patna, MS Angle Patna, MS Flat Patna, Tata Structura Patna, Jindal Star Patna, Roofing Sheets Bihar, Steel Dealer Patna',
  icons: {
    icon: '/images/logo.jpg',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ujjwal Iron",
    "image": "https://ujjwaliron.com/images/hero_steel_yard.jpg",
    "telephone": "+918986043632",
    "email": "sales@ujjwaliron.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "H/o Lalmati Devi, Ashiyana Digha Road, Digha Ghat",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "postalCode": "800011",
      "addressCountry": "IN"
    },
    "url": "https://ujjwaliron.com",
    "priceRange": "₹₹",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "sameAs": [
      "https://wa.me/918986043632"
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
