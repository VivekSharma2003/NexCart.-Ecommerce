import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/apiCalls";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userRedux";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url("https://img.freepik.com/premium-vector/international-trade-via-transfer-trending-concept-flat-illustration_720185-2003.jpg?w=740")
      center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  ${mobile({ width: "75%" })};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0 0;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #033b3b;
  }
`;

const Error = styled.span`
  color: red;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
  color: #555;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const res = await register(dispatch, { username, email, password, isAdmin });
      if (res) {
        dispatch(logout());
        navigate("/login");
      }
    } else {
      alert("Passwords don't match!");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input placeholder="First name" onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder="Last name" onChange={(e) => setLastName(e.target.value)} />
          <Input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <Input placeholder="confirm password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
          <CheckboxLabel>
            <Checkbox type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            Register as a seller?
          </CheckboxLabel>
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button onClick={handleClick}>CREATE</Button>
          {error && <Error>Something went wrong...</Error>}
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
