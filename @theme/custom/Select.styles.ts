import styled from "styled-components";

export const SelectStyles = styled.select`
  height: 35px;
  background-color: ${(props) => props.theme.themeColor.white};
  padding: 8px;
  border-radius: 4px;
  margin: 0 10px;

  option {
    color: ${(props) => props.theme.themeColor.disabled};
    font-size: 14px;
    font-weight: 400;
    background-color: ${(props) => props.theme.themeColor.white};
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
