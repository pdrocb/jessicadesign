import Image from "next/image";
import Link from "next/link";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { ProjectPublishedToggle } from "@/cms/components/ProjectPublishedToggle";
import { moveProject } from "@/cms/projects/actions";
import type { LookbookProject } from "@/lib/lookbook";

export function ProjectsEditor({ projects, connected }: { projects: LookbookProject[]; connected: boolean }) {
  return (
    <div>
      <div className="cms-page-heading">
        <div><h1>Look Book</h1><p>Manage project visibility and display order, or open a project to edit it.</p></div>
      </div>
      {!connected ? (
        <p className="cms-connection-note">Previewing the current projects. Connect Neon to enable editing, publishing and ordering.</p>
      ) : null}
      <div className="cms-project-list">
        {projects.map((project, index) => {
          const cover = project.images.find((image) => image.id === project.coverImageId) ?? project.images[0];
          return (
            <article className="cms-project-card" key={project.id}>
              <Link className="cms-project-card-link" href={`/admin/projects/${project.id}`}>
                <div className="cms-project-thumb">
                  <Image src={cover.src} alt="" width={96} height={64} />
                </div>
                <span className="cms-project-summary-copy">
                  <strong>{project.title}</strong>
                  <small>{project.location ?? "Location not set"} · {project.images.length} photographs</small>
                </span>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span className="cms-project-disclosure"><CmsIcon name="down" /></span>
              </Link>
              <div className="cms-project-index-actions">
                <ProjectPublishedToggle projectId={project.id} published={project.published} disabled={!connected} />
                <div className="cms-project-order">
                  <form action={moveProject.bind(null, project.id, "up")}><button disabled={!connected || index === 0}>Move up</button></form>
                  <form action={moveProject.bind(null, project.id, "down")}><button disabled={!connected || index === projects.length - 1}>Move down</button></form>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
