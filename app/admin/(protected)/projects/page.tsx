import { ProjectsEditor } from "@/cms/components/ProjectsEditor";
import { getCmsProjects } from "@/cms/projects/repository";

export default async function ProjectsPage() {
  const { projects, connected } = await getCmsProjects();
  return <ProjectsEditor projects={projects} connected={connected} />;
}
