import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ArticlesFeed from "@/components/ArticlesFeed";
import MediumIcon from "@/components/MediumIcon";
import ThemeToggle from "@/components/ThemeToggle";

const mediumProfileUrl = "https://medium.com/@syedmuhammad1112005";

export const metadata: Metadata = {
  title: "Articles & Insights — Syed Muhammad",
  description:
    "Technical articles and perspectives on software engineering, web development, security, and building with AI.",
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <header className="articles-header">
        <Link className="articles-wordmark" href="/" aria-label="Syed Muhammad home">SM<span>.</span></Link>
        <div className="articles-header-actions">
          <ThemeToggle />
          <Link className="articles-back" href="/"><ArrowLeft size={15} /> Portfolio</Link>
        </div>
      </header>

      <section className="articles-hero section-shell">
        <div className="articles-hero__copy">
          <p className="eyebrow"><span className="eyebrow-line" /> NOTES FROM THE BUILD</p>
          <h1>Articles &<br /><em>insights.</em></h1>
          <p className="articles-intro">
            Technical learnings, programming experiences, and perspectives on
            building thoughtful software — collected from my writing on Medium.
          </p>
          <a className="articles-profile-link" href={mediumProfileUrl} target="_blank" rel="noreferrer">
            <MediumIcon size={20} /> Follow on Medium <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="articles-hero__art" aria-hidden="true">
          <span className="articles-art-orbit articles-art-orbit--one" />
          <span className="articles-art-orbit articles-art-orbit--two" />
          <span className="articles-art-mark">M</span>
          <span className="articles-art-caption">IDEAS, BUILT INTO PRACTICE</span>
        </div>
        <div className="articles-hero__bottom">
          <span>WRITING / ENGINEERING / CURIOSITY</span>
          <a href="#published">EXPLORE THE ARTICLES ↓</a>
        </div>
      </section>

      <div className="articles-section-heading section-shell" id="published">
        <span>SELECTED WRITING</span>
        <a href={mediumProfileUrl} target="_blank" rel="noreferrer">
          View all on Medium <ArrowUpRight size={14} />
        </a>
      </div>
      <ArticlesFeed />
    </main>
  );
}
