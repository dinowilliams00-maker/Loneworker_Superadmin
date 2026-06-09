import { Suspense, lazy } from "react";
import { CircularProgress, Box } from "@mui/material";
import GuestOnlyRoute from "./guest";

// Lazy-loaded pages
const SignIn = lazy(() => import("../pages/Signin"));
const Unauthorized = lazy(() => import("../Components/common/unauthorized"));
const Organization = lazy(() => import("../pages/Organization"));
const OrganizationDetails = lazy(() => import("../pages/Organization/organizationDetails"));
const LocationTracking = lazy(() => import("../pages/Location-tracking"));
const LocationDetails = lazy(() => import("../pages/Location-tracking/LocationDetails"));
// const Alerts = lazy(() => import("../pages/Alerts"));
// const AlertsRouting = lazy(() => import("../pages/Alerts-routing"));
const DeviceManagement = lazy(() => import("../pages/Device-management"));
const DeviceDetails = lazy(() => import("../pages/Device-management/DeviceDetails"));
const SimManagement = lazy(() => import("../pages/Sim-management"));
const SimDetails = lazy(() => import("../pages/Sim-management/SimDetails"));
const Subscriptions = lazy(() => import("../pages/Subscriptions"));
const AuditLogs = lazy(() => import("../pages/AuditLogs"));
// const SiteDetails = lazy(() => import("../pages/Site-management/SiteDetails"));
const AdminSettings = lazy(() => import("../pages/Admin-settings"));
const AdminDetails = lazy(() => import("../pages/Admin-settings/AdminDetails"));
const Profile = lazy(() => import("../pages/Profile-setting"));
const RootLayout = lazy(() => import("../Components/layout/RootLayout"));

// Fallback loader — defined outside to avoid recreation on every render
const CenteredCircularProgress = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "850px",        // Adjust height as needed
      width: "100%",
    }}
  >
    <CircularProgress />
  </Box>
);
// Route config defined as a plain object — NOT a function that returns JSX
// This prevents hook count mismatches caused by recreating JSX on every render
export const routesForAuthenticatedOnly = [
  {
    path: "/",
    element: (
      <Suspense fallback={<CenteredCircularProgress />}>
        <RootLayout />
      </Suspense>
    ),
    children: [
      { path: "/organization", element: <Organization /> },
      { path: "/organization/:id", element: <OrganizationDetails /> },
      // { path: "/location-tracking", element: <LocationTracking /> },
      // { path: "/location-tracking/:id", element: <LocationDetails /> },
      // { path: "/alerts", element: <Alerts /> },
      // { path: "/alert-routing", element: <AlertsRouting /> },
      { path: "/device-management", element: <DeviceManagement /> },
      { path: "/device-management/:id", element: <DeviceDetails /> },
      { path: "/sim-management", element: <SimManagement /> },
      { path: "/sim-management/:id", element: <SimDetails /> },
      { path: "/subscriptions", element: <Subscriptions /> },
      // { path: "/site-management/:id", element: <SiteDetails /> },
      { path: "/audit-logs", element: <AuditLogs /> },
      { path: "/admin-settings", element: <AdminSettings /> },
      { path: "/profile", element: <Profile /> },
      { path: "/admin-settings/:id", element: <AdminDetails /> },
    ],
  },
];

export const routesForNotAuthenticatedOnly = [
  {
    path: "/",
    element: (
      <Suspense fallback={<CenteredCircularProgress />}>
        <GuestOnlyRoute />
      </Suspense>
    ),
    children: [
      { path: "/auth/signin", element: <SignIn /> },
      { path: "*", element: <Unauthorized /> },
    ],
  },
];

// Keep RouteConfig as a function for backward compatibility
export const RouteConfig = () => ({
  routesForAuthenticatedOnly,
  routesForNotAuthenticatedOnly,
});
