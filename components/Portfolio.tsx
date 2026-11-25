"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, X, Github, Linkedin, Mail, MessageCircle, MoveUpRight, NotebookText } from "lucide-react";
import { profile, projects, capabilities, timeline } from "@/data/portfolio";
import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import AnimatedPortrait from "@/components/AnimatedPortrait";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  ["About", "#about"],
  ["Work", "#work"],
  ["Approach", "#approach"],
  ["Contact", "#contact"],
];

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [navIndicator, setNavIndicator] = useState<{ left: number; width: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let previousY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      const currentSection = navItems.reduce<string | null>((active, [, href]) => {
        const section = document.getElementById(href.slice(1));
        return section && section.getBoundingClientRect().top <= 160
          ? href
          : active;
      }, null);

      setActiveNavItem((active) => active === currentSection ? active : currentSection);

      if (menuOpen || currentY < 72) {
        setHeaderHidden(false);
      } else if (Math.abs(delta) > 5) {
        setHeaderHidden(delta > 0);
      }

      if (currentY < 72 || Math.abs(delta) > 5) {
        previousY = currentY;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      const itemKey = hoveredNavItem || activeNavItem;
      const target = itemKey
        ? nav?.querySelector<HTMLElement>(`[data-nav-item="${itemKey}"]`)
        : null;

      setNavIndicator(
        target
          ? { left: target.offsetLeft - 12, width: target.offsetWidth + 24 }
          : null,
      );
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeNavItem, hoveredNavItem, menuOpen]);

  return (
    <>
      <SmoothScroll />
      <header
        className={headerHidden && !menuOpen ? "site-header site-header--hidden" : "site-header"}
        aria-hidden={headerHidden && !menuOpen}
        onFocusCapture={() => setHeaderHidden(false)}
      >
        <Link href="#top" className="wordmark" aria-label="Syed Muhammad home">
          SM<span>.</span>
        </Link>
        <div className="header-status"><span className="status-dot" /> AVAILABLE FOR OPPORTUNITIES</div>
        <nav
          className={menuOpen ? "nav nav--open" : "nav"}
          ref={navRef}
          onPointerLeave={() => setHoveredNavItem(null)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setHoveredNavItem(null);
            }
          }}
        >
          <span
            className={navIndicator ? "nav-indicator nav-indicator--visible" : "nav-indicator"}
            style={navIndicator ? {
              transform: `translate(${navIndicator.left}px, -50%)`,
              width: `${navIndicator.width}px`,
            } : undefined}
            aria-hidden="true"
          />
          {navItems.map(([label, href]) => (
            <a
              className={activeNavItem === href ? "nav-item nav-item--active" : "nav-item"}
              data-nav-item={label}
              aria-current={activeNavItem === href ? "location" : undefined}
              key={label}
              href={href}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setHoveredNavItem(label);
              }}
              onFocus={() => setHoveredNavItem(label)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link
            className="nav-blog"
            data-nav-item="Blog"
            href="/articles"
            aria-label="Blog"
            title="Blog"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHoveredNavItem("Blog");
            }}
            onFocus={() => setHoveredNavItem("Blog")}
            onClick={() => setMenuOpen(false)}
          >
            <NotebookText size={20} strokeWidth={1.8} aria-hidden="true" />
            <span className="visually-hidden">Blog</span>
          </Link>
          <a
            className="nav-contact"
            href="#contact"
            onPointerEnter={() => setHoveredNavItem(null)}
            onFocus={() => setHoveredNavItem(null)}
            onClick={() => setMenuOpen(false)}
          >
            Let&apos;s talk <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="header-actions">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-topline">
            <span>PORTFOLIO / 2026</span>
            <span>{profile.location}</span>
          </div>
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> DEVELOPER. BUILDER. CURIOUS MIND.</p>
              <h1>Digital craft.<br /><em>Engineered.</em></h1>
              <p className="hero-intro">{profile.intro}</p>
              <div className="hero-actions">
                <a className="button button--light" href="#work">Explore my work <ArrowDown size={16} /></a>
                <Link className="text-link" href="/resume">View resume <ArrowUpRight size={14} /></Link>
                <a className="text-link" href="#contact">Let&apos;s connect <ArrowUpRight size={16} /></a>
              </div>
            </div>
            <AnimatedPortrait />
          </div>
          <div className="hero-bottomline">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-symbol"><ArrowDown size={15} /></span>
            <span>DESIGN-MINDED DEVELOPMENT</span>
          </div>
        </section>

        <section className="intro-band">
          <p>GOOD DIGITAL WORK ISN&apos;T JUST ABOUT WHAT YOU SEE.</p>
          <p>IT&apos;S ABOUT HOW IT <span>THINKS, FEELS,</span> AND WORKS.</p>
        </section>

        <section id="about" className="section section-shell about-section">
          <Reveal><div className="section-heading"><span>01 / A LITTLE ABOUT ME</span><span>THE PERSON BEHIND THE PIXELS</span></div></Reveal>
          <div className="about-grid">
            <Reveal className="about-title"><h2>Technology is my medium.<br /><em>Building is my direction.</em></h2></Reveal>
            <Reveal className="about-copy">
              <p className="large-copy">I&apos;m Syed Muhammad, a computer science student and developer who enjoys turning ideas into useful digital experiences.</p>
              <p>My journey spans frontend interfaces, full-stack applications, collaborative product work, and a growing curiosity about how emerging technologies can solve real problems.</p>
              <p>I&apos;m currently pursuing my BS in Computer Science at the University of Education, Lahore. Along the way, I completed my associate degree at Superior University and gained professional exposure through an internship at NETSOL Technologies.</p>
              <a className="underlined-link" href={profile.linkedin} target="_blank" rel="noreferrer">A little more on LinkedIn <ArrowUpRight size={15} /></a>
            </Reveal>
          </div>
        </section>

        <section className="disciplines-section">
          <div className="section-shell">
            <Reveal><div className="section-heading"><span>02 / WHAT I DO</span><span>THREE CONNECTED DISCIPLINES</span></div></Reveal>
            <div className="discipline-grid">
              {[
                ["01", "Frontend", "Engineering", "Interfaces that feel considered, responsive, and intuitive.", "01 — VISUAL"],
                ["02", "Full-stack", "Development", "Connecting the interface to the logic and data behind it.", "02 — FUNCTIONAL"],
                ["03", "Emerging", "Technologies", "Exploring AI, security, and new ways to make software more useful.", "03 — CURIOUS"],
              ].map((item) => (
                <Reveal key={item[0]} className="discipline-card">
                  <div className="discipline-meta"><span>{item[0]}</span><span>{item[4]}</span></div>
                  <div className="discipline-symbol">{item[0] === "01" ? "◌" : item[0] === "02" ? "⌘" : "✳"}</div>
                  <h3>{item[1]}<br /><em>{item[2]}</em></h3>
                  <p>{item[3]}</p>
                  <div className="card-rule" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section section-shell work-section">
          <Reveal><div className="section-heading"><span>03 / SELECTED WORK</span><span>A FEW THINGS I&apos;VE BEEN BUILDING</span></div></Reveal>
          <div className="work-intro">
            <Reveal><h2>Ideas made<br /><em>tangible.</em></h2></Reveal>
            <Reveal><p>A selection of academic, collaborative, and independent work. Each project has been a chance to learn, experiment, and make something useful.</p></Reveal>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <Reveal key={project.number} className="project-row">
                <div className={`project-visual ${project.visual}`}>
                  <div className="visual-window"><div className="window-top"><i /><i /><i /><span>{project.name}</span></div><div className="window-content"><b>{project.number}</b><span>{project.name}</span><small>{project.category}</small><div className="visual-bars"><i /><i /><i /></div></div></div>
                  <span className="visual-index">{project.number} / 05</span>
                </div>
                <div className="project-info">
                  <div className="project-meta"><span>{project.category}</span><span>{project.status}</span></div>
                  <h3>
                    {project.url
                      ? <a href={project.url} target="_blank" rel="noreferrer">{project.name} <ArrowUpRight size={17} /></a>
                      : project.name}
                  </h3>
                  <p>{project.description}</p>
                  <div className="tag-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-note">
                    {project.url ? "CASE STUDY DETAILS" : "CASE STUDY DETAILS & LINKS TO BE ADDED"}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="approach" className="approach-section">
          <div className="section-shell">
            <Reveal><div className="section-heading"><span>04 / HOW I APPROACH THE WORK</span><span>THOUGHT BEFORE EXECUTION</span></div></Reveal>
            <Reveal><h2>Make it make sense.<br /><em>Then make it real.</em></h2></Reveal>
            <div className="process-grid">
              {[
                ["01", "Understand", "Start with the problem, the people, and the purpose. Good solutions begin with good questions."],
                ["02", "Shape", "Give the idea structure. Think through the user journey, the interface, and the experience."],
                ["03", "Build", "Turn the direction into working software, test the details, and keep improving."],
              ].map((step) => <Reveal key={step[0]} className="process-item"><span>{step[0]}</span><h3>{step[1]}</h3><p>{step[2]}</p></Reveal>)}
            </div>
          </div>
        </section>

        <section className="section section-shell capabilities-section">
          <Reveal><div className="section-heading"><span>05 / THE TOOLKIT</span><span>TOOLS I WORK WITH & EXPLORE</span></div></Reveal>
          <div className="capabilities-layout">
            <Reveal>
              <h2>Curiosity is<br /><em>part of the stack.</em></h2>
              <p className="capability-note">A practical toolkit that keeps evolving as I learn, build, and take on new challenges.</p>
              <div className="toolkit-graphic" aria-hidden="true">
                <div className="toolkit-stack">
                  {capabilities.slice(0, 3).map((group, index) => (
                    <div className={`toolkit-stack__layer toolkit-stack__layer--${index + 1}`} key={group.title}>
                      <span className="toolkit-stack__number">0{index + 1}</span>
                      <strong>{group.title}</strong>
                      <small>{group.items.slice(0, 3).join(" · ")}</small>
                    </div>
                  ))}
                </div>
                <span className="toolkit-graphic__caption">TOOLS FOR WHAT COMES NEXT</span>
              </div>
            </Reveal>
            <div className="capability-groups">
              {capabilities.map((group, i) => <Reveal key={group.title} className="capability-group"><div className="capability-number">0{i + 1}</div><div><h3>{group.title}</h3><div className="tag-list tag-list--large">{group.items.map((item) => <span key={item}>{item}</span>)}</div></div></Reveal>)}
            </div>
          </div>
        </section>

        <section className="timeline-section">
          <div className="section-shell">
            <Reveal><div className="section-heading"><span>06 / THE JOURNEY SO FAR</span><span>LEARNING BY DOING</span></div></Reveal>
            <div className="timeline-layout">
              <div className="timeline-intro">
                <Reveal><h2>Every step<br /><em>adds a layer.</em></h2></Reveal>
                <Reveal className="journey-graphic-reveal">
                  <div className="journey-graphic" aria-hidden="true">
                    <svg viewBox="0 0 420 230" role="presentation">
                      <path className="journey-graphic__grid" d="M20 205H400M20 25V205M115 25V205M210 25V205M305 25V205M400 25V205" />
                      <path className="journey-graphic__route-base" d="M20 166C78 166 82 122 143 122S211 176 270 139 337 56 400 76" />
                      <path className="journey-graphic__route" pathLength="1" d="M20 166C78 166 82 122 143 122S211 176 270 139 337 56 400 76" />
                      {[["20", "166", "01"], ["143", "122", "02"], ["270", "139", "03"], ["400", "76", "04"]].map(([cx, cy, number]) => (
                        <g className="journey-graphic__milestone" key={number}>
                          <circle className="journey-graphic__halo" cx={cx} cy={cy} r="12" />
                          <circle className="journey-graphic__point" cx={cx} cy={cy} r="3.5" />
                          <text className="journey-graphic__number" x={cx} y={Number(cy) - 19} textAnchor="middle">{number}</text>
                        </g>
                      ))}
                    </svg>
                    <span className="journey-graphic__caption">A PATH BUILT ONE STEP AT A TIME</span>
                  </div>
                </Reveal>
              </div>
              <div className="timeline-list">{timeline.map((item) => <Reveal key={`${item.period}-${item.title}`} className="timeline-item"><span className="timeline-period">{item.period}</span><div><h3>{item.title}</h3><p className="timeline-place">{item.place}</p><p>{item.detail}</p></div></Reveal>)}</div>
            </div>
          </div>
        </section>

        <section className="section-shell contact-section" id="contact">
          <Reveal><div className="section-heading"><span>07 / START A CONVERSATION</span><span>OPEN TO GOOD IDEAS & OPPORTUNITIES</span></div></Reveal>
          <Reveal><p className="eyebrow"><span className="eyebrow-line" /> HAVE SOMETHING IN MIND?</p><h2>Something great<br />starts with <em>a hello.</em></h2></Reveal>
          <div className="contact-bottom">
            <p>Whether it&apos;s a project, an opportunity, or simply an interesting conversation — I&apos;d be glad to hear from you.</p>
            <div className="social-links">
              <a className="whatsapp-link" href="https://wa.me/923286623900?text=Hi%20Syed%2C%20I%27d%20like%20to%20connect%20with%20you." target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp <MoveUpRight size={15} /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <MoveUpRight size={15} /></a>
              <a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <MoveUpRight size={15} /></a>
              <a href={`mailto:${profile.gmail}`}><Mail size={17} /> {profile.gmail} <MoveUpRight size={15} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <Link href="#top" className="wordmark">SM<span>.</span></Link>
        <span>DESIGNED WITH INTENT. BUILT WITH CURIOSITY.</span>
        <a href="#top">BACK TO TOP ↑</a>
        <span>© {new Date().getFullYear()} SYED MUHAMMAD</span>
      </footer>
    </>
  );
}
