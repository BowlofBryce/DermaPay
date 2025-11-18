import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { GoldenWaveBackground } from '../components/GoldenWaveBackground';

const cardsContainer = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="relative" style={{ zIndex: 10 }}>
        <Header />

        <motion.section
          className="relative overflow-hidden pt-24 pb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
        <GoldenWaveBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
            Get paid for tattoos the easy way.
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            One place to take payments, see money coming in, and pass fees to the client if you want.
            No tech skills needed.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -1, boxShadow: '0 20px 40px -12px rgba(250, 204, 21, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup')}
              className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm sm:text-base font-semibold text-black shadow-lg shadow-yellow-500/20 transition-shadow"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="rounded-full border border-yellow-400/60 bg-black/40 px-6 py-2.5 text-sm sm:text-base font-medium text-yellow-100"
            >
              Log In
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="how-it-works"
        className="mx-auto mt-4 max-w-5xl px-4 pb-16"
        variants={cardsContainer}
        initial="hidden"
        animate="show"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Sign up',
              body: 'Tell us about you and your shop. It takes 2–3 minutes.',
              icon: '$',
            },
            {
              title: 'Take a payment',
              body: "Type in the amount and tap 'Create link' or show a QR code.",
              icon: '⟳',
            },
            {
              title: 'Get paid',
              body: 'Money goes to your account. See it all in one simple dashboard.',
              icon: '↑',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={cardItem}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl border border-white/5 bg-slate-900/70 px-5 py-6 text-left shadow-sm shadow-black/50"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/15 text-sm font-semibold text-yellow-300">
                {card.icon}
              </div>
              <h3 className="font-heading text-lg text-white">{card.title}</h3>
              <p className="mt-1 font-body text-sm text-white/70">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="pricing"
        className="mx-auto max-w-5xl px-4 py-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">
            Why it's cheaper
          </h2>
          <p className="font-body text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Card processors quietly take 3–5% of every tattoo.
            DermaPay is built to keep more of that money in your pocket.
          </p>
        </div>

        <motion.div
          className="grid gap-4 sm:grid-cols-3"
          variants={cardsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            {
              title: 'Keep more per tattoo',
              body: 'We route payments over lower-cost rails (like ACH), so your effective fee can be much lower than a normal card swipe.',
            },
            {
              title: 'Let clients cover the fee',
              body: 'Turn on "Client pays fee" and we automatically add a small convenience fee to the total so your payout stays the same.',
            },
            {
              title: 'No junk fees',
              body: 'No monthly fee, no setup fee, no hardware lease. Just simple per-payment pricing you can actually understand.',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={cardItem}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl border border-white/5 bg-slate-900/70 px-6 py-7 text-left shadow-sm shadow-black/50"
            >
              <h3 className="font-heading text-lg text-white mb-3">{card.title}</h3>
              <p className="font-body text-sm text-white/70 leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-5xl px-4 py-8 pb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-12 rounded-xl text-center border border-white/5">
          <h2 className="font-heading text-3xl font-bold text-[#f9fafb] mb-6">
            Ready to stop bleeding money on card fees?
          </h2>
          <motion.button
            whileHover={{ scale: 1.04, y: -1, boxShadow: '0 20px 40px -12px rgba(250, 204, 21, 0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signup')}
            className="rounded-full bg-yellow-400 px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-yellow-500/20 transition-shadow"
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>
      </div>
    </div>
  );
}
