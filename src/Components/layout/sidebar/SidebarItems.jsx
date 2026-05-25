import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import Menuitems from "./MenuItems";
// import AdminDropdown from "./adminDropdown";
import Cookies from "js-cookie";

const SidebarItems = ({ isCollapsed, toggleMobileSidebar }) => {
  const role = Cookies.get("role");

  const filteredMenuItems = Menuitems?.filter((item) => {
    if (item?.title === "Admin Settings") {
      return role === "1";
    }
    if (item?.title === "Profile") {
      return role === "2" || role === "3";
    }
    return true;
  });

  const logoutItem = Menuitems?.find((item) => item?.title === "Logout");

  const itemsToRender = filteredMenuItems?.filter(
    (item) => item?.title !== "Logout"
  );

  return (
    <>
      <List>
        {itemsToRender?.map((item) =>
          // item.title === "Admin Settings" ? (
          //   <AdminDropdown key={item?.id} title={item?.title} />
          // ) :
          (
            <NavItem
              item={item}
              key={item.id}
              isCollapsed={isCollapsed}
              onClick={toggleMobileSidebar}
            />
          )
        )}
      </List>

      <Box
        sx={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <NavItem
          item={logoutItem}
          isCollapsed={isCollapsed}
          isLast={true}
          onClick={toggleMobileSidebar}
        />
      </Box>
    </>
  );
};

export default SidebarItems;
