import React, { useEffect } from 'react';
import { scrollToSettled } from '../lib/scroll';
import Hero from '../components/sections/Hero';
import Portfolio from '../components/sections/Portfolio';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Contact from '../components/sections/Contact';
import TypeBand from '../components/sections/TypeBand';
import TimelineScrubber from '../components/ui/TimelineScrubber';

export default function Home() {
  // Deep links like /#contact on first load
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => scrollToSettled(id), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Hero />
      <Portfolio />
      <About />
      <TypeBand />
      <Experience />
      <Skills />
      <Contact />
      <TimelineScrubber />
    </>
  );
}
