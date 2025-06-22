/* eslint-disable @typescript-eslint/no-explicit-any */

export interface CustomButtonProps {
  /** Icon of Button */
  icon?: ReactElement<SVGElement, string | JSXElementConstructor<any>>;
  /** Label Button: string */
  label?: string;
  size?: "sm" | "lg" | undefined;
  /** If button is disabled: boolean */
  disabled?: boolean;
  rounded?: boolean;
  variant?: string;
  type?: "button" | "submit" | "reset" | undefined;
  /** Optional click handler */
  onClick?: () => void | any;
}
