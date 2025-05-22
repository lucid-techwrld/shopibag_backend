import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import notfound from "../assets/icons/undraw_page-not-found_6wni.svg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 4,
        py: 4,
      }}
    >
      {/* Vector image */}
      <Box
        component="img"
        src={notfound}
        alt="404 Not Found"
        sx={{ width: "100%", maxWidth: 300 }}
      />

      <Typography variant="h4" fontWeight="bold" color="primary">
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard")}
      >
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
