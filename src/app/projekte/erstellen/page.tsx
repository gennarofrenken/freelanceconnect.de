import type { Metadata } from "next";
import { CreateProjectView } from "./CreateProjectView";

export const metadata: Metadata = {
  title: "Projekt einstellen",
  description:
    "Stellen Sie Ihr IT-Projekt auf FreelanceConnect ein und erhalten Sie passgenaue Bewerbungen aus der DACH-Region — ohne Vermittlungsgebühr.",
};

export default function CreateProjectPage() {
  return <CreateProjectView />;
}
