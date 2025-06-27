import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 150px;
  background-color: ${({ theme }) => theme.themeColor.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  h2 {
    font-family: ${({ theme }) => theme.themeFonts.subTitleHeader.fontFamily};
    font-size: ${({ theme }) => theme.themeFonts.subTitleHeader.fontSize};
    font-weight: ${({ theme }) => theme.themeFonts.subTitleHeader.fontWeight};
    color: ${({ theme }) => theme.themeColor.backgroundLightBase};
  }

  #container-header {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: ${({ theme }) => theme.themeColor.primary};
    padding: 40px 25px 0 250px;
  }

  #main-container-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    max-width: 1024px;
    padding: 10px;
    background-color: ${({ theme }) => theme.themeColor.primary};
    border-top: 1px solid ${({ theme }) => theme.themeColor.backgroundLightBase};
    border-right: 1px solid
      ${({ theme }) => theme.themeColor.backgroundLightBase};
    border-left: 1px solid
      ${({ theme }) => theme.themeColor.backgroundLightBase};
    text-align: center;
  }

  #div-section-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    padding: 10px;
    gap: 0;
  }

  #section-name {
    width: 100%;
    padding: 0px;
    justify-content: center;
    background-color: ${({ theme }) => theme.themeColor.primary};
    color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    font-family: ${({ theme }) => theme.themeFonts.titleHeader.fontFamily};
    font-size: ${({ theme }) => theme.themeFonts.titleHeader.fontSize};
    font-weight: ${({ theme }) => theme.themeFonts.titleHeader.fontWeight};
  }

  #div-icon-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
  }

  #div-icon-header button {
    cursor: pointer;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    svg {
      width: 50px;
      height: 50px;
      color: ${({ theme }) => theme.themeColor.backgroundLightBase};
      transition: fill 0.2s ease;
    }

    &:hover {
      background-color: ${({ theme }) => theme.themeColor.secondary};
      transform: scale(1.05);

      svg {
        color: ${({ theme }) => theme.themeColor.secondary};
      }
    }
  }

  @media (max-width: 720px) {
    #container-header {
      padding: 40px 25px 0 25px;
    }
  }
`;
