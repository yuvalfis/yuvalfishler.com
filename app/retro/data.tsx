import type { ReactNode } from "react";

export type ResumeJob = {
  id: string;
  role: string;
  company?: string;
  years: string;
  bullets: ReactNode[];
};

export const resumeJobs: ResumeJob[] = [
  {
    id: "job-agam",
    role: "Founding Engineer",
    company: "AGAM Analytics",
    years: "2024–2026",
    bullets: [
      "Architected & deployed end-to-end data systems for large-scale NGO organizations.",
      "Led full product ownership solo — concept, system design, all the way to production.",
      "Built core platforms turning fragmented org data into actionable insights.",
      "Worked shoulder-to-shoulder with teams & stakeholders on scalable, intuitive systems.",
    ],
  },
  {
    id: "job-db",
    role: "CTO & Strategic Consultant",
    company: "DB Investment Group",
    years: "2025–2026",
    bullets: [
      <>
        Consulted on strategy in the emerging <b>Agentic AI</b> industry.
      </>,
      "Led planning, team building, and product direction for enterprise AI.",
      <>
        Spearheaded <b>Bedu.io</b> — an AI platform automating business execution.
      </>,
      "Oversaw cross-functional collaboration across product, engineering & ops.",
    ],
  },
  {
    id: "job-orbb",
    role: "Founding Engineer",
    company: "Orbb",
    years: "2023–2024",
    bullets: [
      "Built infrastructure for an AI-driven relationship-mapping platform.",
      "Designed systems translating complex relationship data into human experiences.",
      "Collaborated closely with founders on product vision & execution.",
    ],
  },
  {
    id: "job-dissrup",
    role: "Co-Founder & CTO",
    company: "Dissrup.com",
    years: "2021–2023",
    bullets: [
      "Designed & developed the company's core platform architecture.",
      "Managed & mentored an overseas dev team of seven.",
      "Participated in fundraising & investor presentations.",
      "Balanced technical leadership with product vision & creative problem-solving.",
    ],
  },
  {
    id: "job-realfriend",
    role: "Full-Stack Dev & Israel CEO",
    company: "RealFriend.ai",
    years: "2019–2021",
    bullets: [
      "Managed dev & ops teams in a fast-paced startup environment.",
      "Led product architecture and software development processes.",
      "Built communication-focused digital experiences & interaction systems.",
    ],
  },
  {
    id: "job-political",
    role: "Software Innovation",
    company: "Political Field",
    years: "2017–2019",
    bullets: [
      "Developed messaging-distribution systems & database management tools.",
      "Built targeted fundraising & engagement platforms for campaigns.",
      "Focused on communication systems, audience engagement & behavioral dynamics.",
    ],
  },
  {
    id: "job-video",
    role: "Independent Video Producer",
    years: "ALWAYS",
    bullets: [
      "Produced videos for private clients & organizations.",
      "Worked across scripting, filming, editing & post-production.",
      "Developed a visual storytelling approach fusing technical precision with creativity.",
    ],
  },
];

export const skills: Array<[label: string, percent: number]> = [
  ["Storytelling & Creative Thinking", 97],
  ["Videography & Photography", 93],
  ["Team Leadership", 95],
  ["Visual Communication", 90],
  ["Creative Production", 92],
  ["AI & Software Systems", 96],
  ["Product Design & Strategy", 89],
  ["Post-Production Workflows", 88],
  ["Cross-Disciplinary Collaboration", 94],
  ["Staying Calm Under Pressure", 100],
];

export const hobbies: string[] = [
  "🎸 Guitar",
  "🧘 Meditation",
  "🎥 Videography",
  "📷 Photography",
  "🤿 Diving",
  "🎬 Cinema",
  "🧠 Human Psychology",
  "📖 Visual Storytelling",
];

export type ChiptuneTrack = { name: string; notes: number[]; tempo: number };

export const chiptuneTracks: ChiptuneTrack[] = [
  {
    name: "midnight_render_v2_FINAL.mid — 128kbps of pure feeling",
    notes: [220, 0, 262, 0, 330, 0, 262, 0, 196, 0, 247, 0, 294, 0, 247, 0],
    tempo: 210,
  },
  {
    name: "startup_grind_theme.mid — allegro, con caffeine",
    notes: [330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 440, 494, 523, 494, 440, 392],
    tempo: 150,
  },
  {
    name: "end_credits_(you_the_hero).mid — bring tissues",
    notes: [262, 330, 392, 523, 392, 330, 349, 440, 349, 294, 392, 494, 523, 0, 0, 0],
    tempo: 260,
  },
];

export const roleTyperRoles: string[] = [
  "Software Engineer.",
  "Startup CTO.",
  "Founding Engineer.",
  "Team Leader.",
  "Storyteller.",
  "...still figuring it out.",
];
