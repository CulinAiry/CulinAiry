interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Dropdown({ label, options, value, onChange }: DropdownProps) {
  return (
    <>
      <label>
        {label}:
        <select value={value} onChange={onChange}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
    </>
  );
}
