"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import MediumIcon from "@/components/MediumIcon";
import type { MediumArticle } from "@/lib/medium";

type FeedState = "loading" | "ready" | "error";
const mediumProfileUrl = "https://medium.com/@syedmuhammad1112005";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently published"
    : new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
}

export default function ArticlesFeed() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [state, setState] = useState<FeedState>("loading");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All topics");

  async function loadArticles() {
    setState("loading");
    try {
      const response = await fetch("/api/articles");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to load articles");
      }
      if (!Array.isArray(result.articles)) {
        throw new Error("The Medium feed returned an invalid response");
      }
      setArticles(result.articles);
      setState("ready");
    } catch (error) {
      console.error("Unable to display Medium articles:", error);
      setState("error");
    }
  }

  useEffect(() => {
    void loadArticles();
  }, []);

  const tags = useMemo(
    () => ["All topics", ...new Set(articles.flatMap((article) => article.tags))].slice(0, 9),
    [articles],
  );
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.excerpt}`.toLowerCase().includes(normalizedQuery);
      const matchesTag =
        activeTag === "All topics" || article.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [activeTag, articles, query]);
  return (
    <section className="articles-feed section-shell" aria-label="Published articles">
      {state === "ready" && articles.length > 0 && (
        <div className="articles-controls">
          <label className="articles-search">
            <Search size={16} aria-hidden="true" />
            <span className="visually-hidden">Search articles</span>
            <input
              type="search"
              placeholder="Search articles..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="articles-filters" aria-label="Filter by topic">
            {tags.map((tag) => (
              <button
                className={activeTag === tag ? "article-filter article-filter--active" : "article-filter"}
                key={tag}
                onClick={() => setActiveTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {state === "loading" && (
        <div className="article-grid" aria-label="Loading articles" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div className="article-skeleton" key={item}>
              <div className="article-skeleton__image" />
              <div className="article-skeleton__body">
                <i /><i /><i /><i />
              </div>
            </div>
          ))}
        </div>
      )}

      {state === "error" && (
        <div className="articles-message" role="alert">
          <p>Articles could not be loaded from Medium right now.</p>
          <button className="article-retry" type="button" onClick={() => void loadArticles()}>
            Try again
          </button>
        </div>
      )}

      {state === "ready" && articles.length === 0 && (
        <div className="articles-message">
          <p>No public articles were found on the Medium feed yet.</p>
          <a href={mediumProfileUrl} target="_blank" rel="noreferrer">
            Visit my Medium profile <ArrowUpRight size={15} />
          </a>
        </div>
      )}

      {state === "ready" && articles.length > 0 && filteredArticles.length === 0 && (
        <div className="articles-message">
          <p>No articles match that search. Try another title or topic.</p>
        </div>
      )}

      {state === "ready" && filteredArticles.length > 0 && (
        <>
          <div className="article-grid">
            {filteredArticles.map((article, index) => (
              <article
                className={index === 0 ? "article-card article-card--featured" : "article-card"}
                key={article.url}
              >
                <a
                  className={article.image ? "article-card__image" : "article-card__image article-card__image--empty"}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {article.image ? (
                    // RSS thumbnails are external images; native lazy loading avoids a Next image-host configuration.
                    <img src={article.image} alt="" loading="lazy" />
                  ) : (
                    <span className="article-card__monogram">M.</span>
                  )}
                  {index === 0 && <span className="article-featured-label">LATEST ARTICLE</span>}
                </a>
                <div className="article-card__content">
                  <div className="article-tags">
                    {article.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <p className="article-meta">{formatDate(article.publishedAt)} <span>·</span> {article.readingTime} min read</p>
                  <h2><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h2>
                  <p className="article-excerpt">{article.excerpt || "Read the full article on Medium."}</p>
                  <div className="article-card__footer">
                    <span>Syed Muhammad</span>
                    <a href={article.url} target="_blank" rel="noreferrer">
                      Read article <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="articles-count">
            Showing {filteredArticles.length} of {articles.length} {articles.length === 1 ? "article" : "articles"}
          </p>
        </>
      )}
    </section>
  );
}
