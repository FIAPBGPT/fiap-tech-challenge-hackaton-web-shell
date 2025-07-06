import { InputProps } from '@/@core/props/input';
import { InputStyle } from '@/@theme/custom/input.style';
import React from 'react';

const InputComponent: React.FC<InputProps> = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  style = {}
}) => {
  return (
    <InputStyle
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
      style={style}
    />
  );
};

export default InputComponent;
