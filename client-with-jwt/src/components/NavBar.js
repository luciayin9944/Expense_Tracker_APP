import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles";

function NavBar({ setUser }) {
  const history = useHistory();

  function handleLogoutClick() {
    localStorage.removeItem("token");
    setUser(null);
  }

  function handleMyPageClick() {
    history.push("/");
  }

  return (
    <Wrapper>
      <Logo>
        <Link to="/">Expense Tracker</Link>
      </Logo>
      <Nav>
        {/* <Button as={Link} to="/"> */}
        <Button onClick={handleMyPageClick}>
          Expense Records
        </Button>
        {/* <Button as={Link} to="/new">
          New Expense
        </Button> */}
        <Button as={Link} to="/summary">View Summary</Button>
        <Button variant="outline" onClick={handleLogoutClick}>
          Logout
        </Button>
      </Nav>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px; 16px;
`;

const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 2rem;
  color: deeppink;
  margin: 0;
  padding-left: 16px; /* adds space from left */
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  position: absolute;
  right: 8px;
`;

export default NavBar;
