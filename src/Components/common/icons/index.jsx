// src/components/icons/index.jsx

// ================= IMPORT ICONS =================

// lucide
import { LuMenu, LuPowerOff } from "react-icons/lu";

// ant design
import { AiOutlineLogout, AiOutlinePoweroff } from "react-icons/ai";

// ionicons
import {
  IoIosCloseCircleOutline,
  IoMdAddCircleOutline,
} from "react-icons/io";

import {
  IoCloudUploadOutline,
  IoCloudDownloadOutline,
  IoPersonRemoveOutline,
  IoSync,
} from "react-icons/io5";

import {
  IoLocationOutline,
  IoLocation,
  IoNotificationsOutline,
} from "react-icons/io5";

// feather
import { FiEdit3 } from "react-icons/fi";

// material
import {
  MdDashboard,
  MdDeleteForever,
  MdDesktopAccessDisabled,
  MdOutlineFileUpload,
  MdClose,
  MdOutlineMailOutline,
  MdOutlinePassword,
  MdOutlineInsertDriveFile,
  MdOutlineExpandMore,
  MdOutlineArrowOutward,
  MdOutlineMyLocation,
  MdOutlineAttractions,
  MdOutlineAccessTimeFilled,
  MdEdit,
} from "react-icons/md";

// fa6
import {
  FaMagnifyingGlass,
  FaCheck,
  FaUsersLine,
  FaUsers,
} from "react-icons/fa6";

// fa
import {
  FaEye,
  FaEyeSlash,
  FaRegCalendarAlt,
  FaRoute,
} from "react-icons/fa";

// remix
import {
  RiCloseCircleFill,
  RiAlertFill,
  RiAdminFill,
} from "react-icons/ri";

// bootstrap
import { BsTools } from "react-icons/bs";

// boxicons
import {
  BiSolidTv,
  BiSignal4,
  BiSignal3,
  BiSignal2,
  BiNoSignal,
} from "react-icons/bi";

// game icons
import { GiLizardman } from "react-icons/gi";

// im icons
import { ImProfile } from "react-icons/im";

// heroicons
import { HiMiniShieldCheck } from "react-icons/hi2";

// simple icons
import { SiGeopandas } from "react-icons/si";

// tabler
import { TbEyeFilled } from "react-icons/tb";

// ================= EXPORT ICONS =================

export const MenuIcon = LuMenu;

export const LogoutIcon = AiOutlineLogout;

export const CloseIcon = IoIosCloseCircleOutline;

export const CloudIcon = IoCloudUploadOutline;

export const CloudDownloadIcon = IoCloudDownloadOutline;

export const EditIcon = FiEdit3;

export const DeleteIcon = MdDeleteForever;

export const PersonRemove = IoPersonRemoveOutline;

export const DesktopDisable = MdDesktopAccessDisabled;

export const UploadIcon = MdOutlineFileUpload;

export const SearchIcon = FaMagnifyingGlass;

export const CloseSimpleIcon = MdClose;

export const CloseBg = RiCloseCircleFill;

export const MailIcon = MdOutlineMailOutline;

export const OpenEye = FaEye;

export const CloseEye = FaEyeSlash;

export const PasswordIcon = MdOutlinePassword;

export const DeviceActive = AiOutlinePoweroff;

export const DeviceDeactivate = LuPowerOff;

export const Sync = IoSync;

export const FileIcon = MdOutlineInsertDriveFile;

export const DangerIcon = RiAlertFill;

export const CalanderIcon = FaRegCalendarAlt;

export const CheckIcon = FaCheck;

export const Resolved = BsTools;

export const AddIcon = IoMdAddCircleOutline;

export const LocationIcon = IoLocationOutline;

export const LocationIconSidebar = IoLocation;

export const ExpandMoreIcon = MdOutlineExpandMore;

export const ForwardIcon = MdOutlineArrowOutward;

export const TvIcon = BiSolidTv;

export const WorkerIcon = GiLizardman;

export const SiteIcon = MdOutlineMyLocation;

export const AdminIcon = RiAdminFill;

export const NotificationIcon = IoNotificationsOutline;

export const GoodStrengthIcon = BiSignal4;

export const FairStrengthIcon = BiSignal3;

export const BadStrengthIcon = BiSignal2;

export const NoSignal = BiNoSignal;

export const RouteIcon = FaRoute;

export const UserIcon = FaUsersLine;

export const ProfileIcon = ImProfile;

export const ActiveWorkerIcon = MdOutlineAttractions;

export const WorkerWithoutCheckIn = HiMiniShieldCheck;

export const GeoFenceIcon = SiGeopandas;

export const AvgResponseIcon = MdOutlineAccessTimeFilled;

export const ManPowerIcon = FaUsers;

// ================= CUSTOM ICONS =================

export const DashboardIcon = (props) => (
  <MdDashboard {...props} />
);

export const EyeIcon = (props) => (
  <TbEyeFilled
    {...props}
    color="#FF9300"
  />
);

export const EditTableIcon = (props) => (
  <MdEdit
    {...props}
    color="#3C4346"
  />
);