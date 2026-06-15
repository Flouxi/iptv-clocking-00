import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { BLOG_POSTS, formatDate, getPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — IPNORD4K Blogg` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.image },
          { property: "og:type", content: "article" },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: loaderData.post.title,
              description: loaderData.post.excerpt,
              datePublished: loaderData.post.date,
              author: { "@type": "Person", name: loaderData.post.author },
              publisher: { "@type": "Organization", name: "IPNORD4K" },
            }),
          },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold">Inlägget hittades inte</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Till bloggen</Link>
    </div>
  ),
  errorComponent: () => <div className="container-page py-20 text-center"><h1>Något gick fel</h1></div>,
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <div className="container-page max-w-3xl py-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Tillbaka till bloggen
        </Link>

        <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-primary">{post.category}</span>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Av {post.author}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readMinutes} min läsning</span>
        </div>

        <img src={post.image} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" />

        <div
          className="blog-content mt-10 text-[15px] leading-relaxed text-foreground/90 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_a]:font-semibold [&_a]:text-primary hover:[&_a]:underline [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />


        <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Vill du komma igång snabbare?</p>
          <Link to="/shop" className="mt-3 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Utforska våra PDF-verktyg
          </Link>
        </div>
      </div>

      <section className="container-page max-w-5xl pb-20">
        <h2 className="text-xl font-bold">Läs också</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary">
              <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(p.date)} • {p.readMinutes} min</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
