import Image from "next/image";
import styles from "../blog.module.css";

type EditorBlock = {
  id: string;
  type: string;
  data: any;
};

type BlogContentProps = {
  blocks: EditorBlock[];
  tags?: string[];
};

export default function BlogContent({ blocks, tags }: BlogContentProps) {
  return (
    <>
      {/* 🔖 TAGS */}
      {tags && tags.length > 0 && (
        <div className={styles.tagsWrapper}>
          {console.log(tags, "tags")}
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 📄 CONTENT */}
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

            case "image":
              return (
                <figure key={block.id} className={styles.imageWrapper}>
                  <Image
                    src={block.data.file?.url}
                    alt={block.data.caption || "Blog image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className={styles.image}
                  />
                  {block.data.caption && (
                    <figcaption>{block.data.caption}</figcaption>
                  )}
                </figure>
              );

            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
