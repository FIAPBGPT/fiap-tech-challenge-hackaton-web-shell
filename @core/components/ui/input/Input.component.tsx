import { InputStyles } from "@/@theme/custom/Input.styles";

type InputProps = {
  id: string;
  label?: string;
  step?: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required: boolean;
};
export default function InputComponent(props: InputProps) {
  return (
    <div>
      {props.label && (
        <label htmlFor={props.id} className="select-label">
          {props.label}
        </label>
      )}
      <InputStyles
        id={props.id}
        step={props.step}
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder ? props.placeholder : ""}
        required={props.required}
      />
    </div>
  );
}
