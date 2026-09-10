import type { ReactNode } from 'react';
import { Edit3, LoaderCircle, Plus, Trash2 } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
};

export function AdminPageHeader({ title, description, actionLabel = 'Tambah baru', actionIcon, onAction }: PageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div>
        <p className="admin-eyebrow">Pengelolaan konten</p>
        <h2 className="admin-page-title">{title}</h2>
        <p className="admin-page-description">{description}</p>
      </div>
      {onAction && (
        <button type="button" onClick={onAction} className="admin-button admin-button--primary">
          {actionIcon ?? <Plus aria-hidden="true" />}
          {actionLabel}
        </button>
      )}
    </header>
  );
}

export function AdminAlert({ children }: { children: ReactNode }) {
  return <p role="alert" className="admin-alert admin-alert--error">{children}</p>;
}

export function AdminTableState({ colSpan, children, loading = false }: { colSpan: number; children: ReactNode; loading?: boolean }) {
  return <tr><td colSpan={colSpan} className="admin-table-state">{loading && <LoaderCircle aria-hidden="true" className="admin-spinner" />}{children}</td></tr>;
}

export function AdminRowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <td className="px-6 py-4">
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onEdit} className="admin-icon-button" aria-label="Edit"><Edit3 aria-hidden="true" /></button>
        <button type="button" onClick={onDelete} className="admin-icon-button admin-icon-button--danger" aria-label="Hapus"><Trash2 aria-hidden="true" /></button>
      </div>
    </td>
  );
}

// Compact aliases keep manager pages readable while all shared UI lives here.
export function Header({ title, description, onAdd }: { title: string; description: string; onAdd: () => void }) {
  return <AdminPageHeader title={title} description={description} onAction={onAdd} />;
}

export function Alert({ text }: { text: string }) {
  return <AdminAlert>{text}</AdminAlert>;
}

export function Empty({ colSpan, text }: { colSpan: number; text: string }) {
  return <AdminTableState colSpan={colSpan}>{text}</AdminTableState>;
}

export const Actions = AdminRowActions;
