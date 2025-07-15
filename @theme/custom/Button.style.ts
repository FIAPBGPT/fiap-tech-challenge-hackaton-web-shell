import styled from "styled-components";

import { themed } from "@/@theme/themed";
const variantColorMap = themed.themeColor;

export const StyledButton = styled.button<{
  variant?: keyof typeof themed.themeColor;
  textColor?: keyof typeof themed.themeColor;
}>`
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  width: 100%;
  height: 40px;
  box-shadow: 1px 1px 2px ${themed.themeColor.shadowButton};

  background-color: ${({ variant }) =>
    variantColorMap[variant || "primary"] || variantColorMap.primary};

  color: ${({ variant, textColor }) => {
    if (textColor) {
      return variantColorMap[textColor] || themed.themeColor.white;
    }
    const bg = variantColorMap[variant || "primary"];
    if (
      variant === "white" ||
      variant === "lightGrey" ||
      bg === "#FFFFFF" ||
      bg === "#DEE2E6" ||
      bg === "#fff700"
    ) {
      return themed.themeColor.dark;
    }
    return themed.themeColor.white;
  }};

  font-family: ${themed.themeFonts.btn.fontFamily};
  font-size: ${themed.themeFonts.btn.fontSize};
  font-weight: ${themed.themeFonts.btn.fontWeight};
  line-height: ${themed.themeFonts.btn.lineHeight};

  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    text-decoration: underline;
  }

  &:disabled {
    background-color: ${themed.themeColor.disabledGrey};
    color: ${themed.themeColor.disabled};
    cursor: not-allowed;
  }
`;
