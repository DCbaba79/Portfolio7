export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  skills: string[];
  stats?: {
    views?: string;
    duration?: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: "byjus",
    title: "Startup Autopsy – Byju’s",
    category: "Infographic",
    thumbnail: "https://i.postimg.cc/jd1vvnBf/Screenshot-2025-09-21-145910.png",
    videoUrl: "https://drive.google.com/file/d/1x-WyEuyYevImc7_Q-UIbDqNBJVCdue6-/view?usp=sharing",
    description: "A deep dive into the rise and fall of Byju's, featuring intricate motion graphics and data visualization.",
    skills: ["Motion Graphics", "Data Viz", "Storytelling"],
  },
  {
    id: "valorant",
    title: "Valorant Clutch Edit",
    category: "Gaming",
    thumbnail: "https://i.postimg.cc/5tpZ4qsr/OIP-1.webp",
    videoUrl: "https://drive.google.com/file/d/1R0d_BAkBbaFMIsMAem4sMZdWRhlEwRCz/view?usp=sharing",
    description: "High-octane gaming montage with beat-syncing and energetic transitions.",
    skills: ["Beat Sync", "Masking", "Sfx"],
  },
  {
    id: "worn-out",
    title: "Worn Out – Music Video",
    category: "Music",
    thumbnail: "https://i.postimg.cc/zX026SG2/Screenshot-2025-09-21-151358.png",
    videoUrl: "https://drive.google.com/file/d/1ge_1jeyZ6AQWhKoW07Q36hafg-nagGQD/view?usp=sharing",
    description: "Cinematic music video edit with heavy emphasis on mood, lighting, and pacing.",
    skills: ["Color Grading", "Multicam", "Mood"],
  },
  {
    id: "gla-throwback",
    title: "GLA Throwback",
    category: "Event",
    thumbnail: "https://i.postimg.cc/d3VH97m7/Screenshot-2025-09-21-153702.png",
    videoUrl: "https://drive.google.com/file/d/1jyC8ju_cQeI8i2ogaBfdpnvCdKXx-TcU/view?usp=drive_link",
    description: "Nostalgic event recap capturing the best moments with fluid transitions.",
    skills: ["Dynamic Editing", "Audio Mastering"],
  },
  {
    id: "devlabs-space",
    title: "Devlabs Devspace trailer",
    category: "Social Media",
    thumbnail: "https://i.postimg.cc/jjTXbJ84/Screenshot-2026-05-03-160725.png",
    videoUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7432128189302267904/",
    description: "Creative storytelling for Devlabs, designed to engage professional audiences on LinkedIn and X.",
    skills: ["Editing", "Branding", "Short-form"],
  },
  {
    id: "devlabs-partnership",
    title: "DevLabs x AI+ Partnership",
    category: "Commercial",
    thumbnail: "https://i.postimg.cc/T3trZHD3/Screenshot-2026-05-03-161224.png",
    videoUrl: "https://www.instagram.com/reel/DVSUgd2jZ0t/",
    description: "Bringing together builders, creators and innovators shaping the future of AI",
    skills: ["Motion Graphics", "Promo", "Cinematic"],
  }
];

export interface Skill {
  name: string;
  level: number;
  category: string;
  logo?: string;
}

export const SKILLS: Skill[] = [
  { 
    name: "DaVinci Resolve", 
    level: 95, 
    category: "Editing",
    logo: "https://i.postimg.cc/PJw7Lg6C/Da-Vinci-Resolve-Studio.png"
  },
  { 
    name: "Premiere Pro", 
    level: 90, 
    category: "Editing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg"
  },
  { 
    name: "After Effects", 
    level: 80, 
    category: "Motion Graphics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg"
  },
  { 
    name: "Photoshop", 
    level: 85, 
    category: "Design",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg"
  },
];

export const STATS = [
  { label: "Views Generated", value: 50000 },
  { label: "Happy Clients", value: 10 },
  { label: "Projects Completed", value: 20 },
  { label: "Years Experience", value: 2 },
];
