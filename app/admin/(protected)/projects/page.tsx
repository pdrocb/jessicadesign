import { ProjectsEditor } from "@/cms/components/ProjectsEditor";
import { requireSession } from "@/cms/auth/session";
import { flushPendingBlobDeletions } from "@/cms/projects/blob-cleanup";
import { getCmsProjects } from "@/cms/projects/repository";

export default async function ProjectsPage() {
  await requireSession();
  await flushPendingBlobDeletions();
  const { projects, connected } = await getCmsProjects();
  return <ProjectsEditor projects={projects} connected={connected} />;
}
