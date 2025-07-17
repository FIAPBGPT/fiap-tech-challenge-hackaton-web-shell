import { ButtonComponentProps } from '@/@core/props/button'
import { StyledButton } from '@/@theme/custom/Button.style'
import React from 'react'
/**
 * ButtonComponent is a reusable button component that can be customized with different styles and behaviors.
 * It uses Bootstrap's Button component for styling and functionality.
 *
 * @param {ButtonComponentProps} props - The properties to customize the button.
 * @returns {JSX.Element} The rendered button component.
 */
const ButtonComponent: React.FC<ButtonComponentProps> = ({
  variant = 'secondary',
  label,
  onClick,
  ...props
}) => {
  return (
    <StyledButton variant={variant} onClick={onClick} {...props}>
      {label}
    </StyledButton>
  )
}

export default ButtonComponent
