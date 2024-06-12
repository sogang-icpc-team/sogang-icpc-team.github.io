import styled from "styled-components";

const _SectionTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={className}>{children}</div>;
};
const SectionTitle = styled(_SectionTitle)`
  margin-bottom: 16px;

  font-size: 1.4rem !important;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary};
`;

const _SectionBody = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={className}>{children}</div>;
};
const SectionBody = styled(_SectionBody)`
  line-height: 1.4;
`;

const _Section = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={className}>{children}</div>;
};
export const Section = styled(_Section)`
  padding: 32px 0;
` as unknown as typeof _Section & {
  Title: typeof SectionTitle;
  Body: typeof SectionBody;
};
Section.Title = SectionTitle;
Section.Body = SectionBody;
