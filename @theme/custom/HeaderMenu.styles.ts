import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  #menu-main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: fixed;
    top: 150px; 
    left: 0;
    width: 100vh;
    height: calc(100vh - 150px); 

    main {
      flex: 1;
      overflow: auto;

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
    padding: 20px;
    width: 100%;
    height: 100%;
  }
`;
