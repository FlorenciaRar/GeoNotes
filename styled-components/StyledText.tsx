import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

type TextProps = {
  variant?: keyof DefaultTheme["fontWeights"]; // usa el theme actual
  size?: keyof DefaultTheme["fontSizes"];
  color?: keyof DefaultTheme["colors"];
};

export const StyledText = styled.Text<TextProps>`
  font-weight: ${({ variant = "normal", theme }) => theme.fontWeights[variant]};
  font-size: ${({ size = "md", theme }) => theme.fontSizes[size]}px;
  line-height: ${({ size = "md", theme }) => theme.fontSizes[size] + 4}px;
  color: ${({ color = "onBackground", theme }) => theme.colors[color]};
`;
