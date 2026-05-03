import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Youtube, Instagram, Mail } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      const sections = ['home', 'work', 'skills', 'roles', 'contact'];
      let current = '';
      
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            current = section;
            break;
          }
        }
      }

      if (current === 'stats') current = 'work';
      if (window.scrollY < 10) current = 'home';
      
      setActiveSection((prev) => {
        if (prev !== current) return current;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Work', href: '#work', id: 'work' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Roles', href: '#roles', id: 'roles' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-40 transition-all duration-500",
      scrolled ? "py-4 bg-[#050505]/80 backdrop-blur-xl" : "py-10 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        <motion.a 
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
            <img 
              src="https://i.postimg.cc/50nzByRk/Chat-GPT-Image-May-2-2026-12-06-49-AM.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.className = "font-black text-white";
                  span.innerText = "DS";
                  parent.appendChild(span);
                }
              }}
            />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-white group-hover:text-primary transition-colors">DHYAN SALAVI</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12 bg-white/[0.03] px-8 py-3 rounded-full">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn(
                "relative text-xs font-sans uppercase tracking-widest transition-all py-1",
                activeSection === link.id ? "text-primary" : "text-gray-400 hover:text-white"
              )}
            >
              <span className="relative z-10">{link.name}</span>
              <AnimatePresence>
                {activeSection === link.id && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(13,148,136,0.5)] origin-center"
                  />
                )}
              </AnimatePresence>
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(
              "relative text-xs font-sans uppercase tracking-widest transition-all py-1",
              activeSection === 'contact' ? "text-secondary" : "text-gray-400 hover:text-secondary"
            )}
          >
            <span className="relative z-10">Contact</span>
            <AnimatePresence>
              {activeSection === 'contact' && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-secondary rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] origin-center"
                />
              )}
            </AnimatePresence>
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {[...navLinks, { name: 'Contact', href: '#contact', id: 'contact' }].map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "text-xl font-sans uppercase tracking-widest transition-colors",
                    activeSection === link.id ? "text-primary" : "text-white/60"
                  )}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-6 pt-4 border-t border-white/5">
                <Instagram size={24} className="text-white/40 hover:text-white transition-colors" />
                <Youtube size={24} className="text-white/40 hover:text-white transition-colors" />
                <Mail size={24} className="text-white/40 hover:text-white transition-colors" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
