import styled from "styled-components";
import Link, { LinkProps } from "next/link";

export const Container = styled.div`
  width: 200px;
  flex: 0 0 200px;
  height: 100vh;
  background-color: ${({ theme }) => theme.themeColor.backgroundLightBase};
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px green solid; */

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
    background-color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    color: ${({ theme }) => theme.themeColor.ochreFontsButton};
  }
  .menu-navigation-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 50px;
  }

  #menu-navigation a {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 5px 10px;
    color: ${({ theme }) => theme.themeColor.ochreFontsButton};

    &:hover {
      background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
    }

    &.isActive {
      background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;

      svg {
        fill: ${({ theme }) => theme.themeColor.secondary};
      }
    }
  }

  .menu-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 5px 10px;
    color: ${({ theme }) => theme.themeColor.ochreFontsButton};

    &:hover {
      background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
    }

    &.isActive {
      background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
    }
    &.isActive svg{
        fill: ${({ theme }) => theme.themeColor.secondary};
      }
  }

  #menu-navigation svg,
  .menu-button svg {
    margin: 0px;
    padding: 0px;
    width: 16px;
    height: 18px;
    fill: ${({ theme }) => theme.themeColor.ochreFontsButton};
  }

  #menu-links-cadastro {
    display: none;
    flex-direction: column;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    border-top: 1px solid ${({ theme }) => theme.themeColor.ochreFontsButton};
    border-bottom: 1px solid ${({ theme }) => theme.themeColor.ochreFontsButton};

    &.show {
      display: flex;
    }
  }

  #menu-links-cadastro a {
    background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
    padding: 5px 35px;
    color: ${({ theme }) => theme.themeColor.ochreFontsButton};

    &:hover {
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
      text-decoration: underline;
    }
    &.isActive {
      color: ${({ theme }) => theme.themeColor.secondary};
      font-weight: 700;
      text-decoration: underline;
    }
  }
`;

export const LinkIsActive = styled(Link)`
  background-color: ${({ theme }) => theme.themeColor.backgroundMediumBase};
  color: ${({ theme }) => theme.themeColor.secondary};
  font-weight: 700;
  text-decoration: underline;
`;
