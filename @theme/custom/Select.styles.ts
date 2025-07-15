import styled from "styled-components";

export const SelectStyles = styled.select`
  width: 100%;
  height: 35px;
  background-color: ${(props) => props.theme.themeColor.white};
  padding: 8px !important;
  border-radius: 4px;
  border: none;
  outline: none;
  margin: 5px 0;
  box-shadow: 1px 1px 2px 1px ${(props) => props.theme.themeColor.shadowInputSelects};

  /* Para Firefox */
  select::-moz-focus-inner {
    border: 0;
  }

  /* Para Edge/IE */
  select::-ms-expand {
    display: none;
  }

  option {
    color: ${(props) => props.theme.themeColor.disabled};
    font-size: 14px;
    font-weight: 400;
    background-color: ${(props) => props.theme.themeColor.white};
  }
  ::placeholder {
  color: ${(props) => props.theme.themeColor.disabledGrey} !important;
  opacity: 1; /* Garante opacidade total no Firefox */
}

::-webkit-input-placeholder {
  color: ${(props) => props.theme.themeColor.disabledGrey} !important;
}

::-moz-placeholder {
  color: ${(props) => props.theme.themeColor.disabledGrey} !important;
  opacity: 1;
}

:-ms-input-placeholder {
  color: ${(props) => props.theme.themeColor.disabledGrey} !important;
}

  &:invalid {
    color: ${(props) => props.theme.themeColor.disabled};
  }

  &:valid {
    color: ${(props) => props.theme.themeColor.mediumGreen};
    font-weight: 900;
    
  }

  &:focus {
    color: ${(props) => props.theme.themeColor.mediumGreen};
    border: 2px solid ${(props) => props.theme?.themeColor?.secondary};
    background-color: ${(props) => props.theme.themeColor.white};
    box-shadow: 1px 1px 3px ${(props) => props.theme.themeColor.tableGreen};

  }
`;
