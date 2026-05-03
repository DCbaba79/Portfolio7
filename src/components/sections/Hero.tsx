import { motion, useScroll, useTransform } from 'motion/react';
import { Youtube } from 'lucide-react';
import { WordHighlighter } from '../WordHighlighter';

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0 text-white">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=2000" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/30 to-[#030712] z-20" />
      </div>

      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-2.5 py-1 md:px-4 md:py-2 glass-card rounded-full text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 md:mb-8"
        >
          <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(13,148,136,0.5)]" />
          Premium Video Editor
        </motion.div>

        <motion.h1 
          className="text-xl md:text-6xl font-display font-black leading-[0.9] md:leading-[0.85] tracking-tighter mb-4 md:mb-8 select-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-x-[0.2em]">
            {["I", "DON'T", "JUST", "EDIT", "VIDEOS."].map((word, i) => (
              <span key={i} className="hover-outline transition-all duration-300">
                {word}
              </span>
            ))}
            <br className="w-full" />
            {["I", "TELL"].map((word, i) => (
              <span key={i} className="hover-outline transition-all duration-300">
                {word}
              </span>
            ))}
            <span className="italic font-serif font-black orange-to-teal inline-block transition-all duration-300 mx-2">
              STORIES
            </span>
            {["THAT", "SELL."].map((word, i) => (
              <span key={i} className="hover-outline transition-all duration-300">
                {word}
              </span>
            ))}
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto text-xs md:text-lg text-gray-400 mb-8 md:mb-10 leading-relaxed font-light cursor-default px-4 md:px-0"
        >
          <WordHighlighter text="Crafting high-impact cinematic visuals for brands, creators, and elite gaming startups." />
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
        >
          <a 
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group px-8 py-4 md:px-10 md:py-5 bg-primary text-white rounded-full font-bold transition-all shadow-xl shadow-primary/20 hover:scale-105 text-sm md:text-base"
          >
            View My Work
          </a>
          <a 
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group px-8 py-4 md:px-10 md:py-5 glass-card rounded-full font-bold hover:bg-white/10 transition-all border-white/10 text-sm md:text-base"
          >
            Hire Me
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-10 md:left-20 hidden lg:block"
      >
        <div className="glass p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <Youtube className="text-secondary" size={24} />
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase font-bold">Generated</p>
            <p className="text-base font-sans font-bold">50,000+ Views</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
