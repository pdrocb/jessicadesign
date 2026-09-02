import { notFound } from "next/navigation";
import { ProjectEditor } from "@/cms/components/ProjectEditor";
import { getCmsProject } from "@/cms/projects/repository";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { project, connected } = await getCmsProject(projectId);
  if (!project) notFound();

  return <ProjectEditor project={project} connected={connected} />;
}
