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
  const isReadyRef = useRef(false);
  useEffect(() => {
    if (isReadyRef.current) return;
    isReadyRef.current = true;

    let editor: any;

    const initEditor = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Code = (await import("@editorjs/code")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const Paragraph = (await import("@editorjs/paragraph")).default;

      if (!holderRef.current) return;

      const safeInitialData =
        initialData && Array.isArray(initialData.blocks)
          ? initialData
          : { blocks: [] };

      editor = new EditorJS({
        holder: holderRef.current,
        autofocus: true,
        placeholder: "Start writing your blog...",
        data: safeInitialData,

        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: { class: List as any, inlineToolbar: true },
          quote: {
            class: Quote as any,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Author",
            },
          },
          code: Code as any,
          image: {
            class: ImageTool as any,
            config: {
              uploader: {
                uploadByFile(file) {
                  const formData = new FormData();
                  formData.append("image", file);

                  return fetch("/api/editor/upload-image", {
                    method: "POST",
                    body: formData,
                  })
                    .then((res) => res.json())
                    .then((res) => ({
                      success: res.success,
                      file: {
                        url: res.file.url,
                      },
                    }));
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
      if (editorRef.current) {
        editorRef.current.isReady
          .then(() => {
            editorRef.current?.destroy();
            editorRef.current = null;
            isReadyRef.current = false;
          })
          .catch(() => {});
      }
    };
  }, [initialData, onChange]);

  return (
    <div className={styles.editorWrapper}>
      <div ref={holderRef} />
    </div>
  );
}
