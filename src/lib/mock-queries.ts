import { MOCK_FREELANCERS, MOCK_PROJECTS } from "@/constants/mock-data";
import type { Freelancer, Project } from "@/types";

export function getProjectById(id: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.id === id);
}

export function getFreelancerById(id: string): Freelancer | undefined {
  return MOCK_FREELANCERS.find((f) => f.id === id);
}

export function getRelatedProjects(project: Project, limit = 3): Project[] {
  return MOCK_PROJECTS.filter(
    (p) =>
      p.id !== project.id &&
      (p.industry === project.industry ||
        p.skills.some((s) => project.skills.includes(s))),
  ).slice(0, limit);
}

export function getRelatedFreelancers(
  project: Project,
  limit = 3,
): Freelancer[] {
  return MOCK_FREELANCERS.filter(
    (f) =>
      f.industry === project.industry ||
      f.skills.some((s) => project.skills.includes(s)),
  ).slice(0, limit);
}

export function getFreelancerProjects(
  freelancer: Freelancer,
  limit = 3,
): Project[] {
  return MOCK_PROJECTS.filter(
    (p) =>
      p.industry === freelancer.industry ||
      p.skills.some((s) => freelancer.skills.includes(s)),
  ).slice(0, limit);
}
