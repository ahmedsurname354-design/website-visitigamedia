import { useEffect, useId, useRef, useState } from 'react';
import 'summernote/dist/summernote-lite.css';

export function RichTextEditor({ name, initial = '' }: { name: string; initial?: string }) {
  const id = useId();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(initial);
  const [ready, setReady] = useState(false);
  const [editorError, setEditorError] = useState('');
  useEffect(() => {
    let disposed = false;
    let $editor: JQuery<HTMLTextAreaElement> | null = null;
    const initialise = async () => {
      try {
        const editor = editorRef.current;
        if (!editor) return;
        const { default: jquery } = await import('jquery');
        window.jQuery = jquery;
        window.$ = jquery;
        await import('summernote/dist/summernote-lite.js');
        if (disposed) return;
        $editor = jquery(editor);
        if (typeof $editor.summernote !== 'function') throw new Error('Summernote tidak berhasil dimuat.');
        $editor.summernote({ height: 320, placeholder: 'Tulis isi artikel di sini…', toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline', 'clear']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['insert', ['link', 'picture', 'video']], ['view', ['fullscreen', 'codeview']]], callbacks: { onChange: (value: string) => setContent(value) } });
        $editor.summernote('code', initial);
        setReady(true);
      } catch (reason) { if (!disposed) setEditorError(reason instanceof Error ? reason.message : 'Editor tidak dapat dimuat.'); }
    };
    void initialise();
    return () => { disposed = true; if ($editor) $editor.summernote('destroy'); };
  }, [initial]);
  return <div className="sm:col-span-2"><label htmlFor={id} className="text-sm font-medium">Isi artikel</label><input type="hidden" name={name} value={content} /><textarea id={id} ref={editorRef} defaultValue={initial} onChange={(event) => setContent(event.target.value)} className={ready ? '' : 'mt-2 min-h-64 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500'} />{!ready && !editorError && <p className="mt-2 text-xs text-slate-500">Memuat editor…</p>}{editorError && <p role="alert" className="mt-2 text-xs text-amber-700">Editor visual tidak dapat dimuat. Anda tetap dapat menulis isi artikel di kolom ini.</p>}</div>;
}
