import { SelectStyles } from "@/@theme/custom/Select.styles";
import { useState } from "react";

type SelectProps = {
  id: string;
  value: string;
  label: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  width?: string | number;
};

export default function SelectComponent({
  id,
  value,
  label,
  options = [] as string[],
  onChange,
  placeholder = "Selecione uma opção",
  required = false,
  className = "",
  width = "100%",
}: SelectProps) {
  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
        </label>
      )}
      <SelectStyles
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="select-input"
        style={{ width }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </SelectStyles>
    </div>
  );
}
