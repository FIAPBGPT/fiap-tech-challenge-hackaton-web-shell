import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.themeColor.backgroundBase};
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  main {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: flex-start;
    padding: 0 25px 25px 25px;
    width: 100%;
    height: 100vh;
  }

  #menu-main-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  #main-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    padding: 0 20px 20px 20px;
    width: 100%;
    height: 100vh;
    max-width: 1024px;
    border-left: 1px solid
      ${({ theme }) => theme.themeColor.backgroundLightBase};
    border-right: 1px solid
      ${({ theme }) => theme.themeColor.backgroundLightBase};
    border-bottom: 1px solid ${({ theme }) => theme.themeColor.secondary};
  }
  @media (max-width: 720px) {
    main {
      padding: 0 20px 20px 20px;
    }
    #main-container {
      padding: 0 15px 15px 15px;
    }
  }
`;
