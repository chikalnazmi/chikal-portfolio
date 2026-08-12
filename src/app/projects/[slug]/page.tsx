import { PROJECTS_CONTENT } from "@/lib/content";
import Link from "next/link";

export function generateStaticParams() {
  return PROJECTS_CONTENT.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS_CONTENT.find((p) => p.slug === params.slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <main style={{ padding: "120px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/#projects" style={{ display: "inline-block", marginBottom: "40px", color: "var(--ink-soft)" }}>
        ← Kembali
      </Link>
      
      <span className="mono" style={{ backgroundColor: "var(--sage-light)", color: "var(--olive)", padding: "4px 12px", borderRadius: "999px" }}>
        {project.role}
      </span>
      
      <h1 style={{ fontSize: "var(--text-hero)", margin: "24px 0 16px", color: "var(--ink)" }}>
        {project.title}
      </h1>
      
      <p style={{ fontSize: "var(--text-body)", color: "var(--ink-soft)", lineHeight: 1.6 }}>
        {project.description}
      </p>
    </main>
  );
}
