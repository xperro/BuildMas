import React from "react";
import type { PropsWithChildren } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "./styles/layout.style.css";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    { path: "/clients", label: "Clients" },
    { path: "/estimates", label: "Estimates" },
  ];

  return (
    <>
      <AppBar
        position="static"
        className="appbar"
        color="transparent"
        elevation={2}
      >
        <Toolbar className="toolbar">
          <Typography variant="h6" className="app-title">
            BuildMas Test
          </Typography>
          <Box className="nav-buttons">
            {navLinks.map((link) => {
              console.log("Rendering link:", link);
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  className={`nav-button ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box mt={4}>{children}</Box>
      </Container>
    </>
  );
};

export default Layout;
