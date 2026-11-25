import { NextResponse } from "next/server";
import { parseMediumFeed } from "@/lib/medium";

const mediumFeedUrl = "https://medium.com/feed/@syedmuhammad1112005";

export async function GET() {
  try {
    const response = await fetch(mediumFeedUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Medium RSS returned HTTP ${response.status}`);
    }

    const feed = await response.text();
    if (!/<rss\b/i.test(feed) || !/<channel\b/i.test(feed)) {
      throw new Error("Medium returned an invalid RSS feed");
    }
    const articles = parseMediumFeed(feed);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Unable to load Medium articles:", error);
    return NextResponse.json(
      { error: "Articles are temporarily unavailable. Please try again soon." },
      { status: 502 },
    );
  }
}
