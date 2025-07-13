import { SelectStyles } from "@/@theme/custom/Select.styles";
type SelectProps = {
  id?: string;
  value: string | number;
  label?: string;
  options: any[]; // Array de strings, números, ou objetos
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  ariaLabel?: string;
  valueKey?: string; // Chave para o valor, se for objeto
  labelKey?: string; // Chave para o label, se for objeto
  name?: string;
};
export default function SelectComponent(props: SelectProps) {
  // Função para obter o valor de uma opção
  const getOptionValue = (option: any) => {
    if (props.valueKey && typeof option === "object") {
      return option[props.valueKey];
    }
    return option;
  };
  // Função para obter o label de uma opção
  const getOptionLabel = (option: any) => {
    if (props.labelKey && typeof option === "object") {
      const label = option[props.labelKey];
      if (typeof label === "string" || typeof label === "number") {
        return label;
      }
      return JSON.stringify(label); // Fallback preventivo (evita crash)
    }
    return option;
  };
  return (
    <div style={{width: "100%"}}>
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
        aria-label={props.ariaLabel}
      >
        <option value="">
          {props.placeholder ? props.placeholder : "Selecione"}
        </option>
        {props.options.map((option, index) => (
          <option key={index} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </SelectStyles>
    </div>
  );
}
