import React from 'react';
import styled from 'styled-components';

const Container = styled.article`
  border: 1px solid black;
  padding: 1rem;
`;
const Title = styled.h3`
  font-weight: bold;
  padding: 0;
  margin: 0;
  margin-bottom: 0.4rem;
`;

const Paragraph = styled.p`
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
`;

const Card = () => (
  <Container>
    <Title>Rørlegger nummer</Title>
    <Paragraph>Rørleggerveien nummer</Paragraph>
    <Paragraph>69 99 00 00</Paragraph>
    <Paragraph>LokasjonNummer@epost.no</Paragraph>
  </Container>
);

export default Card;
