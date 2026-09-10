import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdminPageHeader, AdminTableState } from '@/components/admin/AdminUi';
import { ContentModal } from '@/components/admin/ContentModal';

describe('admin UI primitives', () => {
  it('renders a consistent page heading and action', () => {
    const onAction = vi.fn();
    render(<AdminPageHeader title="Berita" description="Kelola artikel." onAction={onAction} />);
    expect(screen.getByRole('heading', { name: 'Berita' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tambah baru' }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('announces loading table states', () => {
    render(<table><tbody><AdminTableState colSpan={3} loading>Memuat data…</AdminTableState></tbody></table>);
    expect(screen.getByText('Memuat data…')).toBeInTheDocument();
  });

  it('closes a modal with Escape and restores focus', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return <><button onClick={() => setOpen(true)}>Buka editor</button>{open && <ContentModal title="Edit berita" onClose={() => setOpen(false)} onSubmit={async () => undefined}><label>Judul<input name="title" /></label></ContentModal>}</>;
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Buka editor' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Edit berita' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
