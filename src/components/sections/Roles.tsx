import { motion } from 'motion/react';
import { Share2, Gamepad2, Users, Layers } from 'lucide-react';
import React from 'react';

const ROLES = [
  {
    icon: Share2,
    title: "Social Media Lead",
    orgs: "GLA Club, CloudOps, IEEE Photonics",
    description: "Developing comprehensive digital strategies and creative content to drive engagement and brand awareness across multiple tech communities.",
    responsibilities: [
      "Cross-platform content strategy",
      "Community engagement & growth",
      "Visual storytelling & branding",
      "Collaborative campaign management"
    ],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Gamepad2,
    title: "Lead Video Editor",
    orgs: "V-NEST Starup Incubator",
    description: "Contributed to content creation and visual storytelling, producing engaging media to enhance brand presence and outreach.",
    responsibilities: [
      "Edited videos and designed graphics for digital platforms",
      "Supported content planning and campaign execution",
      "Handled post-production (color grading, audio, motion graphics)",
      "Ensured consistent visual branding across content"
    ],
    color: "from-primary/20 to-secondary/20"
  },
  {
    icon: Layers,
    title: "Video Editor",
    orgs: "DevLabs",
    description: "Overseeing multimedia production and digital presence for a fast-growing developer ecosystem.",
    responsibilities: [
      "Cinematic video production",
      "Brand identity development",
      "Creative asset management",
      "Technical storyboarding"
    ],
    color: "from-purple-500/20 to-pink-500/20"
  }
];

export default function Roles() {
  return (
    <section id="roles" className="py-20 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="mb-12 md:mb-20">
        <h2 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-primary font-bold mb-4">Leadership</h2>
        <h3 className="text-2xl md:text-5xl font-display font-black leading-none tracking-tight">
          {"ORGANIZATIONAL ".split(" ").map((word, i) => (
            <span key={i} className="hover-outline mr-2">{word}</span>
          ))}
          <span className="text-white">ROLES</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {ROLES.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-full"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] blur-3xl -z-10`} />
            <div className="h-full glass-card p-8 md:p-10 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 glow-border min-h-[500px] md:min-h-[550px]">
              <div className="flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-500">
                    <role.icon className="text-white group-hover:text-primary transition-colors w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest block mb-1">Position</span>
                    <h4 className="text-xl md:text-2xl font-display font-black tracking-tight">{role.title}</h4>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-[0.3em] block mb-2">Organizations</span>
                  <div className="flex flex-wrap gap-2">
                    {role.orgs.split(", ").map(org => (
                      <span key={org} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/60 border border-white/5 group-hover:border-primary/20 group-hover:text-white transition-colors uppercase tracking-wider">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-8 group-hover:text-gray-300 transition-colors">
                  {role.description}
                </p>

                <div className="space-y-3 mt-auto">
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-[0.3em] block mb-4">Core Responsibilities</span>
                  {role.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                      <span className="text-xs md:text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <div className="w-12 h-[2px] bg-white/10 group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
