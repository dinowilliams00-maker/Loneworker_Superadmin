import { useState } from "react";
import { AppBar, IconButton, Grid, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import Notification from "./Notification";
import Profile from "./Profile";

const Header = ({ toggleMobileSidebar }) => {
  const [count] = useState(0);

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: "none",
        backgroundColor: "#3C4346",
        borderRadius: "0px",
        px: 2,
        height: "75px",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <Grid
        container
        alignItems="center"
        sx={{ height: "100%" }}
      >
        {/* Mobile hamburger */}
        <IconButton
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: { xs: "flex", lg: "none" },
            color: "#fff",
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Right side */}
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* <Notification count={count} /> */}
          <Profile />
        </Box>
      </Grid>
    </AppBar>
  );
};

export default Header;