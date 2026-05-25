import { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Divider,
  ListItemIcon,
  Button,
  Avatar,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/Components/common/provider/authProvider";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() || "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  return first + last;
};

export default function AccountMenu() {
  const router = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, fullName } = useAuth();

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Use real fullName from auth context, fallback to cookie
  const displayName = fullName || "Super Admin";
  const roleLabel = "Admin";

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Profile">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1, padding: "6px", borderRadius: "8px" }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Avatar */}
              <Avatar
                sx={{
                  height: 44,
                  width: 44,
                  backgroundColor: "#3C4346",
                  border: "2px solid #FF9300",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {getInitials(displayName)}
              </Avatar>

              {/* Name + Role */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#fff",
                    lineHeight: 1.3,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {displayName
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#FF9300",
                    lineHeight: 1.3,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {roleLabel}
                </Typography>
              </Box>
            </Box>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 16,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-45%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            router("/admin-settings");
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => {
          handleClose();
          logout();
        }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
}
