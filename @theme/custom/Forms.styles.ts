import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  /* border: 1px solid black; */

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  form,
  fieldset,
  .form-container {
    width: 100%;
    height: 100%;
    flex: 1;
    flex-direction: column;
    max-width: 700px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: 'transparent';
    gap: 20px;
    /* border: 1px solid red; */
  }

  .container-80porCento{
    display: flex;
    max-width: 80%;
  }

  button {
    padding: 10px 16px;
    max-width: 200px;
    margin-bottom: 40px;
  }

  p {
    width: 100%;
    text-align: left;
    font-size: ${(props) => props.theme.themeFonts.text.fontSize};
    color: ${(props) => props.theme.themeColor.ochreFontsButton};
    font-weight: ${(props) => props.theme.themeFonts.text.fontWeight};
  }

  .title-form {
    font-size: ${(props) => props.theme.themeFonts.titleForms.fontSize};
    color: ${(props) => props.theme.themeColor.primary};
    font-weight: ${(props) => props.theme.themeFonts.titleForms.fontWeight};
    text-align: center;
  }
  .subtitle-form {
    width: 100%;
    font-size: ${(props) => props.theme.themeFonts.subtitleForms.fontSize};
    color: ${(props) => props.theme.themeColor.ochreFontsButton};
    font-weight: ${(props) => props.theme.themeFonts.subtitleForms.fontWeight};
    text-align: center;
    border-top: 1px solid white;
    padding-top: 20px;
    margin-top: 30px;
  }

  /* legend {
    font-size: ${(props) => props.theme.themeFonts.subTitleHeader};
    color: ${(props) => props.theme.themeColor.ochreFontsButton};
    text-align: center;
    margin-top: 25px;
    border: 1px solid red;
  } */

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

  #text-destaque {
    display: flex;
    justify-content: center;
    padding: 10px;
    border-radius: 4px;
    width: 100%;
    background-color: ${(props) => props.theme.themeColor.ochreFontsButton};
    color: ${(props) => props.theme.themeColor.white};
    font-weight: bold;
  }
`
