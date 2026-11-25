export const profile = {
  name: "Syed Muhammad",
  role: "Developer & digital problem solver",
  location: "Lahore, Pakistan",
  intro:
    "I build thoughtful digital experiences where clear design meets purposeful engineering.",
  linkedin: "https://www.linkedin.com/in/syed-muhammad-in/",
  github: "https://github.com/MadExecutor/",
  gmail:"syedmuhammad.working@gmail.com",
};

type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  visual: string;
  status: string;
  url?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "Daddlez AI",
    category: "AI marketplace · Academic project",
    description:
      "A marketplace concept connecting people and businesses with useful AI tools, models, and agents.",
    stack: ["React", "Node.js", "Database", "AI APIs"],
    visual: "project-visual--daddlez",
    status: "Selected work",
     url: "https://daddlez.vercel.app/",

  },
  {
    number: "02",
    name: "Messters",
    category: "Creative commerce · Collaborative project",
    description:
      "An upcoming marketplace concept designed to bring artists, makers, and craft buyers together.",
    stack: ["MERN", "UI/UX", "E-commerce"],
    visual: "project-visual--messters",
    status: "Deployed and working",
    url: "https://messters.com/",
  },
  {
    number: "03",
    name: "Backtrack",
    category: "Lost & found platform",
    description: "A web app for managing lost and found items.",
    stack: ["Lost & Found", "Management System", "Web App"],
    visual: "project-visual--auth",
    status: "Live project",
    url: "https://back-track-web-app.vercel.app/",
  },
  {
    number: "04",
    name: "FoodDash",
    category: "Food ordering UI",
    description: "A modern interface for browsing and ordering food.",
    stack: ["Food Ordering", "UI/UX", "Responsive UI"],
    visual: "project-visual--weather",
    status: "Live project",
    url: "https://executors-portfolio.netlify.app/",
  },
  {
    number: "05",
    name: "MatSeek",
    category: "Material finder",
    description: "A smart tool for finding materials.",
    stack: ["Materials", "Smart Search", "Finder"],
    visual: "project-visual--shop",
    status: "Selected work",
  },
];

export const capabilities = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React", "Bootstrap", "Responsive UI"],
  },
  {
    title: "Backend & data",
    items: ["Node.js", "Express", "REST APIs", "PHP", "MySQL", "MongoDB"],
  },
  {
    title: "Tools & design",
    items: ["Git & GitHub", "Figma", "Canva", "XAMPP", "VS Code"],
  },
  {
    title: "Exploring",
    items: ["AI integration", "Cybersecurity", "WebSockets", "3D web"],
  },
];

export const timeline = [
  {
    period: "Present",
    title: "BS Computer Science",
    place: "University of Education, Lahore",
    detail: "Continuing my computer science studies.",
  },
  {
    period: "Completed",
    title: "Associate Degree in Computer Science",
    place: "Superior University",
    detail: "Built my academic foundation in computing and software development.",
  },
  {
    period: "Experience",
    title: "Technology internship",
    place: "NETSOL Technologies",
    detail: "Gained exposure to a professional technology environment.",
  },
  {
    period: "Training",
    title: "Web development learning",
    place: "Arfa Karim Technology Incubator & Corvit, Lahore",
    detail: "Expanded practical skills through focused technical training.",
  },
  {
    period: "Collaborations",
    title: "Web development learning",
    place: "Messters - Marketplace for Handmade Products",
    detail: "Enhanced Collaborations, Decision making and Teamwork.",
  },
 {
  period: "Projects",
  title: "Software & Web Development",
  place: "Academic, Personal & Collaborative Projects",
  detail: "Applied technical knowledge, problem-solving, frontend and backend development, UI/UX design."
}
];
