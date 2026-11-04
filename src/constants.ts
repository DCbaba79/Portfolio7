export interface Project {
  id: string;
  title: string;
  category: string;
  role: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  skills: string[];
  /** Short editorial line used on the showcase */
  logline: string;
}

export const PROJECTS: Project[] = [
  {
    id: "byjus",
    title: "Startup Autopsy – Byju’s",
    category: "Infographic",
    role: "Video Editor · Motion Design",
    thumbnail: "https://i.postimg.cc/jd1vvnBf/Screenshot-2025-09-21-145910.png",
    videoUrl: "https://drive.google.com/file/d/1x-WyEuyYevImc7_Q-UIbDqNBJVCdue6-/view?usp=sharing",
    description: "A deep dive into the rise and fall of Byju's, featuring intricate motion graphics and data visualization.",
    logline: "The rise and fall of an edtech giant, told through data.",
    skills: ["Motion Graphics", "Data Viz", "Storytelling"],
  },
  {
    id: "gut-story",
    title: "MindFlora",
    category: "Commercial",
    role: "Video Editor · Motion Design",
    thumbnail: "https://i.postimg.cc/yNVcPTnZ/Screenshot-2026-10-13-152217.png",
    videoUrl: "",
    description: "High-retention commercial reel explaining probiotic science with kinetic typography, motion graphics, and dynamic visual pacing.",
    logline: "Probiotic science, paced for retention.",
    skills: ["Kinetic Typography", "Motion Graphics", "Sound Design"],
  },
  {
    id: "worn-out",
    title: "Worn Out – Music Video",
    category: "Music",
    role: "Video Editor · Color",
    thumbnail: "https://i.postimg.cc/zX026SG2/Screenshot-2025-09-21-151358.png",
    videoUrl: "https://drive.google.com/file/d/1ge_1jeyZ6AQWhKoW07Q36hafg-nagGQD/view?usp=sharing",
    description: "Cinematic music video edit with heavy emphasis on mood, lighting, and pacing.",
    logline: "Mood, light and pacing, cut to the beat.",
    skills: ["Color Grading", "Multicam", "Mood"],
  },
  {
    id: "gla-throwback",
    title: "GLA Throwback",
    category: "Event",
    role: "Video Editor",
    thumbnail: "https://i.postimg.cc/d3VH97m7/Screenshot-2025-09-21-153702.png",
    videoUrl: "https://drive.google.com/file/d/1jyC8ju_cQeI8i2ogaBfdpnvCdKXx-TcU/view?usp=drive_link",
    description: "Nostalgic event recap capturing the best moments with fluid transitions.",
    logline: "A nostalgic recap stitched with fluid transitions.",
    skills: ["Dynamic Editing", "Audio Mastering"],
  },
  {
    id: "devlabs-space",
    title: "Devlabs Devspace Trailer",
    category: "Social Media",
    role: "Video Editor · Branding",
    thumbnail: "https://i.postimg.cc/jjTXbJ84/Screenshot-2026-05-03-160725.png",
    videoUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7432128189302267904/",
    description: "Creative storytelling for Devlabs, designed to engage professional audiences on LinkedIn and X.",
    logline: "A launch trailer built for professional feeds.",
    skills: ["Editing", "Branding", "Short-form"],
  },
  {
    id: "devlabs-partnership",
    title: "DevLabs x AI+ Partnership",
    category: "Commercial",
    role: "Video Editor · Motion Design",
    thumbnail: "https://i.postimg.cc/T3trZHD3/Screenshot-2026-05-03-161224.png",
    videoUrl: "https://www.instagram.com/reel/DVSUgd2jZ0t/",
    description: "Bringing together builders, creators and innovators shaping the future of AI.",
    logline: "Builders, creators and innovators, in one cut.",
    skills: ["Motion Graphics", "Promo", "Cinematic"],
  },
];

export type VideoSource =
  | { kind: 'drive'; embed: string; href: string }
  | { kind: 'file'; src: string }
  | { kind: 'external'; href: string; platform: string }
  | { kind: 'none' };

export function getVideoSource(url: string): VideoSource {
  if (!url) return { kind: 'none' };
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) return { kind: 'file', src: url };
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return { kind: 'drive', embed: `https://drive.google.com/file/d/${drive[1]}/preview`, href: url };
  const platform = url.includes('instagram') ? 'Instagram' : url.includes('linkedin') ? 'LinkedIn' : 'external platform';
  return { kind: 'external', href: url, platform };
}

export interface ExperienceItem {
  role: string;
  org: string;
  kind: string;
  description?: string;
  points: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Lead Video Editor",
    org: "V-NEST Startup Incubator",
    kind: "Video",
    description: "Contributed to content creation and visual storytelling, producing engaging media to enhance brand presence and outreach.",
    points: [
      "Edited videos and designed graphics for digital platforms",
      "Supported content planning and campaign execution",
      "Handled post-production (color grading, audio, motion graphics)",
      "Ensured consistent visual branding across content",
    ],
  },
  {
    role: "Video Editor",
    org: "DevLabs",
    kind: "Video",
    description: "Overseeing multimedia production and digital presence for a fast-growing developer ecosystem.",
    points: [
      "Cinematic video production",
      "Brand identity development",
      "Creative asset management",
      "Technical storyboarding",
    ],
  },
  {
    role: "Social Media Lead",
    org: "GLA Club, CloudOps, IEEE Photonics",
    kind: "Content",
    description: "Developing comprehensive digital strategies and creative content to drive engagement and brand awareness across multiple tech communities.",
    points: [
      "Cross-platform content strategy",
      "Community engagement & growth",
      "Visual storytelling & branding",
      "Collaborative campaign management",
    ],
  },
];

export interface ToolGroup {
  id: string;
  label: string;
  tools: string[];
}

export const TOOLKIT: ToolGroup[] = [
  {
    id: "edit",
    label: "Edit",
    tools: ["DaVinci Resolve", "Premiere Pro", "Multicam", "Dynamic Editing", "Short-form"],
  },
  {
    id: "motion",
    label: "Motion & Graphics",
    tools: ["After Effects", "Motion Graphics", "Kinetic Typography", "Data Viz", "Photoshop"],
  },
  {
    id: "color",
    label: "Color & Sound",
    tools: ["Color Grading", "Sound Design", "Audio Mastering", "Mood"],
  },
  {
    id: "story",
    label: "Story",
    tools: ["Visual Storytelling", "Pacing", "Branding", "Creative Direction"],
  },
];

export const STATS = [
  { label: "Views Generated", value: 300000 },
  { label: "Happy Clients", value: 10 },
  { label: "Projects Completed", value: 20 },
  { label: "Years Experience", value: 2 },
];
