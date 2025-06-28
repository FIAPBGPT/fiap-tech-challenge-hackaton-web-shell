import { StyledButton } from '@/@theme/custom/Button.style';
import React from 'react';
import Button from 'react-bootstrap/Button';

type ButtonComponentProps = {
  variant?: any;
  label: string;
  onClick: () => void;
  [key: string]: any;
};

const Btn = Button as unknown as React.ComponentType<any>;

const ButtonComponent: React.FC<ButtonComponentProps> = ({ variant = 'primary', label, onClick, ...props }) => {
  return (
    <StyledButton variant={variant} onClick={onClick} {...props}>
      {label}
    </StyledButton>
  );
};

export default ButtonComponent;