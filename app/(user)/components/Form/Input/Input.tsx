import styles from "./Input.module.css";

type PropsType = {
  type: string;
  defaultValue?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
};

export default function Input({
  type,
  name,
  placeholder,
  defaultValue,
  onChange,
}: PropsType) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      className={styles.input}
    />
  );
}
