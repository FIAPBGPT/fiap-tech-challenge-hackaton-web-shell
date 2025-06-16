import styled from "styled-components";

export const Title = styled.h1`
  font-family: 'Jura', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #97133E;
  margin-bottom: 1.5rem;
`;

export const Select = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  background-color: #97133E;
  color: white;
  padding: 0.75rem 1rem;
  font-family: 'Jura', sans-serif;
  text-align: center;
  font-weight: 700;
`;

export const CardContent = styled.div`
  padding: 1rem;
  min-height: 300px;
`;