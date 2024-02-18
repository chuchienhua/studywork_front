import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./TopBar.css";
function TopBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Tokenbool, setTokenbool] = useState(false);
  const token = useSelector((state) => state.pw);
  const user = useSelector((state) => state.id);
  // 新增一个状态来控制 NavDropdown 是否展开
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  // 切换 NavDropdown 的函数
  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen);
  };

  React.useEffect(() => {
    if (token) {
      setTokenbool(false);
    } else {
      setTokenbool(true);
    }
  }, [token]);

  const LogoutHandle = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    // localStorage.removeItem("user");
    navigate("/loginoracle");
  }, [dispatch, navigate]);

  return (
    <Navbar
      expand="md"
      fixed="top"
      className="Topbar-background"
    >
      <Container fluid>
        <Navbar.Brand>登入系統</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {Tokenbool && (
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link
                onClick={() => {
                  navigate("/loginoracle");
                }}
              >
                讀書紀錄系統
              </Nav.Link>
            </Nav>
          )}
          {!Tokenbool && (
            <Nav
              className=" my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <NavDropdown
                title="個人資訊與選單"
                id="navbarScrollingDropdown"
                show={isNavDropdownOpen} 
                onClick={toggleNavDropdown} 
                style={{ textAlign: "center" }}
              >
                <NavDropdown.Item
                  onClick={() => {
                    navigate("/LoginHome");
                  }}
                >
                  選單頁面
                </NavDropdown.Item>
                <NavDropdown.Item>
                  {user ? `使用者 : ${user}` : "Loading user..."}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={LogoutHandle}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopBar;
