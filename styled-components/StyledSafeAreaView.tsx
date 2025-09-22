import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;
