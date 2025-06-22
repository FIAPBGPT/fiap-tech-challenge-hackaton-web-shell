import React from 'react';
import Button from 'react-bootstrap/Button';

type ButtonComponentProps = {
  variant?: string;
  label: string;
  onClick: () => void;
  [key: string]: any; // Para aceitar props adicionais
};

const variantMap: Record<string, string> = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  light: 'light',
  dark: 'dark',
  // Adicione mais variants customizados se necessário
};

const Btn = Button as unknown as React.ComponentType<any>;

const ButtonComponent: React.FC<ButtonComponentProps> = ({ variant = 'primary', label, onClick, ...props }) => {
  return (
    <Btn variant={variantMap[variant] || 'primary'} onClick={onClick} {...props}>
      {label}
    </Btn>
  );
};

export default ButtonComponent;