import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";


const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;


const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;

    &:hover ${Info}{
        opacity: 0.8;
    
    }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

const Image = styled.img`
  width: 100%;
  height: 75%;
  object-fit: cover; 
  z-index: 2;
`;

const Price = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    transition: all 0.5s ease;

    &:hover {
        background-color: #e9f5f5;
        transform: scale(1.1);
    }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Product = ({ item }) => {
  return (
    <Container>
      <Circle />
      <Image src={item.img} />
      <Price>Rs. {item.price}</Price>
      <Info>
        <Icon>
        <StyledLink to={`/product/${item._id}`}><ShoppingCartOutlined /></StyledLink>
        </Icon>
        <Icon>
          <StyledLink to={`/product/${item._id}`}><SearchOutlined /></StyledLink>
        </Icon>
        <Icon>
          <FavoriteBorderOutlined />
        </Icon>
      </Info>
    </Container>
  );
};

export default Product;
