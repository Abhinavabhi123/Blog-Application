import styles from "./Select.module.css";
type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
};

export default function Select({ value, onChange, options }: SelectProps) {
  return (
    <select className={styles.select} value={value} onChange={onChange}>
      <option value="">Select</option>
      {options &&
        options.length > 0 &&
        options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
    </select>
  );
}
