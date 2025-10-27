'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface EditorProps {
  defaultValue?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function Editor({
  defaultValue = '',
  onChange,
  placeholder = 'Start writing...',
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  // Initialize Quill once (compatible with React 18 Strict Mode)
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link'],
          ['clean'],
        ],
      },
    });

    quillRef.current = quill;
  }, [placeholder]);

  // Apply default value when it changes and editor is ready
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    if (defaultValue) {
      quill.clipboard.dangerouslyPasteHTML(defaultValue);
    }
  }, [defaultValue]);

  // Subscribe to text-change with a stable handler; attach/detach safely
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const handler = () => {
      const html = quill.root.innerHTML;
      onChange?.(html);
    };

    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [onChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div ref={editorRef} className="min-h-[400px]" />
    </div>
  );
}
