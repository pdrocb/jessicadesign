"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { ProjectHomeToggle } from "@/cms/components/ProjectHomeToggle";
import { ProjectPublishedToggle } from "@/cms/components/ProjectPublishedToggle";
import { moveProject } from "@/cms/projects/actions";
import type { LookbookProject } from "@/lib/lookbook";

function ProjectOrderControls({
  projectId,
  projectTitle,
  connected,
  canMoveUp,
  canMoveDown,
}: {
  projectId: string;
  projectTitle: string;
  connected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function run(direction: "up" | "down") {
    setMessage("");
    startTransition(async () => {
      const result = await moveProject(projectId, direction);
      if (!result.ok) setMessage(result.message ?? "The project could not be moved. Try again.");
    });
  }

  return (
    <div className="cms-project-order" aria-busy={pending}>
      <button
        aria-label={`Move ${projectTitle} up`}
        title="Move up"
        type="button"
        disabled={!connected || !canMoveUp || pending}
        onClick={() => run("up")}
      >
        <CmsIcon name="up" />
      </button>
      <button
        aria-label={`Move ${projectTitle} down`}
        title="Move down"
        type="button"
        disabled={!connected || !canMoveDown || pending}
        onClick={() => run("down")}
      >
        <CmsIcon name="down" />
      </button>
      {message ? <span className="cms-project-order-error" role="alert">{message}</span> : null}
    </div>
  );
}

export function ProjectsEditor({ projects, connected }: { projects: LookbookProject[]; connected: boolean }) {
  const homeProjectCount = projects.filter((project) => project.featured).length;
  const homeLimitReached = homeProjectCount >= 7;

  return (
    <div>
      <CmsPageHeader
        title="Look Book"
        description={`Manage publication, Home visibility and the shared display order. ${homeProjectCount} of 7 projects are shown on Home.`}
        actions={
          <>
            <a className="cms-secondary-link" href="/look-book" target="_blank" rel="noreferrer">View live page</a>
            {connected ? <Link className="cms-primary-link" href="/admin/projects/new">New project</Link> : null}
          </>
        }
      />
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
                <div className="cms-project-visibility-controls">
                  <ProjectPublishedToggle
                    key={`published-${project.published}`}
                    projectId={project.id}
                    published={project.published}
                    disabled={!connected}
                  />
                  <ProjectHomeToggle
                    key={`home-${project.published}-${project.featured}`}
                    projectId={project.id}
                    featured={project.featured}
                    published={project.published}
                    disabled={!connected}
                    limitReached={homeLimitReached}
                  />
                </div>
                <ProjectOrderControls
                  projectId={project.id}
                  projectTitle={project.title}
                  connected={connected}
                  canMoveUp={index > 0}
                  canMoveDown={index < projects.length - 1}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
