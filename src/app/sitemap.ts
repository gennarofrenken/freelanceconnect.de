import type { MetadataRoute } from "next";
import { MOCK_FREELANCERS, MOCK_PROJECTS } from "@/constants/mock-data";

const BASE_URL = "https://freelanceconnect.de";

const STATIC_PATHS: ReadonlyArray<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/search", changeFrequency: "daily", priority: 0.9 },
  { path: "/projekte/erstellen", changeFrequency: "monthly", priority: 0.7 },
  { path: "/preise", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ueber-uns", changeFrequency: "yearly", priority: 0.5 },
  { path: "/karriere", changeFrequency: "weekly", priority: 0.6 },
  { path: "/kontakt", changeFrequency: "yearly", priority: 0.4 },
  { path: "/login", changeFrequency: "yearly", priority: 0.3 },
  { path: "/register", changeFrequency: "yearly", priority: 0.5 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.2 },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.2 },
  { path: "/agb", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${BASE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = MOCK_PROJECTS.map((p) => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const freelancerEntries: MetadataRoute.Sitemap = MOCK_FREELANCERS.map(
    (f) => ({
      url: `${BASE_URL}/freelancers/${f.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticEntries, ...projectEntries, ...freelancerEntries];
}
