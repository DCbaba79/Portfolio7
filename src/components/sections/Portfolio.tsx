import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'motion/react';
import { Play, X, ArrowUpRight, LayoutGrid, Film, ExternalLink } from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import { PROJECTS, Project } from '../../constants';
import { cn } from '../../lib/utils';

// Helper for wrapping values
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];
    return cats;
  }, []);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Triple projects for infinite marquee loop (only when in All or enough items)
  const marqueeProjects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    if (filteredProjects.length < 3) {
      return [...filteredProjects, ...filteredProjects, ...filteredProjects, ...filteredProjects];
    }
    return [...filteredProjects, ...filteredProjects, ...filteredProjects];
  }, [filteredProjects]);

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
    if (!isPaused && !isDragging.current && viewMode === 'marquee') {
      // Slow constant movement
      const moveBy = -0.005 * (delta / 16);
      baseX.set(baseX.get() + moveBy);
    }
  });

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'marquee') return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      const sensitivity = 0.01;
      baseX.set(baseX.get() - (e.deltaX || e.deltaY) * sensitivity);
    }
  };

  const isDirectVideo = (url: string) => {
    return Boolean(url && (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:')));
  };

  const isEmbeddable = (url: string) => {
    return Boolean(url && (url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('embed')));
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

  const handlePlayClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
  };

  return (
    <section id="work" className="py-12 md:py-28 overflow-hidden relative group/section">
      <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-3 md:mb-4">
              <Film size={12} className="text-primary" />
              <span>Curated Showreel</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-black leading-none tracking-tight">
              {"SELECTED ".split(" ").map((word, i) => (
                <span key={i} className="hover-outline mr-2">{word}</span>
              ))}
              <span className="text-white">WORKS</span>
            </h3>
          </div>

          {/* Controls: View Mode & Category Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setViewMode('marquee')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                  viewMode === 'marquee'
                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                    : "text-white/60 hover:text-white"
                )}
                title="Cinematic Carousel View"
              >
                <Film size={14} />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                  viewMode === 'grid'
                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                    : "text-white/60 hover:text-white"
                )}
                title="Grid Gallery View"
              >
                <LayoutGrid size={14} />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap border",
                activeCategory === cat
                  ? "bg-white/15 text-primary border-primary/50 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                  : "bg-white/5 text-white/50 border-white/5 hover:text-white hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Marquee View */}
      {viewMode === 'marquee' ? (
        <div className="relative w-full overflow-hidden pb-8 pt-4">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

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
                const sensitivity = 0.08; 
                baseX.set(baseX.get() + info.delta.x * sensitivity); 
              }}
              className="flex gap-4 md:gap-8 px-4"
            >
              {marqueeProjects.map((project, i) => (
                <motion.div
                  key={`${project.id}-${i}`}
                  className="relative w-[280px] md:w-[460px] aspect-[16/10] glass-card rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden group glow-border flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    if (!isDragging.current) {
                      setSelectedProject(project);
                    }
                  }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Thumbnail Image */}
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div className="flex justify-between items-end">
                      <div className="pointer-events-none pr-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1.5 block font-bold">
                          {project.category}
                        </span>
                        <h4 className="text-base md:text-xl font-display font-bold group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h4>
                      </div>
                      <button 
                        onClick={(e) => handlePlayClick(e, project)}
                        aria-label={`Play ${project.title}`}
                        className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 aspect-square bg-primary text-black rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl shadow-primary/30"
                      >
                        <Play size={22} className="fill-black ml-0.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="max-w-7xl mx-auto px-6 pt-2 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className="group relative glass-card rounded-[2rem] overflow-hidden cursor-pointer glow-border hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl shadow-primary/50 group-hover:scale-110 transition-transform">
                      <Play size={24} className="fill-black ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="text-lg font-display font-bold group-hover:text-primary transition-colors mb-2">
                      {project.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] text-white/60">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 2 && (
                        <span className="text-[10px] text-white/40 self-center">
                          +{project.skills.length - 2}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Project Video / Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12"
          >
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
              onClick={() => setSelectedProject(null)} 
            />
            
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-5xl glass-card rounded-[2.5rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row max-h-[90vh] glow-border border-white/10 shadow-2xl z-10"
            >
              <button 
                className="absolute top-4 right-4 md:top-6 md:right-6 z-30 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 text-white"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Video Area */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[260px] md:min-h-[460px] relative">
                {isDirectVideo(selectedProject.videoUrl) ? (
                  <video 
                    className="w-full h-full max-h-[75vh] object-contain bg-black"
                    src={selectedProject.videoUrl}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : isEmbeddable(selectedProject.videoUrl) || (selectedProject.videoUrl && selectedProject.videoUrl.includes('drive.google.com')) ? (
                  <iframe 
                    className="w-full h-full aspect-video min-h-[260px] md:min-h-[460px]"
                    src={getEmbedUrl(selectedProject.videoUrl)}
                    title={selectedProject.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedProject.videoUrl ? (
                  <div className="relative group/modal-img w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                    <img 
                      src={selectedProject.thumbnail} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
                      alt=""
                    />
                    <div className="relative z-10 text-center max-w-sm">
                      <div className="mb-5 mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40">
                        <Play size={32} className="text-primary fill-primary/30 ml-1" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Watch on External Platform</h4>
                      <p className="text-gray-300 text-xs md:text-sm mb-6 font-light">
                        This content is hosted on {selectedProject.videoUrl.includes('instagram') ? 'Instagram' : selectedProject.videoUrl.includes('linkedin') ? 'LinkedIn' : 'an external platform'}.
                      </p>
                      <button 
                        onClick={() => window.open(selectedProject.videoUrl, '_blank', 'noreferrer')}
                        className="px-6 py-3 bg-primary text-black font-black text-xs md:text-sm rounded-xl hover:scale-105 transition-all shadow-[0_0_25px_rgba(20,184,166,0.4)] inline-flex items-center gap-2"
                      >
                        Launch Video <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full min-h-[320px] md:min-h-[460px] flex items-center justify-center bg-zinc-950">
                    <img 
                      src={selectedProject.thumbnail} 
                      className="w-full h-full object-contain max-h-[75vh]"
                      alt={selectedProject.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-primary">
                        <Film size={14} />
                        <span>High-Impact Commercial Reel</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details Area */}
              <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2 block font-mono">
                    {selectedProject.category}
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter leading-tight font-display">
                    {selectedProject.title}
                  </h4>
                  <p className="text-gray-400 mb-6 text-sm font-light leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40">Skills & Tools</h5>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-white/80">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {selectedProject.videoUrl ? (
                    <button 
                      onClick={() => window.open(selectedProject.videoUrl, '_blank', 'noreferrer')}
                      className="w-full py-3.5 bg-primary text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:scale-[1.01]"
                    >
                      Watch Video <ArrowUpRight size={16} />
                    </button>
                  ) : (
                    <div className="w-full py-3.5 bg-white/5 text-white/80 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-white/10">
                      <Film size={16} className="text-primary" /> Commercial Production Cut
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
