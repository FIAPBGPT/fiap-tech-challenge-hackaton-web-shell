import styled from "styled-components";

export const InputStyles = styled.input`
  width: 100%;
  height: 35px;
  background-color: ${(props) => props.theme.themeColor.white};
  padding: 8px;
  border-radius: 4px;
  margin: 0 10px;
  border: none;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  margin: 10px 0;

  label {
    font-size: 16px;
    color: ${(props) => props.theme.themeColor.ochreFontsButton};
  }

  option {
    color: ${(props) => props.theme.themeColor.disabled};
    font-size: 14px;
    font-weight: 400;
    background-color: ${(props) => props.theme.themeColor.white};
  }

  &:focus {
    color: ${(props) => props.theme.themeColor.mediumGreen};
    border: 2px solid ${(props) => props.theme?.themeColor?.secondary};
    background-color: ${(props) => props.theme.themeColor.white};
    box-shadow: 1px 1px 3px ${(props) => props.theme.themeColor.tableGreen};
  }
`;
