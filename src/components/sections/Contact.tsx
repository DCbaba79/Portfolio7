import { motion } from 'motion/react';
import { Mail, Phone, Instagram, Send, ArrowUpRight } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

const ContactTile = ({ icon: Icon, label, value, href, colorClass, hoverBg }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group flex flex-col items-center"
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex-shrink-0 w-24 h-24 flex items-center justify-center glass-card rounded-[2rem] overflow-hidden outline outline-1 outline-white/5 transition-all duration-500 hover:glow-border group-hover:scale-110 group-hover:-translate-y-2",
          colorClass
        )}
      >
        <div className={cn(
          "w-full h-full flex items-center justify-center transition-all duration-500 group-hover:text-[#050505]",
          hoverBg
        )}>
          <Icon size={32} />
        </div>
      </motion.a>

      {/* Expanding details below */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl border border-white/10 w-64 text-center z-30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-2xl">
        <div className="p-6">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">{label}</p>
          <p className="text-lg font-black tracking-tighter text-white truncate px-2">{value}</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest pt-4 border-t border-white/5">
            <span>Get in touch</span>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="glass-card rounded-[3.5rem] p-12 md:p-24 overflow-hidden relative border-white/10 glow-border">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.4em] text-primary font-bold mb-6">Connect</h2>
            <h3 className="text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-10">
              {"LET'S MAKE ".split(" ").map((word, i) => (
                <span key={i} className="hover-outline mr-4">{word}</span>
              ))}
              <br /> 
              {"STUFF".split(" ").map((word, i) => (
                <span key={i} className="italic font-serif orange-to-teal tracking-normal">{word}</span>
              ))}
            </h3>
            
            <div className="flex flex-row gap-6 mt-16 flex-wrap">
              <ContactTile 
                icon={Mail} 
                label="Email" 
                value="dhyansalavi15@gmail.com" 
                href="mailto:dhyansalavi15@gmail.com"
                colorClass="text-primary"
                hoverBg="group-hover:bg-primary"
              />
              <ContactTile 
                icon={Phone} 
                label="Call" 
                value="+91 72278 13924" 
                href="tel:+917227813924"
                colorClass="text-secondary"
                hoverBg="group-hover:bg-secondary"
              />
              <ContactTile 
                icon={Instagram} 
                label="Follow" 
                value="dhyan salavi" 
                href="https://www.instagram.com/dj79.drp"
                colorClass="text-white"
                hoverBg="group-hover:bg-white"
              />
            </div>
          </div>

          <div className="glass-card p-10 md:p-12 rounded-[3.5rem] border-white/5 shadow-2xl">
            <h4 className="text-2xl font-display font-black mb-8 tracking-tighter">PROJECT INQUIRY</h4>
            <form className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 ml-4">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 ml-4">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 ml-4">Your Project Details</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell me about your amazing project..." 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white resize-none"
                />
              </div>
              
              <button className="w-full py-5 bg-primary rounded-2xl font-sans font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/80 transition-all hover:scale-[1.02] group">
                SEND MESSAGE 
                <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-white/40 font-mono">© {new Date().getFullYear()} DHYAN SALAVI. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </section>
  );
}
