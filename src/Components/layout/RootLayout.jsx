import { useState } from "react";
import { styled, Box, Container } from "@mui/material";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PageWrapper = styled("div")({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "40px",
  flexDirection: "column",
  zIndex: 1,
});

const RootLayout = () => {
  const [isSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const token = Cookies.get("authToken");

  return (
    <PageWrapper className="page-wrapper">
      <Sidebar
        isCollapsed={isCollapsed}
        isSidebarOpen={isSidebarOpen}
        setIsCollapsed={setIsCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

      <Box
        sx={{
          minHeight: "calc(100vh - 170px)",
          marginLeft: {
            xs: "20px",
            sm: "20px",
            lg: "260px",
          },
          marginRight: "10px",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            mt: 12,
          }}
        >
          {token ? <Outlet /> : <Navigate to="/auth/signin" replace />}
        </Container>
      </Box>
    </PageWrapper>
  );
};

export default RootLayout;
