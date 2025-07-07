import { SelectStyles } from "@/@theme/custom/Select.styles";

type SelectProps = {
  id: string;
  value: string;
  label?: string;
  options: any[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

export default function SelectComponent(
  props: SelectProps,
  { placeholder = "Selecione uma opção" }: SelectProps
) {
  return (
    <div>
      {props.label && (
        <label htmlFor={props.id} className="select-label">
          {props.label}
        </label>
      )}
      <SelectStyles
        id={props.id}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
      >
        <option value="">{placeholder}</option>
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </SelectStyles>
    </div>
  );
}
