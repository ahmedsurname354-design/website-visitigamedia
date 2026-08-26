import { useEffect, useId, useRef, useState } from 'react';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

export function RichTextEditor({ name, initial = '' }: { name: string; initial?: string }) {
  const id = useId();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(initial);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const $editor = $(editor);
    $editor.summernote({ height: 320, placeholder: 'Tulis isi artikel di sini…', toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline', 'clear']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['insert', ['link', 'picture', 'video']], ['view', ['fullscreen', 'codeview']]], callbacks: { onChange: (value: string) => setContent(value) } });
    $editor.summernote('code', initial);
    return () => { $editor.summernote('destroy'); };
  }, [initial]);
  return <div className="sm:col-span-2"><label htmlFor={id} className="text-sm font-medium">Isi artikel</label><input type="hidden" name={name} value={content} /><textarea id={id} ref={editorRef} defaultValue={initial} /></div>;
}
