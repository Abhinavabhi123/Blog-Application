"use client";

import styles from "./form.module.css";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
};

export function Select({
  label,
  value,
  onChange,
  options,
  required,
}: SelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span> *</span>}
      </label>
      <select className={styles.select} value={value} onChange={onChange}>
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
