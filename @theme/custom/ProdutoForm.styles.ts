import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  form {
    width: 100%;
    max-width: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  fieldset {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 15px;
  }

  legend {
    font-size: ${(props) => props.theme.themeFonts.subTitleHeader};
    color: ${(props) => props.theme.themeColor.ochreFontsButton};
    text-align: center;
    margin-top: 25px;
  }

  #containers-legend {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  #div-buttons {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  button {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    margin-top: 10px;
    height: 40px;
    font-size: 16px;
    color: ${(props) => props.theme.themeColor.white};
    border-radius: 4px;

    &:hover, &.active {
      font-weight: bold;
      text-decoration: underline;
    }
  }

  #btn-cadastrar {
    background-color: ${(props) => props.theme.themeColor.secondary};
  
  }
  #btn-cancelar{
    background-color: ${(props) => props.theme.themeColor.buttonGrey};
  }
`;
