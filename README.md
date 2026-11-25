# Syed Muhammad — Portfolio

A responsive, editorial-style portfolio built with Next.js, React, TypeScript, GSAP ScrollTrigger, Lenis, Framer Motion (available for future micro-interactions), and Lucide icons.

## Run locally

1. Install Node.js (LTS recommended).
2. Extract this project.
3. Open the project folder in VS Code.
4. Open a terminal in the project folder and run:

```bash
npm install
npm run dev
```

5. Visit http://localhost:3000

## Before publishing

- Add your professional portrait or a custom hero visual.
- Add verified GitHub/live-demo URLs for each project in `data/portfolio.ts`.
- Add your preferred public contact email or a contact link in the contact section.
- Add real certificate names, dates, and verification links.
- Verify the timeline wording and dates before publishing.
- Replace any project descriptions or technology lists that need correction.

## Deploy to Vercel

Push the project to GitHub, import the repository in Vercel, and deploy with the default Next.js settings. No backend or environment variables are required for this version.

## Project structure

- `app/` — Next.js app entry and global styling
- `components/` — portfolio sections, reveal animation, smooth scrolling
- `data/portfolio.ts` — editable profile, projects, skills, and timeline content

The project intentionally contains no backend, database, authentication, or server API.
