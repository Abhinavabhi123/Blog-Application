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
};

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
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
