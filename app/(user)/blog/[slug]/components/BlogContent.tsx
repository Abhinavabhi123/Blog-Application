import styles from "../blog.module.css";

type EditorBlock = {
  id: string;
  type: string;
  data: any;
};

export default function BlogContent({ blocks }: { blocks: EditorBlock[] }) {
  return (
    <div className={styles.content}>
      {blocks.map((block) => {
        switch (block.type) {
          case "header":
            return block.data.level === 2 ? (
              <h2 key={block.id}>{block.data.text}</h2>
            ) : (
              <h3 key={block.id}>{block.data.text}</h3>
            );

          case "paragraph":
            return (
              <p
                key={block.id}
                dangerouslySetInnerHTML={{
                  __html: block.data.text,
                }}
              />
            );

          case "list":
            return block.data.style === "ordered" ? (
              <ol key={block.id}>
                {block.data.items.map((item: any, i: number) => (
                  <li key={i}>{item.content}</li>
                ))}
              </ol>
            ) : (
              <ul key={block.id}>
                {block.data.items.map((item: any, i: number) => (
                  <li key={i}>{item.content}</li>
                ))}
              </ul>
            );

          case "code":
            return (
              <pre key={block.id} className={styles.code}>
                <code>{block.data.code}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
