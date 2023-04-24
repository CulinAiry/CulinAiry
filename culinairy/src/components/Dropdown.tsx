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
        <span id="label">{label}</span>
        <select
          value={value}
          onChange={onChange}
          className="box-border h-10 rounded-md text-gray-600 border-none pl-4 pr-9 py-[0.375rem]">
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
