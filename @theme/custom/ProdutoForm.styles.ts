import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px black solid;

  form {
    width: 100%;
    max-width: 500px; /* Adiciona uma largura máxima para não ficar muito largo */
    display: flex;
    justify-content: center;
    border: 1px blue solid;
  }

  fieldset {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 15px; /* Adiciona espaçamento entre os elementos */
    padding: 20px;
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

 

  button {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    margin-top: 10px;
  }


`;