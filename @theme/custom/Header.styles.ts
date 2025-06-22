import styled from "styled-components";

export const Container = styled.div`
width:100%;
height: 150px;
background-color: ${({ theme }) => theme.themeColor.primary};
padding: 40px 25px 0 25px;
display: flex;
justify-content: center;
align-items: center;

.flexRowCenterCenter{
    display: flex;
justify-content: center;
align-items: center;
}

.flexColumnCenterCenter{
    display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
}

h2{
    font-family: ${({ theme }) => theme.themeFonts.subTitleHeader.fontFamily};
    font-size: ${({ theme }) => theme.themeFonts.subTitleHeader.fontSize};
    font-weight: ${({ theme }) => theme.themeFonts.subTitleHeader.fontWeight};
        color: ${({ theme }) => theme.themeColor.backgroundLightBase};
}

#main-container{
    height: 100%;
    width: 100%;
    max-width: 1024px;
    padding: 10px 10px;
    background-color: ${({ theme }) => theme.themeColor.primary};
    border-top: 1px solid ${({ theme }) => theme.themeColor.backgroundLightBase};
    border-right: 1px solid ${({ theme }) => theme.themeColor.backgroundLightBase};
    border-left: 1px solid ${({ theme }) => theme.themeColor.backgroundLightBase};
    text-align: center;
}
#section-name{
    width: 100%;
    background-color: ${({ theme }) => theme.themeColor.primary};
    color: ${({ theme }) => theme.themeColor.backgroundLightBase};
    text-align: center;
    font-family: ${({ theme }) => theme.themeFonts.titleHeader.fontFamily};
    font-size: ${({ theme }) => theme.themeFonts.titleHeader.fontSize};
    font-weight: ${({ theme }) => theme.themeFonts.titleHeader.fontWeight};
}

  @media (min-width: 361px) and (max-width: 720px) {

    #main-container{
    height: 100%;
    width: 100%;
    max-width: 1024px;
}

  }
`;

