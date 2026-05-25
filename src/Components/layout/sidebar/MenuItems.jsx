import { v4 as uuid } from "uuid";
import {
  DashboardIcon,
  LocationIconSidebar,
  DangerIcon,
  TvIcon,
  SiteIcon,
  AdminIcon,
  LogoutIcon,
} from "src/Components/common/icons";
import SimCardIcon from '@mui/icons-material/SimCard';

const Menuitems = [
  {
    id: uuid(),
    title: "Organizations",
    icon: DashboardIcon,
    href: "/organization",
    key: "Devices",
  },
  // {
  //   id: uuid(),
  //   title: "Location tracking",
  //   icon: LocationIconSidebar,
  //   href: "/location-tracking",
  //   key: "Devices",
  // },
  // {
  //   id: uuid(),
  //   title: "Alert panel",
  //   icon: DangerIcon,
  //   href: "/alerts",
  //   key: "Devices",
  // },
  {
    id: uuid(),
    title: "Device management",
    icon: TvIcon,
    href: "/device-management",
    key: "Devices",
  },
  {
    id: uuid(),
    title: "Sim management",
    icon: SimCardIcon,
    href: "/sim-management",
    key: "Devices",
  },
  {
    id: uuid(),
    title: "Site management",
    icon: SiteIcon,
    href: "/site-management",
    key: "Devices",
  },
  {
    id: uuid(),
    title: "Admin Settings",
    icon: AdminIcon,
    href: "/admin-settings",
    key: "Devices",
  },
  // {
  //   id: uuid(),
  //   title: "Profile",
  //   icon: AdminIcon,
  //   href: "/profile",
  //   key: "Devices",
  // },
  {
    id: uuid(),
    title: "Logout",
    icon: LogoutIcon,
    href: "/auth/signin",
  },
];

export default Menuitems;
