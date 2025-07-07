// import styled from "styled-components";

// export const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   height: 100vh;
//   background-color: ${({ theme }) => theme.themeColor.backgroundBase};
//   * {
//     padding: 0;
//     margin: 0;
//     box-sizing: border-box;
//   }

//   main {
//     display: flex;
//     flex: 1;
//     justify-content: center;
//     align-items: flex-start;
//     padding: 0 25px 25px 25px;
//     width: 100%;
//     height: 100vh;
//   }

//   #menu-main-container {
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
//     width: 100%;
//     height: 100%;
//   }

//   #main-container {
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
//     flex: 1;
//     padding: 0 20px 20px 20px;
//     width: 100%;
//     height: 100vh;
//     max-width: 1024px;
//     border-left: 1px solid
//       ${({ theme }) => theme.themeColor.backgroundLightBase};
//     border-right: 1px solid
//       ${({ theme }) => theme.themeColor.backgroundLightBase};
//     border-bottom: 1px solid ${({ theme }) => theme.themeColor.secondary};
//   }
//   @media (max-width: 720px) {
//     main {
//       padding: 0 20px 20px 20px;
//     }
//     #main-container {
//       padding: 0 15px 15px 15px;
//     }
//   }
// `;
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
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
    position: fixed;
    top: 150px;
    left: 0;
    width: 100%;

    main {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: flex-start;
      padding: 25px;
      width: 100%;
      height: 100vh;
      overflow: auto;
      margin: 0 auto;
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

  #main-container {
    flex: 1;
    justify-content: center;
    padding: 20px;
    width: 100%;
    max-width: 1024px;
    height: 100%;
    border-left: 1px solid
      ${(props) => props.theme.themeColor.backgroundLightBase};
    border-right: 1px solid
      ${(props) => props.theme.themeColor.backgroundLightBase};
    border-bottom: 1px solid
      ${(props) => props.theme.themeColor.backgroundLightBase};
  }
`;
