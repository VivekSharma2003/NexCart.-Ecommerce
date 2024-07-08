import { Facebook, Instagram, MailOutline, Phone, Pinterest, Room, Twitter } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  ${mobile({ flexDirection: "column" })};
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.h1`
  font-weight: bold;
`;

const Desc = styled.p`
    margin: 20px 0px;

`;

const SocialContainer = styled.div`
    display: flex;

`;

const SocialIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    background-color: #${props=> props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    cursor: pointer;
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
  ${mobile({ display: "none" })};
`;

const Title = styled.h3`
    margin-bottom: 30px;
    
`

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
`;

const ListItem = styled.li`
    width: 50%;
    margin-bottom: 10px;
    cursor: pointer;
`;

const Right = styled.div`
    flex: 1;
    padding: 20px;
    ${mobile({ backgroundColor: "#fcf5f5" })};
`;

const ContactItem = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

const Payment = styled.img`
    width: 50%;
    margin-bottom: 20px;
`;

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <Left>
        <Logo>NexCart.</Logo>
        <Desc>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don't look even slightly believable.
        </Desc>
        <SocialContainer>
          <SocialIcon color="3B5999" onClick={() => handleNavigation("/")}>
            <Facebook />
          </SocialIcon>
          <SocialIcon color="E4405F" onClick={() => handleNavigation("/")}>
            <Instagram />
          </SocialIcon>
          <SocialIcon color="55ACEE" onClick={() => handleNavigation("/")}>
            <Twitter />
          </SocialIcon>
          <SocialIcon color="E60023" onClick={() => handleNavigation("/")}>
            <Pinterest />
          </SocialIcon>
        </SocialContainer>
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
          <ListItem onClick={() => handleNavigation("/")}>Home</ListItem>
          <ListItem onClick={() => handleNavigation("/cart")}>Cart</ListItem>
          <ListItem onClick={() => handleNavigation("/products")}>Man Fashion</ListItem>
          <ListItem onClick={() => handleNavigation("/products")}>Woman Fashion</ListItem>
          <ListItem onClick={() => handleNavigation("/products")}>Accessories</ListItem>
          <ListItem onClick={() => handleNavigation("/cart")}>My Account</ListItem>
          <ListItem onClick={() => handleNavigation("/cart")}>Order Tracking</ListItem>
          <ListItem onClick={() => handleNavigation("/cart")}>Wishlist</ListItem>
          <ListItem onClick={() => handleNavigation("/")}>Privacy</ListItem>
          <ListItem onClick={() => handleNavigation("/")}>Terms</ListItem>
        </List>
      </Center>
      <Right>
        <Title>Contact</Title>
        <ContactItem>
          <Room style={{ marginRight: "10px" }} /> NexCart. office, South Block,
          New Delhi- 110011
        </ContactItem>
        <ContactItem>
          <Phone style={{ marginRight: "10px" }} /> 011-23386447
        </ContactItem>
        <ContactItem>
          <MailOutline style={{ marginRight: "10px" }} />{" "}
          viveksh1952003@gmail.com
        </ContactItem>
        <Payment src="https://i.ibb.co/Qfvn4z6/payment.png" />
      </Right>
    </Container>
  );
};

export default Footer;
