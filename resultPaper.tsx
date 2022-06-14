import * as React from "react";
import { FC } from "react";
import { styled } from "@mui/material/styles";

const GridContainer = styled("div")`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
  @media (max-width: 1330px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media (max-width: 1120px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const GridCenter = styled("div")`
  display: flex;
  width: 100%;
  justify-content: center;
`;
export const ResultWhitePapers: FC<{ items: TypeAllBsPaper[] }> = ({
  items,
}) => {
  return (
    <ContainerMain bg="#fff">
      <ContentRes top="50" bottom="0">
        <GridContainer>
          {items.map((item, idx) => (
            <GridCenter key={idx}>
              <PapersItem item={item} />
            </GridCenter>
          ))}
        </GridContainer>
      </ContentRes>
    </ContainerMain>
  );
};
