// InputComponent.tsx
import { Container } from "@/@theme/custom/Forms.styles";
import { InputStyles } from "@/@theme/custom/Input.styles";

type InputProps = {
  id: string;
  name: string;
  label?: string;
  step?: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required: boolean;
  min?: number;
};

export default function InputComponent(props: InputProps) {
  return (
    <Container>
      {props.label && (
        <label htmlFor={props.id} className="input-label">
          {props.label}
        </label>
      )}
      <InputStyles
        id={props.id}
        name={props.name}
        step={props.step}
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)} // Passa apenas o valor
        placeholder={props.placeholder || ""}
        required={props.required}
        min={props.min}
        aria-label={props.label || props.placeholder || "Input field"}
      />
    </Container>
  );
}
