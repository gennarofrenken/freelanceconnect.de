import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-config";

const BASE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/profil",
          "/profil/",
          "/freelancers/",
          "/recruiter/",
          "/passwort-vergessen",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
