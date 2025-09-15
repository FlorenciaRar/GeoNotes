import styled from "styled-components/native";
import { theme } from "./theme";

type TitleProps = {
  size?: keyof typeof theme.fontSizes;
};

export const Title = styled.Text<TitleProps>`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ size = "md", theme }) => theme.fontSizes[size]};
  line-height: ${({ size = "md", theme }) =>
    parseInt(theme.fontSizes[size]) + 4}px;
`;

export const Subtitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const BodyText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ size = "md", theme }) => theme.fontSizes[size]};
  line-height: ${({ size = "md", theme }) =>
    parseInt(theme.fontSizes[size]) + 4}px;
`;
