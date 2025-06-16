"use client";
import { createGlobalStyle, DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    themeColor: {
      backgroundBase: string;
      dark: string;
      white: string;
      success: string;
      secondary: string;
      primary: string;
      error: string;
      lightGrey: string;
      disabledGrey: string;
    };
    themeFonts: {
      helvetica: string;
      btn: {
        fontSize: string;
        fontWeight?: string;
        lineHeight?: string;
        textAlign: string;
      };
    };
  }
}

const GlobalStyles = createGlobalStyle`

  body {
    // background: ${(props) => props.theme.themeColor.backgroundBase};
    // font-family: ${(props) => props.theme.themeFonts.helvetica};
    // color: ${(props) => props.theme.themeColor.dark};
      min-height: calc(100vh - 80px);
      background:  ${(props) => props.theme.themeColor.backgroundBase};
  }

  //** BUTTON GLOBAL STYLES */ 
  .btn {
    font-size: ${(props) => props.theme.themeFonts.btn.fontSize};
    font-weight: ${(props) => props.theme.themeFonts.btn.fontWeight};
    line-height: ${(props) => props.theme.themeFonts.btn.lineHeight}; 
    text-align: ${(props) => props.theme.themeFonts.btn.textAlign};
  }

  .btn:hover {
    background-color: ${(props) => props.theme.themeColor.dark};
    color: ${(props) => props.theme.themeColor.white};
    border: 1px solid ${(props) => props.theme.themeColor.white};      
  }

  .btn-green {
      background-color: ${(props) => props.theme.themeColor.success};
      color: ${(props) => props.theme.themeColor.white};
  }
  

  .btn-green-outline {
      background-color: transparent;
      color: ${(props) => props.theme.themeColor.success};
      border: 1px solid ${(props) => props.theme.themeColor.success};     
  }

  .btn-orange {
      background-color: ${(props) => props.theme.themeColor.secondary};
      color: ${(props) => props.theme.themeColor.white};
    }

  .btn-base {
      background-color: ${(props) => props.theme.themeColor.primary};
      color: ${(props) => props.theme.themeColor.white};
  }

  .btn-dark {
      background-color: ${(props) => props.theme.themeColor.dark};
      color: ${(props) => props.theme.themeColor.white};
  }

  .btn-dark-outline {
      background-color: transparent;
      border: 1px solid ${(props) => props.theme.themeColor.dark};
      color: ${(props) => props.theme.themeColor.dark};
  }

  .w-icon {
    width: 40px;
    height: 40px;
    padding: 0px;
  }

  //** MODAL GLOBAL STYLES */ 
  body > div.fade.delete-modal.modal.show > div > div{
    background: ${(props) => props.theme.themeColor.error};
    color: ${(props) => props.theme.themeColor.white};
  }
  .delete-modal .modal-content {
      background: ${(props) => props.theme.themeColor.error};
      color: ${(props) => props.theme.themeColor.white};
  }
  .modal-header {
    border: none;
      }
  .modal-footer {
    border: none;
   }
   .modal-content .btn-close {
    font-size: 10px;
   }

   body > div.fade.home-modal.modal.show > div {
    transform: none;
    min-height: 100%;
    margin-top: 0;
    margin-bottom: 0;
    width: 100vw;
   }
   body > div.fade.home-modal.modal.show > div > div {
    min-height: 100%;
   }

   // ** DATEPICKER */
   .react-datepicker-wrapper { 
    display: block;
    input {
      width: 100%;
      padding: .375rem .75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      appearance: none;
      background-clip: padding-box;
      border: 1px solid ${(props) => props.theme.themeColor.lightGrey};
      border-radius: 0.375rem;
      transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    input:disabled {
      background-color: ${(props) => props.theme.themeColor.disabledGrey};
    }
   }

  `;

export default GlobalStyles;
