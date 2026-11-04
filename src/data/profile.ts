/**
 * Single source of truth for personal links.
 * Anything left as an empty string is hidden from the UI rather than shown as a dead link.
 */
export const PROFILE = {
  name: 'Dhyan Salavi',
  shortName: 'DHYAN.S',
  logo: 'https://i.postimg.cc/50nzByRk/Chat-GPT-Image-May-2-2026-12-06-49-AM.png',
  email: 'dhyansalavi15@gmail.com',
  phone: '+91 72278 13924',
  phoneHref: 'tel:+917227813924',
  instagram: 'https://www.instagram.com/dj79.drp',
  // Add these to enable the matching buttons across the site.
  linkedin: '',
  // A URL or a file placed in /public (e.g. '/resume.pdf').
  resume: '',
};

export const SOCIALS = [
  { label: 'Email', href: `mailto:${PROFILE.email}`, value: PROFILE.email },
  { label: 'Instagram', href: PROFILE.instagram, value: '@dj79.drp' },
  { label: 'LinkedIn', href: PROFILE.linkedin, value: 'Profile' },
  { label: 'Call', href: PROFILE.phoneHref, value: PROFILE.phone },
].filter((s) => Boolean(s.href));
