import styled from 'styled-components'

export const InputStyles = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35px;
  background-color: ${(props) => props.theme.themeColor.white};
  padding: 8px !important;
  border-radius: 4px;
  box-shadow: 1px 1px 2px 1px
    ${(props) => props.theme.themeColor.shadowInputSelects};
  border: none;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  margin: 5px 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Para Firefox */
  input::-moz-focus-inner {
    border: 0;
  }

  /* Para Edge/IE */
  input::-ms-expand {
    display: none;
  }

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
`
