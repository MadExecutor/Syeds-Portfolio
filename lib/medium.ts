export type MediumArticle = {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  image: string | null;
  tags: string[];
  readingTime: number;
};

const decodeXml = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    );

function getTagValue(xml: string, tag: string) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(
    new RegExp(`<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`, "i"),
  );
  if (!match) return "";
  const cdata = match[1].match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return decodeXml(cdata ? cdata[1] : match[1]);
}

function htmlToText(html: string) {
  return decodeXml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function getExcerpt(content: string, description: string) {
  const paragraphs = [...content.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => htmlToText(match[1]))
    .filter((paragraph) => paragraph && !/^by\s+syed muhammad\b/i.test(paragraph));
  const text = paragraphs[0] || htmlToText(description || content);
  if (text.length <= 230) return text;
  return `${text.slice(0, 227).trimEnd()}...`;
}

export function parseMediumFeed(xml: string): MediumArticle[] {
  const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)];

  return items
    .map((item) => {
      const source = item[1];
      const title = htmlToText(getTagValue(source, "title"));
      const url = getTagValue(source, "link").trim();
      const publishedAt = getTagValue(source, "pubDate").trim();
      const content = getTagValue(source, "content:encoded");
      const description = getTagValue(source, "description");
      const imageMatch = (content || description).match(
        /<img\b[^>]*\bsrc=["']([^"']+)["']/i,
      );
      const wordCount = htmlToText(content || description)
        .split(/\s+/)
        .filter(Boolean).length;

      return {
        title,
        url,
        publishedAt,
        excerpt: getExcerpt(content, description),
        image: imageMatch?.[1] ?? null,
        tags: [...source.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)]
          .map((category) => htmlToText(decodeXml(category[1])))
          .filter(Boolean),
        readingTime: Math.max(1, Math.ceil(wordCount / 220)),
      };
    })
    .filter((article) => article.title && article.url)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}
