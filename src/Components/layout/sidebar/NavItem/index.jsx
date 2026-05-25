import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "src/Components/common/provider/authProvider";

// styled() MUST be defined outside the component — never inside render
const ListItemStyled = styled(ListItem)(({ theme }) => ({
  padding: "5px 10px",
  ".MuiButtonBase-root": {
    whiteSpace: "nowrap",
    marginBottom: "2px",
    borderRadius: "30px",
    padding: "8px 14px",
    width: "100%",
    color: "#fff",
    ".MuiListItemIcon-root": {
      color: "#fff",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      ".MuiListItemIcon-root": {
        color: theme.palette.secondary.main,
      },
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      ".MuiListItemIcon-root": {
        color: theme.palette.secondary.main,
      },
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        ".MuiListItemIcon-root": {
          color: theme.palette.secondary.main,
        },
      },
    },
  },
}));

const MenuItemTextMetaWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "opacity .25s ease-in-out",
  overflow: "hidden",
  lineHeight: 1.6,
  fontFamily: "Poppins, Helvetica, Arial, sans-serif",
  fontSize: "0.875rem",
}));

const NavItem = ({ item, isLast, onClick }) => {
  const Icon = item.icon;
  const location = useLocation();
  const { logout } = useAuth();

  const isNavLinkActive = location.pathname.startsWith(item?.href);

  const handleItemClick = () => {
    if (isLast) {
      logout();
    }
    if (onClick) onClick();
  };

  return (
    <List component="div" disablePadding>
      <ListItemStyled>
        <Box />
        <ListItemButton
          component={Link}
          to={item?.href}
          selected={isNavLinkActive}
          onClick={handleItemClick}
          sx={{
            // active state color applied via sx since styled() can't access isNavLinkActive
            color: isNavLinkActive ? "secondary.main" : "#fff",
            "& .MuiListItemIcon-root": {
              color: isNavLinkActive ? "secondary.main" : "#fff",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "34px",
              p: "3px 0",
              transition: "margin .25s ease-in-out",
              fontSize: "22px",
            }}
          >
            {Icon ? <Icon sx={{ fontSize: "22px" }} /> : null}
          </ListItemIcon>

          <ListItemText>
            <MenuItemTextMetaWrapper
              sx={{ fontWeight: isNavLinkActive ? 600 : 400 }}
            >
              {item?.title}
            </MenuItemTextMetaWrapper>
          </ListItemText>
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
