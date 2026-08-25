"use client";

import { useState } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";
import { CmsField } from "@/cms/components/ui/CmsField";

type CollectionField<T> = {
  key: Extract<keyof T, string>;
  label: string;
  type: "text" | "textarea";
  rows?: number;
  maxLength: number;
};

type CmsCollectionEditorProps<T extends { id: string }> = {
  name: string;
  itemLabel: string;
  addLabel: string;
  initialItems: readonly T[];
  fields: readonly CollectionField<T>[];
  createItem: (id: string) => T;
  onDirty: () => void;
};

const MAX_ITEMS = 24;

function newCollectionId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function CmsCollectionEditor<T extends { id: string }>({
  name,
  itemLabel,
  addLabel,
  initialItems,
  fields,
  createItem,
  onDirty,
}: CmsCollectionEditorProps<T>) {
  const [items, setItems] = useState<T[]>(() => initialItems.map((item) => ({ ...item })));
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; position: number } | null>(null);

  const updateItems = (next: T[]) => {
    setItems(next);
    onDirty();
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    updateItems(next);
  };

  return (
    <div className="cms-collection-editor" data-wide>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="cms-collection-list">
        {items.map((item, index) => (
          <section className="cms-collection-item" key={item.id}>
            <header className="cms-collection-heading">
              <div>
                <strong>{itemLabel} {index + 1}</strong>
                <small>Position {index + 1} of {items.length}</small>
              </div>
              <div className="cms-collection-actions">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={`Move ${itemLabel} ${index + 1} up`}
                  title="Move up"
                >
                  <CmsIcon name="up" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={`Move ${itemLabel} ${index + 1} down`}
                  title="Move down"
                >
                  <CmsIcon name="down" />
                </button>
                <button
                  type="button"
                  disabled={items.length === 1}
                  onClick={() => setDeleteTarget({ id: item.id, position: index + 1 })}
                  aria-label={`Delete ${itemLabel} ${index + 1}`}
                  title="Delete"
                >
                  <CmsIcon name="trash" />
                </button>
              </div>
            </header>
            <div className="cms-collection-fields">
              {fields.map((field) => (
                <CmsField
                  key={field.key}
                  id={`${name}-${item.id}-${field.key}`}
                  name={`${name}-${item.id}-${field.key}`}
                  label={field.label}
                  type={field.type}
                  rows={field.rows}
                  maxLength={field.maxLength}
                  required
                  value={String(item[field.key] ?? "")}
                  onChange={(event) => {
                    const next = items.map((candidate, candidateIndex) => (
                      candidateIndex === index
                        ? { ...candidate, [field.key]: event.currentTarget.value }
                        : candidate
                    ));
                    updateItems(next);
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      <button
        className="cms-collection-add"
        type="button"
        disabled={items.length >= MAX_ITEMS}
        onClick={() => updateItems([
          ...items,
          createItem(newCollectionId(name.replace(".items", ""))),
        ])}
      >
        <CmsIcon name="plus" />
        {addLabel}
      </button>
      <CmsConfirmDialog
        open={deleteTarget !== null}
        title={`Delete ${itemLabel.toLowerCase()} ${deleteTarget?.position ?? ""}?`}
        description={`This removes it from the current draft. Save changes to publish the updated ${itemLabel.toLowerCase()} list.`}
        confirmLabel={`Delete ${itemLabel.toLowerCase()}`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          updateItems(items.filter((candidate) => candidate.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
