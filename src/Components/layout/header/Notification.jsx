// import { useState, Fragment } from "react";
// import Box from "@mui/material/Box";
// import { Button, Typography, Badge, Grid, Tooltip } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import { styled, createTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import MuiMenuItem from "@mui/material/MenuItem";
// import MuiMenu from "@mui/material/Menu";
// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import notificationImg from "src/assets/images/notification.gif";
// // import { FetchAllAlerts, FetchAllUnreadAlerts } from "src/components/apis/Alerts";
// // import moment from "moment";
// // import { useNavigate } from "react-router-dom";
// // import { useAlert } from "src/components/context/AlertContext";

// const localTheme = createTheme();

// const Menu = styled(MuiMenu)(({ theme }) => ({
//   "& .MuiMenu-paper": {
//     width: 400,
//     overflow: "hidden",
//     marginTop: theme.spacing(4),
//     [theme?.breakpoints.down("sm")]: {
//       width: "100%",
//     },
//   },
//   "& .MuiMenu-list": {
//     padding: 0,
//   },
// }));

// const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
//   paddingTop: theme.spacing(3),
//   paddingBottom: theme.spacing(3),
//   borderBottom: `1px solid ${theme.palette.divider}`,
// }));

// const styles = {
//   maxHeight: 349,
//   overflowY: "scroll",
//   "& .MuiMenuItem-root:last-of-type": {
//     border: 0,
//   },
// };

// const MenuItemTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   flex: "1 1 100%",
//   overflow: "hidden",
//   fontSize: "0.875rem",
//   whiteSpace: "nowrap",
//   textOverflow: "ellipsis",
//   marginBottom: theme.spacing(0.75),
// }));

// const ScrollWrapper = ({ children }) => {
//   const hidden = useMediaQuery(localTheme.breakpoints.down("lg"));
//   return (
//     <Box
//       sx={{
//         ...styles,
//         overflowY: hidden ? "auto" : "scroll",
//         overflowX: "hidden",
//       }}
//     >
//       {children}
//     </Box>
//   );
// };

// // Static notification data
// const staticNotifications = [];

// const Notification = ({ count }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   // const navigate = useNavigate();
//   // const { setAlert } = useAlert();

//   const handleDropdownOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDropdownClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDropdClose = () => {
//     setAnchorEl(null);
//     // navigate("/alerts");
//   };

//   // const handleOpenDialog = (notificationItem) => {
//   //   navigate("/alerts");
//   //   setAlert(notificationItem._id, notificationItem);
//   // };

//   return (
//     <Fragment>
//       <Tooltip title="Alerts">
//         <Badge color="primary" badgeContent={count} max={999}>
//           <IconButton
//             aria-haspopup="true"
//             onClick={handleDropdownOpen}
//             aria-controls="customized-menu"
//             sx={{
//               height: 50,
//               width: 50,
//               borderRadius: "50%",
//               backgroundColor: (theme) => theme.palette.secondary.dark,
//               ":hover": {
//                 backgroundColor: (theme) => theme.palette.secondary.dark,
//               },
//             }}
//           >
//             <NotificationsNoneIcon sx={{ color: "#fff", fontSize: "22px" }} />
//           </IconButton>
//         </Badge>
//       </Tooltip>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleDropdownClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <MenuItem disableRipple>
//           <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
//             <Typography align="center" sx={{ fontWeight: 600, width: "100%" }}>
//               Notifications
//             </Typography>
//           </Box>
//         </MenuItem>

//         <ScrollWrapper>
//           {staticNotifications.length > 0 ? (
//             staticNotifications.slice(0, 10).map((notification, index) => (
//               <MenuItem key={index}>
//                 <Box
//                   sx={{ width: "100%", display: "flex", alignItems: "center" }}
//                 >
//                   <Box
//                     sx={{
//                       flex: "1 1",
//                       display: "flex",
//                       overflow: "hidden",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <MenuItemTitle>
//                       <Grid container>
//                         <Grid size={12} display="flex" gap={1}>
//                           <Typography color="primary">
//                             {notification?.alertId} -
//                           </Typography>
//                           <Typography
//                             sx={{
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               maxWidth: "100%",
//                             }}
//                           >
//                             {notification?.description}
//                           </Typography>
//                         </Grid>
//                         <Grid
//                           size={12}
//                           display="flex"
//                           justifyContent="flex-end"
//                         >
//                           <Typography
//                             variant="caption"
//                             sx={{ color: "text.disabled" }}
//                           >
//                             {notification?.createdAt}
//                           </Typography>
//                         </Grid>
//                       </Grid>
//                     </MenuItemTitle>
//                   </Box>
//                 </Box>
//               </MenuItem>
//             ))
//           ) : (
//             <Grid
//               container
//               justifyContent="center"
//               alignItems="center"
//               sx={{ width: "100%", height: "40vh" }}
//               direction="column"
//             >
//               <Grid container justifyContent="center">
//                 <img
//                   src={notificationImg}
//                   alt="notification"
//                   width={150}
//                   height={150}
//                 />
//               </Grid>
//               <Typography sx={{ fontSize: "1.25rem", fontWeight: 500, mt: 1 }}>
//                 No notifications to show yet
//               </Typography>
//               <Typography
//                 align="center"
//                 sx={{ fontSize: "1rem", color: "#6D787D", width: "90%", mt: 0.5 }}
//               >
//                 You'll see useful information here soon. Stay tuned!
//               </Typography>
//             </Grid>
//           )}
//         </ScrollWrapper>

//         <MenuItem
//           disableRipple
//           sx={{
//             padding: "16px 16px",
//             borderTop: (theme) => `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Button
//             fullWidth
//             variant="contained"
//             sx={{ color: "#fff", border: "1px solid #fff" }}
//             onClick={handleDropdClose}
//           >
//             View All Notifications
//           </Button>
//         </MenuItem>
//       </Menu>
//     </Fragment>
//   );
// };

// export default Notification;
