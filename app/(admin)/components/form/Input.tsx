"use client";

import styles from "./form.module.css";

type InputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: InputProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && <span>*</span>}
      </label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
