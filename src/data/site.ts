/**
 * Everything factual on the site lives here. Nothing in the UI should
 * state a client, number or result that isn't written in this file.
 */

export const PROFILE = {
  name: 'Dhyan Salavi',
  alias: 'DJ79',
  file: 'DJ79.drp',
  email: 'dhyansalavi15@gmail.com',
  instagram: { href: 'https://www.instagram.com/dj79.drp', handle: '@dj79.drp' },
  linkedin: { href: 'https://www.linkedin.com/in/dhyan-salavi/', handle: 'in/dhyan-salavi' },
  base: 'India · Remote',
  raccoon: '/media/raccoon.webp',
};

/** Frames pulled from the work itself, used by the title sequence and the hero. */
export const FRAMES = [
  1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29,
].map((n) => `/media/frames/f${String(n).padStart(2, '0')}.jpg`);

export type Aspect = '16/9' | '1/1' | '9/16';

export interface Project {
  id: string;
  title: string;
  /** Shorter title for tight spots */
  short: string;
  client: string;
  year?: string;
  category: string;
  format: string;
  aspect: Aspect;
  duration?: string;
  role: string;
  brief: string;
  process: string[];
  tools: string[];
  outcome?: string;
  /** 8-second preview with sound */
  loop?: string;
  poster: string;
  /** Full-length cut hosted with the site */
  film?: string;
  links: { label: string; href: string }[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'nh7-weekender',
    title: 'NH7 Weekender — Behind the Scenes',
    short: 'NH7 Weekender',
    client: 'GROW (Get Rich On Wednesday)',
    year: '2026',
    category: 'Event · BTS',
    format: 'Horizontal film',
    aspect: '16/9',
    duration: '0:58',
    role: 'Edit, animation & colour',
    brief:
      'No brief. Three Google Drives of raw footage from Aditya Gadhvi’s set at NH7 Weekender, Pune, and one instruction: make something crazy out of it.',
    process: [
      'Sorted three drives of unlogged footage into a story about the people behind the show.',
      'Cut, placed and animated every layer inside the edit, from the GROW intro to the stage.',
      'Graded the whole film to hold festival light, crowd and backstage together.',
    ],
    tools: ['DaVinci Resolve', 'Paper Animator'],
    outcome:
      'Cut as a content piece for GROW’s own brand. It now lives as an unlisted film GROW shows to prospective clients.',
    loop: '/media/nh7-loop.mp4',
    poster: '/media/nh7-poster.jpg',
    film: '/media/nh7.mp4',
    links: [
      { label: 'Original on Drive', href: 'https://drive.google.com/file/d/1VccEmISMvMx6xgUuJk0r_l0V9hbQznWe/view' },
    ],
    featured: true,
  },
  {
    id: 'startup-autopsy',
    title: 'Startup Autopsy — Byju’s',
    short: 'Startup Autopsy',
    client: 'V-NEST, VIT Chennai',
    year: '2025',
    category: 'Humanless explainer',
    format: 'Square reel',
    aspect: '1/1',
    duration: '0:47',
    role: 'Sole editor',
    brief:
      'No brief. A voiceover about how Byju’s, once valued at $22 billion, ran up losses of over ₹8,000 crore. Everything on screen had to be built from nothing.',
    process: [
      'Built every scene from type, stock and motion. No one appears on camera.',
      'Timed kinetic typography to the voiceover, word by word, so the numbers land.',
      'Gave the series a look of its own: contour lines, a purple field and a cyan and yellow type system.',
    ],
    tools: ['DaVinci Resolve'],
    outcome: 'Published on Instagram and LinkedIn as part of V-NEST’s Startup Autopsy series.',
    loop: '/media/autopsy-loop.mp4',
    poster: '/media/autopsy-poster.jpg',
    film: '/media/autopsy.mp4',
    links: [
      { label: 'Original on Drive', href: 'https://drive.google.com/file/d/1x-WyEuyYevImc7_Q-UIbDqNBJVCdue6-/view' },
    ],
    featured: true,
  },
  {
    id: 'renaissance',
    title: 'DevLabs × RenAIssance',
    short: 'RenAIssance',
    client: 'DevLabs, Arizona State University × AI+',
    year: '2026',
    category: 'Talking head · Event promo',
    format: 'Vertical reel',
    aspect: '9/16',
    duration: '0:27',
    role: 'Editor',
    brief:
      'Make the reel engaging enough to pull an audience to RenAIssance, an AI conference in San Francisco. Clips and script were supplied.',
    process: [
      'Cut two speakers into one continuous thought, trimming every pause.',
      'Kinetic captions throughout: the key words get weight, the rest stays out of the way.',
      'Placed speaker cards, sponsor marks and the promo-code hit where the eye already is.',
    ],
    tools: ['DaVinci Resolve'],
    outcome: 'Published on Instagram and LinkedIn to drive sign-ups for the conference.',
    loop: '/media/renaissance-loop.mp4',
    poster: '/media/renaissance-poster.jpg',
    film: '/media/renaissance.mp4',
    links: [
      { label: 'Original on Drive', href: 'https://drive.google.com/file/d/1yScRimrO4GZ88wEypLWJCp88Z99gEhtP/view' },
      { label: 'On Instagram', href: 'https://www.instagram.com/reel/DVSUgd2jZ0t/' },
    ],
    featured: true,
  },
  {
    id: 'mindflora',
    title: 'MindFlora',
    short: 'MindFlora',
    client: 'MindFlora',
    category: 'Humanless explainer · Commercial',
    format: 'Vertical reel',
    aspect: '9/16',
    duration: '0:48',
    role: 'Edit & motion design',
    brief: 'A commercial reel explaining probiotic science, built to hold attention to the last second.',
    process: [
      'Kinetic typography carries the argument, number by number.',
      'Motion graphics and stock are composited onto a single teal grid system.',
    ],
    tools: ['DaVinci Resolve'],
    loop: '/media/mindflora-loop.mp4',
    poster: '/media/mindflora-poster.jpg',
    film: '/media/mindflora.mp4',
    links: [
      { label: 'Original on Drive', href: 'https://drive.google.com/file/d/1fH10mnAtBZQwqqILS50-HZHsnKlf3gZ6/view' },
    ],
  },
  {
    id: 'gla-throwback',
    title: 'GLA Throwback',
    short: 'GLA Throwback',
    client: 'Gujarati Literary Association, VIT Chennai',
    year: '2024–25',
    category: 'Event recap',
    format: 'Horizontal film',
    aspect: '16/9',
    duration: '1:16',
    role: 'Editor',
    brief: 'A nostalgic recap of a year of GLA events: festivals, garba nights and the people in between.',
    process: ['Cut to the music with fluid transitions between events.', 'Audio mastered for social.'],
    tools: ['DaVinci Resolve'],
    loop: '/media/gla-loop.mp4',
    poster: '/media/gla-poster.jpg',
    links: [
      { label: 'Watch on Drive', href: 'https://drive.google.com/file/d/1jyC8ju_cQeI8i2ogaBfdpnvCdKXx-TcU/view' },
    ],
  },
  {
    id: 'worn-out',
    title: 'Worn Out',
    short: 'Worn Out',
    client: 'Music video',
    category: 'Music',
    format: 'Horizontal film',
    aspect: '16/9',
    role: 'Editor & colour',
    brief: 'A music video built on mood, low light and a slow, steady pulse.',
    process: ['Graded for mood and atmosphere.', 'Audio-reactive visualiser and lyric typography.'],
    tools: ['DaVinci Resolve'],
    loop: '/media/wornout-loop.mp4',
    poster: '/media/wornout-poster.jpg',
    links: [
      { label: 'Watch on Drive', href: 'https://drive.google.com/file/d/1ge_1jeyZ6AQWhKoW07Q36hafg-nagGQD/view' },
    ],
  },
  {
    id: 'devspace',
    title: 'DevSpace Trailer',
    short: 'DevSpace',
    client: 'DevLabs, Arizona State University',
    year: '2026',
    category: 'Event promo',
    format: 'Social trailer',
    aspect: '16/9',
    role: 'Editor',
    brief: 'A promotional event video for DevSpace, organised by DevLabs, built for LinkedIn and X.',
    process: ['Dynamic pacing and seamless transitions around the event’s key moments.'],
    tools: ['DaVinci Resolve'],
    poster: 'https://i.postimg.cc/jjTXbJ84/Screenshot-2026-05-03-160725.png',
    links: [
      { label: 'Watch on LinkedIn', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7432128189302267904/' },
    ],
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);
export const ARCHIVE = PROJECTS.filter((p) => !p.featured);
export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);

export const RANGE = [
  {
    id: 'high',
    label: 'High-energy',
    tempo: 'Fast',
    line: 'Phonk edits and festival recaps. Cut on the beat, landing on the drop.',
    seenIn: ['nh7-weekender', 'gla-throwback'],
  },
  {
    id: 'talk',
    label: 'Talking head',
    tempo: 'Medium',
    line: 'People on camera, kept watchable to the last second with captions, punch-ins and pacing.',
    seenIn: ['renaissance'],
  },
  {
    id: 'humanless',
    label: 'Humanless',
    tempo: 'Precise',
    line: 'Explainers with no one on screen. Just type, motion and a voice.',
    seenIn: ['startup-autopsy', 'mindflora'],
  },
] as const;

export const CREDITS = [
  { role: 'Video Editor', org: 'DevLabs, Arizona State University', when: 'Mar — Jun 2026' },
  { role: 'Editor, collaboration', org: 'GROW (Get Rich On Wednesday)', when: '2026' },
  { role: 'Lead Video Editor', org: 'V-NEST Startup Incubator, VIT Chennai', when: 'Jun 2025 — Jan 2026' },
  { role: 'Social Media Lead', org: 'Gujarati Literary Association, VIT Chennai', when: 'May — Sep 2025' },
  { role: 'Social Media', org: 'CloudOps · IEEE Photonics', when: '' },
];

export const NUMBERS = [
  { value: 300, suffix: 'K+', label: 'views across clients and my own pages' },
  { value: 20, suffix: '+', label: 'clients' },
  { value: 20, suffix: '+', label: 'projects delivered' },
  { value: 2, suffix: '', label: 'years in the edit' },
];

export const TOOLS = {
  primary: 'DaVinci Resolve',
  also: ['Paper Animator', 'Video2X', 'blur', 'vizzy.io'],
};

export const TESTIMONIAL = {
  quote:
    'Dhyan has a great creative eye, understands the brief quickly, and consistently brings his own perspective to the output. Really appreciate his dedication and the quality of work he delivers!',
  name: 'Jnanam Shah',
};

/** Chapter markers, in page order. Colours follow Resolve's marker habit, in brand tones. */
export const MARKERS = [
  { id: 'open', label: 'Cold open', tone: 'teal' },
  { id: 'file', label: 'DJ79.drp', tone: 'orange' },
  { id: 'reel', label: 'Showreel', tone: 'paper' },
  { id: 'selects', label: 'Selects', tone: 'teal' },
  { id: 'range', label: 'Range', tone: 'orange' },
  { id: 'bin', label: 'The bin', tone: 'paper' },
  { id: 'credits', label: 'Credits', tone: 'teal' },
  { id: 'contact', label: 'Post-credits', tone: 'orange' },
] as const;
