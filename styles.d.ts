import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      background: string;
      text: string;
      primary: string;
    };
    spacing: {
      sm: string;
      md: string;
      lg: string;
    };
    fontSizes: {
      xm: string;
      sm: string;
      md: string;
      lg: string;
    };
    fontWeights: {
      normal: string;
      bold: string;
    };
  }
}
