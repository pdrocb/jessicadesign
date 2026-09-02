import Link from "next/link";
import { ProjectImageManager } from "@/cms/components/ProjectImageManager";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsField } from "@/cms/components/ui/CmsField";
import { saveProject } from "@/cms/projects/actions";
import type { LookbookProject } from "@/lib/lookbook";

export function ProjectEditor({ project, connected }: { project: LookbookProject; connected: boolean }) {
  const saveAction = saveProject.bind(null, project.id);

  return (
    <div className="cms-project-editor">
      <header className="cms-project-editor-heading">
        <Link className="cms-project-editor-back" href="/admin/projects">All projects</Link>
        <div className="cms-project-editor-title">
          <div>
            <h1>{project.title}</h1>
            <p>Update the project details, then arrange the gallery in its published order.</p>
          </div>
          <dl className="cms-project-editor-context">
            <div>
              <dt>Publication</dt>
              <dd data-published={project.published || undefined}>{project.published ? "Published" : "Draft"}</dd>
            </div>
            <div>
              <dt>Gallery</dt>
              <dd>{project.images.length} photographs</dd>
            </div>
          </dl>
        </div>
      </header>
      {!connected ? (
        <p className="cms-connection-note">Previewing the current project. Connect Neon to enable editing.</p>
      ) : null}
      <form action={saveAction} className="cms-project-form">
        <section className="cms-project-metadata" aria-labelledby={`${project.id}-details-heading`}>
          <div className="cms-project-section-heading">
            <div>
              <h2 id={`${project.id}-details-heading`}>Project details</h2>
              <p>These details appear alongside the project in the public Look Book.</p>
            </div>
          </div>
          <div className="cms-project-metadata-fields">
            <CmsField id={`${project.id}-title`} name="title" label="Title" defaultValue={project.title} disabled={!connected} wide />
            <CmsField id={`${project.id}-subtitle`} name="subtitle" label="Subtitle" defaultValue={project.subtitle ?? ""} disabled={!connected} />
            <CmsField id={`${project.id}-venue`} name="venue" label="Venue" defaultValue={project.venue ?? ""} disabled={!connected} />
            <CmsField id={`${project.id}-location`} name="location" label="Location" defaultValue={project.location ?? ""} disabled={!connected} />
            <CmsField id={`${project.id}-photographer`} name="photographer" label="Photography" defaultValue={project.photographer ?? ""} disabled={!connected} />
          </div>
        </section>
        <ProjectImageManager
          projectId={project.id}
          coverImageId={project.coverImageId}
          images={project.images}
          connected={connected}
        />
        <footer className="cms-project-actions">
          <p>Changes to project details and alternative text are saved together.</p>
          <div className="cms-project-action-buttons">
            <Link href="/admin/projects">Cancel</Link>
            <CmsButton type="submit" disabled={!connected}>Save project</CmsButton>
          </div>
        </footer>
      </form>
    </div>
  );
}
