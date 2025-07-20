import styled from 'styled-components'
import { themed } from '@/@theme/themed'

export const FooterContainer = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${themed.themeColor.primary};
  padding: 16px 24px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`

export const FooterInsideContainer = styled.footer`
  width: 100%;
  background-color: ${themed.themeColor.primary};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1024px;

  @media (min-width: 1024px) {
    margin-left: 210px;
  }

  @media (max-width: 719px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`

export const ContactContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-items: center;
  

  @media (max-width: 719px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }`


export const ContactText = styled.div`
  font-size: ${themed.themeFonts.text};
  font-weight: 600;
  margin-bottom: 8px;
  color: ${themed.themeColor.white};
  width: 60%;


  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`

export const IconsContainer = styled.div`
  display: flex;
  gap: 12px;
`

export const IconLink = styled.a`
  color: ${themed.themeColor.white};
  font-size: 20px;
  transition: color 0.2s;
`
