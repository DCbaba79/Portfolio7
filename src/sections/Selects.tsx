import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { getProject } from '../data/site';
import Clip from '../components/Clip';
import { Fade, Line } from '../components/Reveal';
import { MetaGrid, OpenCut, Process } from '../components/Facts';

const nh7 = getProject('nh7-weekender')!;
const autopsy = getProject('startup-autopsy')!;
const ren = getProject('renaissance')!;

function SelectTag({ n, of = 3, kind }: { n: number; of?: number; kind: string }) {
  return (
    <div className="flex items-center justify-between border-b border-paper/10 pb-4">
      <span className="label text-paper/45">
        Select {String(n).padStart(2, '0')} / {String(of).padStart(2, '0')}
      </span>
      <span className="label text-paper/45">{kind}</span>
    </div>
  );
}

/* ——— 01 · NH7: the festival gets the whole width ——— */
function SceneNH7() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const inset = useTransform(scrollYProgress, (v) => `inset(${(1 - v) * 14}% ${(1 - v) * 9}% round 2px)`);
  const scale = useTransform(scrollYProgress, (v) => 1.18 - v * 0.18);

  return (
    <article className="safe-x pt-10" aria-labelledby="nh7-title">
      <SelectTag n={1} kind={nh7.category} />
      <h3 id="nh7-title" className="sr-only">{nh7.title}</h3>

      <div className="relative mt-10 md:mt-16">
        <Line className="display relative z-10 text-[clamp(3.2rem,11.5vw,12rem)]">Make something</Line>
        <motion.div ref={ref} style={{ clipPath: inset }} className="relative -mt-[0.18em] aspect-video w-full overflow-hidden">
          <motion.div style={{ scale }} className="h-full w-full">
            <Clip src={nh7.loop!} poster={nh7.poster} label={`${nh7.title} preview`} className="h-full w-full" />
          </motion.div>
        </motion.div>
        <Line className="relative z-10 -mt-[0.42em] text-right text-[clamp(4rem,15vw,16rem)] leading-[0.8]">
          <span className="accent accent-hover">crazy.</span>
        </Line>
      </div>

      <div className="mt-12 grid gap-12 md:mt-20 md:grid-cols-12">
        <Fade className="md:col-span-5">
          <p className="label mb-4 text-orange">The brief, word for word</p>
          <p className="text-[clamp(1.35rem,2.3vw,2rem)] leading-[1.15] tracking-[-0.025em]">
            Three Google Drives of raw footage from Aditya Gadhvi’s set at NH7 Weekender, Pune. One
            instruction: <span className="accent accent-hover">“make something crazy.”</span>
          </p>
          <OpenCut p={nh7} className="mt-10" />
        </Fade>
        <Fade className="md:col-span-3 md:col-start-7" delay={0.1}>
          <p className="label mb-4 text-paper/40">Process</p>
          <Process steps={nh7.process} />
        </Fade>
        <Fade className="md:col-span-3 md:col-start-10" delay={0.2}>
          <MetaGrid p={nh7} />
          <p className="mt-6 border-t border-paper/10 pt-4 text-[13px] leading-relaxed text-paper/55">{nh7.outcome}</p>
        </Fade>
      </div>
    </article>
  );
}

/* ——— 02 · Startup Autopsy: presented as the case file it is ——— */
function SceneAutopsy() {
  const report: [string, string][] = [
    ['Subject', 'Byju’s'],
    ['Peak valuation', '$22 billion'],
    ['Losses', '₹8,000 crore +'],
    ['Cause of death', 'Rapid expansion, poor decisions'],
    ['On camera', 'No one'],
    ['Examined by', 'Dhyan Salavi, sole editor'],
  ];
  return (
    <article className="safe-x" aria-labelledby="autopsy-title">
      <SelectTag n={2} kind={autopsy.category} />
      <div className="mt-10 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <Clip src={autopsy.loop!} poster={autopsy.poster} label={`${autopsy.title} preview`} className="aspect-square w-full" />
              <span className="tc pointer-events-none absolute -left-2 -top-3 rotate-[-4deg] border border-orange bg-ink px-2 py-1 text-[11px] text-orange">
                CASE 002 · V-NEST
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <h3 id="autopsy-title" className="text-[clamp(3rem,7.4vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.055em]">
            <Line>Startup</Line>
            <Line delay={0.08}><span className="accent accent-hover">Autopsy.</span></Line>
          </h3>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/65">
            An explainer with no one on screen. The voiceover arrived, and everything else had to be built
            from scratch.
          </p>

          <Fade className="mt-10">
            <p className="label mb-3 text-teal-3">Findings</p>
            <dl className="border-t border-paper/15">
              {report.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 border-b border-paper/10 py-3">
                  <dt className="tc text-[11.5px] uppercase tracking-[0.1em] text-paper/40">{k}</dt>
                  <dd className="text-[15px] text-paper/90">{v}</dd>
                </div>
              ))}
            </dl>
          </Fade>

          <Fade className="mt-10 grid gap-10 sm:grid-cols-2">
            <div>
              <p className="label mb-4 text-paper/40">Procedure</p>
              <Process steps={autopsy.process} />
            </div>
            <div>
              <MetaGrid p={autopsy} />
              <p className="mt-6 border-t border-paper/10 pt-4 text-[13px] leading-relaxed text-paper/55">{autopsy.outcome}</p>
            </div>
          </Fade>
          <OpenCut p={autopsy} tone="teal" className="mt-12" />
        </div>
      </div>
    </article>
  );
}

/* ——— 03 · RenAIssance: one vertical frame, the title split around it ——— */
function SceneRen() {
  return (
    <article className="safe-x" aria-labelledby="ren-title">
      <SelectTag n={3} kind={ren.category} />
      <h3 id="ren-title" className="sr-only">{ren.title}</h3>

      <div className="relative mt-10 grid items-center gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Line className="font-serif text-[clamp(4.5rem,11vw,11rem)] leading-[0.8] tracking-[-0.03em]">Ren</Line>
          <Line delay={0.06} className="tc -mt-1 text-[clamp(3.4rem,8vw,8rem)] leading-[0.9] text-teal-3">AI</Line>
          <Line delay={0.12} className="font-serif text-[clamp(4.5rem,11vw,11rem)] italic leading-[0.8] tracking-[-0.03em]">ssance</Line>
          <Fade className="mt-10 max-w-sm" delay={0.15}>
            <p className="label mb-3 text-orange">Brief</p>
            <p className="text-[16px] leading-relaxed text-paper/75">{ren.brief}</p>
          </Fade>
        </div>

        <div className="md:col-span-4">
          <Fade y={60}>
            <div className="relative mx-auto w-full max-w-[min(360px,46svh)] rounded-[28px] border border-paper/15 bg-ink-3 p-2">
              <Clip src={ren.loop!} poster={ren.poster} label={`${ren.title} preview`} className="aspect-[9/16] w-full rounded-[20px]" />
            </div>
          </Fade>
        </div>

        <div className="md:col-span-3 md:col-start-10">
          <Fade delay={0.1}>
            <p className="label mb-4 text-paper/40">Process</p>
            <Process steps={ren.process} />
          </Fade>
          <Fade delay={0.2} className="mt-10">
            <MetaGrid p={ren} />
            <p className="mt-6 border-t border-paper/10 pt-4 text-[13px] leading-relaxed text-paper/55">{ren.outcome}</p>
            <OpenCut p={ren} className="mt-10" />
          </Fade>
        </div>
      </div>
    </article>
  );
}

export default function Selects() {
  return (
    <section id="selects" className="relative pb-32 pt-16 md:pb-44">
      <div className="safe-x mb-20 md:mb-32">
        <span className="label text-paper/45">03 — Selects</span>
        <h2 className="mt-6 max-w-5xl text-[clamp(2.4rem,6.2vw,6.4rem)] font-medium leading-[0.95] tracking-[-0.045em]">
          <Line>Three cuts I’d put</Line>
          <Line delay={0.08}>
            in front of <span className="accent accent-hover">anyone.</span>
          </Line>
        </h2>
        <p className="mt-6 text-[14px] text-paper/50">Tap any clip for sound.</p>
      </div>
      <div className="space-y-36 md:space-y-56">
        <SceneNH7 />
        <SceneAutopsy />
        <SceneRen />
      </div>
    </section>
  );
}
