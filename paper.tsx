import * as React from "react";
import { FC } from "react";
import { styled } from "@mui/material/styles";

const Item = styled("div")`
  justify-self: center;
  width: 174px;
  margin-bottom: 30px;
`;
const Paper = styled(Link)`
  display: flex;
  background: #ebebeb;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 0 15px;
  color: #000;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 40%);
  text-decoration: none;
  transition: all 0.3s ease;
  :hover {
    background: #f5af27;
    :before {
      border: 24px solid #000;
      border-top-color: white;
      border-right-color: white;
    }
  }
  :before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: -1px;
    border: 24px solid #f3af29;
    border-top-color: white;
    border-right-color: white;
    transition: all 0.3s ease;
  }
`;
const Text = styled("span")`
  width: 100%;
  text-align: center;
  display: block;
`;
const AuthorLink = styled(Link)`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: start;
  text-decoration: none;
  span {
    width: 50px;
  }
`;
const Name = styled("span")`
  display: block;
  margin: 0 0 0 10px;
  color: #000;
`;
export const WhitePapersItem: FC<{ item: TypeAllBsWhitePaper }> = ({
  item,
}) => {
  const {
    node: {
      whitePaperDetails: { authorSpeaker, pdf },
    },
  } = item;
  return (
    <Item>
      <WhitePaper to={pdf.mediaItemUrl}>
        <Text>
          <strong>{pdf.title}</strong>
        </Text>
      </WhitePaper>
      <AuthorLink to={authorSpeaker.length !== 0 && authorSpeaker[0].uri}>
        <span>
          {authorSpeaker.length !== 0 && (
            <Img
              fluid={fluid }
              imgStyle={{
                objectFit: "cover",
              }}
              style={{
                width: "100%",
              }}
              className={"ImgSlide"}
            />
          )}
        </span>
        <Name>
          {authorSpeaker.length !== 0 ? authorSpeaker[0].title : "null"}
        </Name>
      </AuthorLink>
    </Item>
  );
};
