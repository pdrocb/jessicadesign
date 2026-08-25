import Image from "next/image";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { ProjectImageManager } from "@/cms/components/ProjectImageManager";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsField } from "@/cms/components/ui/CmsField";
import { moveProject, saveProject } from "@/cms/projects/actions";
import type { LookbookProject } from "@/lib/lookbook";

export function ProjectsEditor({ projects, connected }: { projects: LookbookProject[]; connected: boolean }) {
  return (
    <div>
      <div className="cms-page-heading">
        <div><h1>Look Book</h1><p>Manage project details, publishing and display order.</p></div>
      </div>
      {!connected ? (
        <p className="cms-connection-note">Previewing the current projects. Connect Neon to enable editing, publishing and ordering.</p>
      ) : null}
      <div className="cms-project-list">
        {projects.map((project, index) => {
          const cover = project.images.find((image) => image.id === project.coverImageId) ?? project.images[0];
          const saveAction = saveProject.bind(null, project.id);
          return (
            <details className="cms-project-card" key={project.id}>
              <summary>
                <div className="cms-project-thumb">
                  <Image src={cover.src} alt="" width={96} height={64} />
                </div>
                <span className="cms-project-summary-copy">
                  <strong>{project.title}</strong>
                  <small>{project.location ?? "Location not set"} · {project.images.length} photographs</small>
                  <em data-published={project.published || undefined}>{project.published ? "Published" : "Draft"}</em>
                </span>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span className="cms-project-disclosure"><CmsIcon name="down" /></span>
              </summary>
              <div className="cms-project-body">
                <div className="cms-project-toolbar">
                  <div><strong>Project settings</strong><small>Update its public details, status and position.</small></div>
                  <div className="cms-project-order">
                    <form action={moveProject.bind(null, project.id, "up")}><button disabled={!connected || index === 0}>Move up</button></form>
                    <form action={moveProject.bind(null, project.id, "down")}><button disabled={!connected || index === projects.length - 1}>Move down</button></form>
                  </div>
                </div>
                <form action={saveAction} className="cms-project-form">
                  {[
                    ["title", "Title", project.title],
                    ["subtitle", "Subtitle", project.subtitle ?? ""],
                    ["venue", "Venue", project.venue ?? ""],
                    ["location", "Location", project.location ?? ""],
                    ["photographer", "Photography", project.photographer ?? ""],
                  ].map(([name, label, value]) => (
                    <CmsField id={`${project.id}-${name}`} name={name} label={label} defaultValue={value} disabled={!connected} key={name} />
                  ))}
                  <label className="cms-check cms-project-publish"><input type="checkbox" name="published" defaultChecked={project.published} disabled={!connected} /><span><strong>Published</strong><small>Show this project in the public Look Book.</small></span></label>
                  <ProjectImageManager
                    projectId={project.id}
                    coverImageId={project.coverImageId}
                    images={project.images}
                    connected={connected}
                  />
                  <div className="cms-project-actions"><CmsButton type="submit" disabled={!connected}>Save project</CmsButton></div>
                </form>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
