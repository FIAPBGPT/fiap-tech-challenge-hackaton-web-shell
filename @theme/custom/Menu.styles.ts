import styled from "styled-components";

export const Container = styled.div`
  width: 200px;
  height: 100vh;
  background-color: ${({ theme }) => theme.themeColor.backgroundLightBase};
  display: flex;
  flex-direction: column;
  align-items: center;

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #menu-header {
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid
      ${({ theme }) => theme.themeColor.backgroundLightBase};
    background-color: ${({ theme }) => theme.themeColor.secondary};
  }
  #menu-data-user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    font-weight: 900;
    color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    background-color: ${({ theme }) => theme.themeColor.secondary};
    padding: 0px;
  }

  #menu-data-user p {
    font-size: 14px;
    font-weight: 400;
  }

  #menu-user-icon {
    width: 35px;
    height: 35px;
  }
  #menu-user-icon svg {
    color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    width: 100%;
    height: 100%;
  }

  #menu-navigation {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 40px;
    background-color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    color: ${({ theme }) => theme.themeColor.ochreFontsButton};
    border-bottom: 1px solid ${({ theme }) => theme.themeColor.ochreFontsButton};
    padding: 0px;
  }
  .menu-navigation-item {
    width: 100%;
    height: 100px;
  }
  #menu-navigation a {
    background-color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    padding: 5px 10px;
    background-color: transparent;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    gap: 8px;
    width: 100%;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.themeColor.ochreFontsButton};

    &:hover {
      background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
      text-decoration: unde line;
    }
  }

  #menu-navigation svg {
    margin: 0px;
    padding: 0px;
    width: 16px;
    height: 18px;
    fill: ${({ theme }) => theme.themeColor.ochreFontsButton};
  }

  #menu-links-cadastro {
    display: flex;
    flex-direction: column;
    width: 100%;
    cursor: pointer;
  }

  #menu-links-cadastro a {
    background-color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    padding: 5px 25px;
    &:hover {
      background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
      text-decoration: underline;
    }
  }
`;
