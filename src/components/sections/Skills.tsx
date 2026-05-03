import { motion } from 'motion/react';
import React from 'react';
import { SKILLS, Skill } from '../../constants';
import { WordHighlighter } from '../WordHighlighter';
import { cn } from '../../lib/utils';

const SkillTile = ({ skill, index }: { skill: Skill, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group flex flex-col items-center"
    >
      <div className={cn(
        "flex-shrink-0 w-14 h-14 md:w-24 md:h-24 flex items-center justify-center bg-[#111111] rounded-[1rem] md:rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-translate-y-3 cursor-pointer",
        index % 2 === 0 
          ? "group-hover:bg-primary group-hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.8)] group-hover:border-primary/50" 
          : "group-hover:bg-orange-500 group-hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.8)] group-hover:border-orange-500/50"
      )}>
        <div className="w-full h-full flex items-center justify-center transition-all duration-500">
          {skill.logo ? (
            <img 
              src={skill.logo} 
              alt={skill.name} 
              className="w-7 h-7 md:w-12 md:h-12 object-contain transition-all duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <span 
            className="text-2xl font-black text-white/40 transition-colors"
            style={{ display: skill.logo ? 'none' : 'flex' }}
          >
            {skill.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>

      {/* Expanding details bubble */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl border border-white/10 w-48 text-center z-30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-2xl">
        <div className="p-6">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">{skill.category}</p>
          <p className="text-lg font-black tracking-tighter text-white truncate px-2">{skill.name}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Skills() {
  return (
    <section id="skills" className="py-8 md:py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
        <div className="lg:w-2/5">
          <h3 className="text-lg md:text-5xl font-display font-black leading-none tracking-tight mb-3 md:mb-10">
            {"THE ".split(" ").map((word, i) => (
              <span key={i} className="hover-outline mr-2">{word}</span>
            ))}
            <br />
            {"ARSENAL".split(" ").map((word, i) => (
              <span key={i} className="text-white/20 hover-outline">{word}</span>
            ))}
          </h3>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            <WordHighlighter text="I leverage the industry's most powerful tools to craft cinematic experiences. From pixel-perfect color grading to complex visual effects." />
          </p>
        </div>

        <div className="lg:w-3/5">
          <div className="flex flex-wrap gap-8 justify-start lg:justify-start">
            {SKILLS.map((skill, i) => (
              <SkillTile key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
