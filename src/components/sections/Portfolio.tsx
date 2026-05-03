import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'motion/react';
import { Play, X, ArrowUpRight } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { PROJECTS, Project } from '../../constants';
import { cn } from '../../lib/utils';

// Helper for wrapping values
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  
  // Triple projects for infinite marquee loop
  const tripledProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS];
  
  // Marquee velocity
  const baseX = useMotionValue(0);
  
  // Smoothing the movement
  const springX = useSpring(baseX, {
    damping: 50,
    stiffness: 400,
    mass: 1
  });

  // Infinite wrapping from 0 to -33.33% (one set of projects)
  const x = useTransform(springX, (v) => `${wrap(-33.333, 0, v)}%`);

  useAnimationFrame((t, delta) => {
    if (!isPaused && !isDragging.current) {
      // Slow constant movement
      const moveBy = -0.005 * (delta / 16); 
      baseX.set(baseX.get() + moveBy);
    }
  });

  const handleWheel = (e: React.WheelEvent) => {
    // Only scroll marquee if user is scrolling horizontally or holding shift
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      // Map pixel delta to percentage movement
      const sensitivity = 0.01;
      baseX.set(baseX.get() - (e.deltaX || e.deltaY) * sensitivity);
    }
  };

  const isEmbeddable = (url: string) => {
    return url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('embed');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('drive.google.com/file')) {
      return url.replace('/view?usp=sharing', '/preview').replace('/view?usp=drive_link', '/preview');
    }
    return url;
  };

  const handlePlayClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <section id="work" className="py-24 overflow-hidden relative group/section">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.4em] text-primary font-bold mb-4">Portfolio</h2>
            <h3 className="text-3xl md:text-5xl font-display font-black leading-none tracking-tight">
              {"SELECTED ".split(" ").map((word, i) => (
                <span key={i} className="hover-outline mr-2">{word}</span>
              ))}
              <br />
              {"WORKS".split(" ").map((word, i) => (
                <span key={i} className="text-white/20 hover-outline">{word}</span>
              ))}
            </h3>
          </div>
          <div className="max-w-md text-gray-400 text-lg font-light">
            A showcase of cinematic storytelling and visual precision.
          </div>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden pb-12 pt-10">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <div 
          className="flex cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onWheel={handleWheel}
        >
          <motion.div 
            style={{ x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDragEnd={() => {
              isDragging.current = false;
            }}
            onDrag={(e, info) => {
              // Increase sensitivity for better feel
              const sensitivity = 0.08; 
              baseX.set(baseX.get() + info.delta.x * sensitivity); 
            }}
            className="flex gap-8 px-4"
          >
            {tripledProjects.map((project, i) => (
              <motion.div
                key={`${project.id}-${i}`}
                className="relative w-[300px] md:w-[450px] aspect-[16/10] glass-card rounded-[2.5rem] overflow-hidden group glow-border flex-shrink-0"
                onClick={() => {
                  if (!isDragging.current) {
                    setSelectedProject(project);
                  }
                }}
                whileHover={{ y: -10 }}
              >
                {/* Image */}
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none select-none"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="flex justify-between items-end pointer-events-none">
                    <div className="pointer-events-none">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block">{project.category}</span>
                      <h4 className="text-xl font-display font-bold group-hover:text-primary transition-colors whitespace-normal">{project.title}</h4>
                    </div>
                    <button 
                      onClick={(e) => handlePlayClick(e, project.videoUrl)}
                      className="w-14 h-14 flex-shrink-0 aspect-square bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 border border-white/10 hover:bg-black/70 active:scale-95 shadow-2xl pointer-events-auto"
                    >
                      <Play size={24} className="fill-secondary text-secondary ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedProject(null)} />
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl glass-card rounded-[3rem] overflow-hidden flex flex-col md:flex-row max-h-[95vh] glow-border"
            >
              <button 
                className="absolute top-6 right-6 z-30 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              {/* Video Area */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                {isEmbeddable(selectedProject.videoUrl) || selectedProject.videoUrl.includes('drive.google.com') ? (
                  <iframe 
                    className="w-full aspect-video"
                    src={getEmbedUrl(selectedProject.videoUrl)}
                    title={selectedProject.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="relative group/modal-img w-full h-full min-h-[300px] flex flex-col items-center justify-center">
                    <img 
                      src={selectedProject.thumbnail} 
                      className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm"
                      alt=""
                    />
                    <div className="relative z-10 text-center p-8">
                      <div className="mb-6 mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <Play size={40} className="text-primary fill-primary/20" />
                      </div>
                      <h4 className="text-2xl font-bold mb-4">Watch on External Platform</h4>
                      <p className="text-gray-300 max-w-sm mb-8">This content is hosted on {selectedProject.videoUrl.includes('instagram') ? 'Instagram' : 'LinkedIn'} and must be viewed on their platform.</p>
                      <button 
                         onClick={() => window.open(selectedProject.videoUrl, '_blank', 'noreferrer')}
                         className="px-8 py-4 bg-primary rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)]"
                      >
                        Visit Video Page
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Details Area */}
              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-3 block">{selectedProject.category}</span>
                  <h4 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter leading-tight">{selectedProject.title}</h4>
                  <p className="text-gray-400 mb-8 text-base md:text-lg font-light leading-relaxed">{selectedProject.description}</p>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Tools Used</h5>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {selectedProject.skills.map(skill => (
                      <span key={skill} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium">{skill}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => window.open(selectedProject.videoUrl, '_blank', 'noreferrer')}
                    className="group w-full py-5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                  >
                    Launch Project <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
