import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const Unauthorised = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // bgcolor: "#f5f7fa",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <FaLock
          color="error"
          fontSize="60px"
        />

        <Typography
          variant="h4"
          color="error"
          gutterBottom
        >
          403 - Unauthorized
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3 }}
        >
          You don’t have permission to access this
          page. Please contact your administrator
          or return to the home page.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() =>
            navigate("/auth/signin")
          }
        >
          return to login
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorised;