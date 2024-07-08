import React, { useState } from "react";
import { Badge } from "@material-ui/core";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../redux/apiCalls";

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })};
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })};
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
  ${mobile({ display: "none" })};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  padding: 5px;
  border-radius: 20px;
  background-color: #f5f5f5;
  ${mobile({ marginLeft: "8px" })};
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: none;
  color: #555555;
  ${mobile({ width: "50px" })};
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-family: "Arial", sans-serif;
  font-weight: 700;
  color: #333333;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #ff6f61;
  }
  ${mobile({ fontSize: "24px", marginLeft: "10px" })};
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })};
`;

const MenuItem = styled.div`
  font-size: ${(props) => (props.admin ? "19px" : "16px")};
  cursor: pointer;
  margin-left: 15px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const SearchIcon = styled(Search)`
  color: gray;
  font-size: 18px !important;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
  
  &:hover {
    transform: scale(1.25);
    color: #544e84;
  }

  &.clicked {
    color: blue;
    transform: scale(1.4);
  }
`;

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(dispatch);
    navigate("/");
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery}`);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon 
              className={isIconClicked ? 'clicked' : ''} 
              onClick={() => {
                handleSearch();
                setIsIconClicked(true);
                setTimeout(() => setIsIconClicked(false), 200);
              }} 
            />
          </SearchContainer>
        </Left>
        <Center>
          <StyledLink to="/">
            <Logo>NexCart</Logo>
          </StyledLink>
        </Center>
        <Right>
          {user ? (
            <>
              {user.isAdmin && (
                <StyledLink to="/admin">
                  <MenuItem>Admin Dashboard</MenuItem>
                </StyledLink>
              )}
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              <StyledLink to="/cart">
                <MenuItem>
                  <Badge badgeContent={quantity} color="primary">
                    <ShoppingCartOutlined />
                  </Badge>
                </MenuItem>
              </StyledLink>
            </>
          ) : (
            <>
              <StyledLink to="/register">
                <MenuItem>Register</MenuItem>
              </StyledLink>
              <StyledLink to="/login">
                <MenuItem>Login</MenuItem>
              </StyledLink>
              <StyledLink to="/cart">
                <MenuItem>
                  <Badge badgeContent={quantity} color="primary">
                    <ShoppingCartOutlined />
                  </Badge>
                </MenuItem>
              </StyledLink>
            </>
          )}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
