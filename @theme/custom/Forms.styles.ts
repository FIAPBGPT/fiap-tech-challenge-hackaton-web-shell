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

  .form-container-complete {
    flex: 1;
    flex-direction: column;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    /* border: 1px solid red; */

    width: 100vw;
    height: 100vh;
  }

  #div-logo-input-button {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-top: 60px;
    position: relative;
  }

  #div-logotipo {
    height: 100px;
    width: 150px;
    background-image: url('/image/Logotipo.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top: -90px;
    right: 10px;
  }

  .div-input-senha {
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 15vh;
    background-color: #ffffff80;
    border-radius: 8px;
    border: 1px solid #ffffff;
    justify-content: center;
    align-items: center;
    padding: 20px;

    div {
      display: flex;
      align-items: center;
      flex: 0 0 0;
      margin-bottom: 20px;
    }

    div input {
      max-width: 350px;
    }

    .div-buttons {
      margin: 0;
    }
  }
  .div-buttons {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    gap: 15px;
  }

  button {
    min-width: 100px;
    padding: 10px 16px;
    width: 100%;
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

  #containers-legend {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
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
  @media (min-width: 721px) {
    .div-buttons {
      max-width: 200px;
      flex-wrap: nowrap;
    }
  }
`
