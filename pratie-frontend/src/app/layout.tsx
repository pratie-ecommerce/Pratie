import type { Metadata } from 'next';
import '../styles/globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ConciergeWidget } from '../components/common/ConciergeWidget';
import { BottomNav } from '../components/layout/BottomNav';
import { RecentlyCommissionedToast } from '../components/common/RecentlyCommissionedToast';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Pratiè | Handcrafted Sarees & Royal Suits • 33 States of India',
  description:
    'Discover India’s finest handloom sarees and royal suits. Authentic Banarasi, Kanjeevaram, Chikankari, and Mithila weaves certified with Silk Mark and GI tags.',
  keywords: ['Pratiè', 'Handloom Sarees', 'Suits', 'Banarasi Saree', 'Kanjeevaram Silk', 'Chikankari Suit', 'Indian Ethnic Wear', 'Bridal Sarees']
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;500;600;700;800&family=Prata&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-[#faf8f5] text-slate-900 font-sans pb-16 lg:pb-0">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-grow pt-[106px] lg:pt-[154px]">{children}</main>
              <Footer />
              <CartDrawer />
              <BottomNav />
              <RecentlyCommissionedToast />
              <ConciergeWidget />
              <Toaster position="top-right" richColors />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
