import { Link as RRDLink } from "react-router-dom";
import styled from "styled-components";

export const EmptyLink = styled(RRDLink)`
  color: ${({ theme }) => theme.color.black};
  text-decoration: none;
`;
