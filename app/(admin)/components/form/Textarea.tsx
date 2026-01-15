"use client";

import styles from "./form.module.css";

type TextareaProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

export function Textarea({ label, value, onChange, rows = 3 }: TextareaProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={onChange}
        rows={rows}
      />
    </div>
  );
}
