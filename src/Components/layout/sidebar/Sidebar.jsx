import { useState, useEffect } from "react";
import { useMediaQuery, Box, Drawer, useTheme } from "@mui/material";
import SidebarItems from "./SidebarItems";
import brandMark from "src/assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  isCollapsed,
  isMobileSidebarOpen,
  setIsCollapsed,
  onSidebarClose,
  isSidebarOpen,
}) => {
  const theme = useTheme();

  const [sidebarVariant, setSidebarVariant] = useState("permanent");

  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const sidebarWidth = "260px";

  const navigate = useNavigate();

  useEffect(() => {
    setSidebarVariant(lgUp ? "permanent" : "temporary");
  }, [lgUp]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box sx={{ width: { xs: 0, lg: sidebarWidth }, flexShrink: 0 }}>
      <Drawer
        anchor="left"
        open={lgUp ? isSidebarOpen : isMobileSidebarOpen}
        onClose={!lgUp ? onSidebarClose : undefined}
        variant={sidebarVariant}
          sx={{
             "& .MuiDrawer-paper": {
               width: "262px",
               boxSizing: "border-box",
               border: "none",
               borderRight: "0px solid transparent",
               outline: "none",
               overflow: "hidden",
               backgroundColor: "#3C4346",
               color: "#fff",
               borderRadius: "0px",
               padding: "0px",
               boxShadow: "4px 0px 10px 0px rgba(0, 0, 0, 0.6)",
               backgroundImage: "none",
             },
           }}
         >
      
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: "12px",
              px: "16px",
              mb:1
            }}
          >
            <img
              height={90}
              width={150}
              alt="logo"
              src={brandMark}
              style={{ cursor: "pointer", objectFit: "contain", display: "block" }}
              onClick={() => navigate("/organization")}
            />
          </Box>

          <Box mt={2}>
            <SidebarItems
              isCollapsed={isCollapsed}
              toggleMobileSidebar={handleCollapseToggle}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
