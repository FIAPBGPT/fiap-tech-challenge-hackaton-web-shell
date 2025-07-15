import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  position: relative;

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #menu-main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    top: 150px;
    left: 0; */
    width: 100%;
    @media (min-width: 721px) {
      overflow: hidden;
    }

    main {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      width: 100%;
      overflow: auto;
      margin: 0 auto;
      @media (max-width: 720px) {
        width: 100%;
      }
    }
    #div-main {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      padding: 25px;
      width: 100%;
      height: 100%;
      overflow: auto;
      margin: 0 auto;
      @media (max-width: 720px) {
        width: 100%;
      }
    }
    #div-main-image {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      padding: 25px;
      width: 100%;
      height: 100%;
      overflow: auto;
      margin: 0 auto;
      background-image: url('/image/Imagem-fundo-group154.png');
      background-size: cover;
      background-position: top;
      background-repeat: no-repeat;
      @media (max-width: 720px) {
        width: 100%;
      }
    }

    /* Overlay/Backdrop para mobile */
    .menu-overlay {
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;

      &.show {
        opacity: 1;
        visibility: visible;
      }

      @media (min-width: 721px) {
        display: none;
      }
    }
  }

  #div-main-container {
    flex: 1;
    justify-content: center;
    padding: 10px;
    min-height: 100vh;
    width: 100%;
    max-width: 1024px;
    border-left: 1px solid
    margin-bottom: 25px;
    border-left: 2px solid
      ${(props) => props.theme.themeColor.backgroundLightBase};
    border-right: 2px solid
      ${(props) => props.theme.themeColor.backgroundLightBase};
    border-bottom: 2px solid
      ${(props) => props.theme.themeColor.backgroundLightBase};
  }
`
