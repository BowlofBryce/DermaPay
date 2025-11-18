import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isAuthPage = ['/login', '/signup', '/dashboard', '/take-payment', '/settings'].includes(
    location.pathname
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthPage) {
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all ${
        scrolled
          ? 'border-white/10 bg-[#050608]/90 shadow-lg shadow-black/20'
          : 'border-white/5 bg-[#050608]/80'
      }`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/src/assets/Untitled 56.svg"
            alt="DermaPay"
            className="h-16 brightness-0 invert"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="font-body text-sm text-gray-300 hover:text-[#f4c064] transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="font-body text-sm text-gray-300 hover:text-[#f4c064] transition-colors"
          >
            Pricing
          </button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="rounded-full px-4 py-1.5 text-sm font-medium border border-yellow-400/40 text-yellow-200 hover:bg-yellow-400/10 transition-colors"
          >
            Log In
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.04,
              y: -1,
              boxShadow: '0 20px 40px -12px rgba(250, 204, 21, 0.6), 0 0 20px rgba(250, 204, 21, 0.3)'
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signup')}
            className="rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-black shadow-lg shadow-yellow-500/20 transition-colors"
          >
            Get Started
          </motion.button>
        </nav>

        <div className="md:hidden">
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: '0 20px 40px -12px rgba(250, 204, 21, 0.6), 0 0 20px rgba(250, 204, 21, 0.3)'
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signup')}
            className="rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-black shadow-lg shadow-yellow-500/20"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
