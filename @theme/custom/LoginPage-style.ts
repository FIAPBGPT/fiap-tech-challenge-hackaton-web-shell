import styled from 'styled-components';
import { themed } from '@/@theme/themed';


export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.themeColor.backgroundBase};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;


export const LoginContainer = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const LoginContainerContent = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  border: 2px solid #fff; 
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const Logo = styled.img`
  height: 40px;
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;


export const LeftText = styled.div`
  flex: 1;
  font-family: ${themed.themeFonts.text.fontFamily};
  font-size: ${themed.themeFonts.text.fontSize};
  color: ${themed.themeColor.primary};
  font-weight: ${themed.themeFonts.text.fontWeight};

  @media (max-width: 768px) {
    text-align: center;
  }`
;

export const TitleForm = styled.div`
  flex: 1;
  font-family: ${themed.themeFonts.text.fontFamily};
  font-size: ${themed.themeFonts.text.fontSize};
  color: ${themed.themeColor.mustard};  
  font-weight: ${themed.themeFonts.text.fontWeight};

  @media (max-width: 768px) {
    text-align: center;
  }`
;

export const FormContainer = styled.div`
  flex: 1;
`;
