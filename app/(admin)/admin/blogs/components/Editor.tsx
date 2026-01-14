"use client";

import { useEffect, useRef } from "react";
import styles from "./Editor.module.css";

type EditorProps = {
  onChange: (data: any) => void;
  initialData?: any;
};

export default function Editor({ onChange, initialData }: EditorProps) {
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let editor: any;

    const initEditor = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Code = (await import("@editorjs/code")).default;
      const ImageTool = (await import("@editorjs/image")).default;

      if (!holderRef.current) return;

      editor = new EditorJS({
        holder: holderRef.current,
        autofocus: true,
        placeholder: "Start writing your blog...",
        data: initialData,
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Author",
            },
          },
          code: Code,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  // demo upload (replace with API later)
                  const url = URL.createObjectURL(file);
                  return {
                    success: 1,
                    file: { url },
                  };
                },
              },
            },
          },
        },
        onChange: async () => {
          const content = await editor.save();
          onChange(content);
        },
      });

      editorRef.current = editor;
    };

    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData, onChange]);

  return (
    <div className={styles.editorWrapper}>
      <div ref={holderRef} />
    </div>
  );
}
