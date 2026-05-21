import type { Freelancer, Project } from "@/types";
import { getSiteUrl } from "@/lib/site-config";

const SITE_URL = getSiteUrl();

const EMPLOYMENT_TYPE_MAP: Record<Project["contractType"], string> = {
  freelance: "CONTRACTOR",
  werkvertrag: "CONTRACTOR",
  dienstvertrag: "CONTRACTOR",
  anue: "TEMPORARY",
  festanstellung: "FULL_TIME",
};

const COUNTRY_NAME: Record<Project["country"], string> = {
  DE: "Deutschland",
  AT: "Österreich",
  CH: "Schweiz",
};

export function OrganizationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreelanceConnect",
    legalName: "FreelanceConnect GmbH",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "kontakt@freelanceconnect.de",
        areaServed: ["DE", "AT", "CH"],
        availableLanguage: ["de", "en"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function WebsiteJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreelanceConnect",
    url: SITE_URL,
    inLanguage: "de-DE",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function ProjectJobPostingJsonLd({ project }: { project: Project }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: project.title,
    description: project.description,
    datePosted: project.publishedAt,
    employmentType: EMPLOYMENT_TYPE_MAP[project.contractType],
    industry: project.industry,
    skills: project.skills.join(", "),
    identifier: {
      "@type": "PropertyValue",
      name: "FreelanceConnect",
      value: project.id,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: project.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: project.location,
        addressRegion: project.region,
        postalCode: project.postalCode,
        addressCountry: project.country,
      },
    },
    ...(project.workMode === "remote"
      ? { jobLocationType: "TELECOMMUTE" }
      : {}),
    applicantLocationRequirements: {
      "@type": "Country",
      name: COUNTRY_NAME[project.country],
    },
    validThrough: addDays(project.publishedAt, 60),
    ...(project.budgetMin !== undefined && project.budgetMax !== undefined
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: {
              "@type": "QuantitativeValue",
              minValue: project.budgetMin,
              maxValue: project.budgetMax,
              unitText:
                project.budgetUnit === "hour"
                  ? "HOUR"
                  : project.budgetUnit === "day"
                    ? "DAY"
                    : "MONTH",
            },
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * DSGVO-konformes Person-Schema. Wenn die Identität für den Betrachter nicht
 * freigegeben ist (kein lizenzierter Recruiter), werden Klarname und exakter
 * Standort weggelassen — Suchmaschinen sehen nur die Berufsrolle.
 */
export function FreelancerPersonJsonLd({
  freelancer,
  revealIdentity,
}: {
  freelancer: Freelancer;
  revealIdentity: boolean;
}) {
  const url = `${SITE_URL}/freelancers/${freelancer.id}`;
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": url,
    name: revealIdentity
      ? freelancer.fullName
      : `IT-Freelancer (${freelancer.title})`,
    jobTitle: freelancer.title,
    knowsLanguage: freelancer.languages,
    knowsAbout: freelancer.skills,
    address: {
      "@type": "PostalAddress",
      addressLocality: revealIdentity ? freelancer.location : undefined,
      addressRegion: revealIdentity
        ? freelancer.region
        : freelancer.region ?? "DACH",
      addressCountry: freelancer.country,
    },
    url,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
