import styled from "styled-components/native";
import { theme } from "../utils/theme";

type TitleProps = {
  variant?: keyof typeof theme.fontWeights;
  color?: keyof typeof theme.colors;
  size?: keyof typeof theme.fontSizes;
};

export const StyledText = styled.Text<TitleProps>`
  font-weight: ${({ variant = "normal", theme }) => theme.fontWeights[variant]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ size = "md", theme }) => theme.fontSizes[size]};
  line-height: ${({ size = "md", theme }) => parseInt(theme.fontSizes[size]) + 4}px;
`;
