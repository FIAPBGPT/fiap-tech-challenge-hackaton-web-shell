import { createGlobalStyle } from "styled-components";

const FontStyles = createGlobalStyle`
    @font-face {
        font-family: 'Helvetica';
        src: url('/fonts/Helvetica.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
}
`;

export default FontStyles;
