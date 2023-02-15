import styled from "styled-components"

export const StyledTitle = styled.h1`
  ${({ theme }) => theme.fonts.size['3xl']};
  display: flex;
  align-items: center;
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.dark['200']}`};
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;

  > div {
    cursor: pointer;
    margin-right: 1rem;

    path {
      stroke: ${({ theme }) => theme.colors.dark[500]};
      transition: ${({ theme }) => theme.transitions.ease};
    }

    &:hover path {
      stroke: ${({ theme }) => theme.colors.blue[400]};
    }
  }
`

interface TitleProps {
  children: React.ReactNode
}

export default function Title({ children }: TitleProps) {
  return (
    <StyledTitle>{children}</StyledTitle>
  )
}