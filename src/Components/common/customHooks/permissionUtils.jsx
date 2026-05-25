// import {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
// } from "react";

// import axiosInstance from "src/utils/axiosInstance";

// import {
//   notifySuccess,
//   notifyError,
// } from "src/components/snackbar";

// import Menuitems from "../../src/layouts/sidebar/MenuItems";

// import Cookies from "js-cookie";

// import { getSocket } from "src/utils/socket";

// const usePermissionUtils = () => {
//   // const { routesForAuthenticatedOnly } = RouteConfig();

//   const [state, setState] = useState({
//     userId: null,
//     token: null,
//     accessPermission: [],
//     loading: true,
//     permissionsLoaded: false,
//   });

//   const {
//     userId,
//     accessPermission,
//     loading,
//     permissionsLoaded,
//   } = state;

//   const updateState = (newState) => {
//     setState((prevState) => ({
//       ...prevState,
//       ...newState,
//     }));
//   };

//   // Helper function to compare permission arrays
//   // const arePermissionsEqual = useCallback(
//   //   (current, incoming) => {
//   //     if (current.length !== incoming.length) return false;

//   //     // Sort both arrays by key for consistent comparison
//   //     const sortedCurrent = [...current].sort((a, b) =>
//   //       a.key.localeCompare(b.key)
//   //     );

//   //     const sortedIncoming = [...incoming].sort((a, b) =>
//   //       a.key.localeCompare(b.key)
//   //     );

//   //     return sortedCurrent.every((permission, index) => {
//   //       const incomingPermission = sortedIncoming[index];

//   //       return (
//   //         permission.key === incomingPermission.key &&
//   //         permission.allowed === incomingPermission.allowed
//   //       );
//   //     });
//   //   },
//   //   []
//   // );

//   useEffect(() => {
//     const _id = Cookies.get("_id");

//     const access_token =
//       Cookies.get("authToken");

//     if (_id) {
//       updateState({
//         userId: _id,
//         token: access_token,
//       });
//     } else {
//       updateState({
//         loading: false,
//         permissionsLoaded: true,
//       });
//     }
//   }, []);

//   const getPermission = useCallback(
//     async () => {
//       if (!userId) return;

//       try {
//         setState((prev) => ({
//           ...prev,
//           loading: true,
//           permissionsLoaded: false,
//         }));

//         const { data, status } =
//           await axiosInstance.get(
//             `permission/getAllPermission/${userId}`
//           );

//         if (status === 200) {
//           setState((prev) => ({
//             ...prev,
//             accessPermission: data?.data,
//             loading: false,
//             permissionsLoaded: true,
//           }));
//         }
//       } catch (err) {
//         console.error("error", err);

//         setState((prev) => ({
//           ...prev,
//           loading: false,
//           permissionsLoaded: true,
//         }));
//       }
//     },
//     [userId]
//   );

//   useEffect(() => {
//     if (userId) getPermission();
//   }, [userId, getPermission]);

//   useEffect(() => {
//     const Socket = getSocket();

//     const token = Cookies.get("_id");

//     if (token) {
//       Socket?.emit("joinUserRoom", {
//         userId: token,
//       });
//     }

//     if (!Socket) return;

//     // Helper function to compare permission arrays (defined inside useEffect)

//     const arePermissionsEqual = (
//       current,
//       incoming
//     ) => {
//       if (
//         current.length !== incoming.length
//       )
//         return false;

//       // Sort both arrays by key for consistent comparison

//       const sortedCurrent = [
//         ...current,
//       ].sort((a, b) =>
//         a.key.localeCompare(b.key)
//       );

//       const sortedIncoming = [
//         ...incoming,
//       ].sort((a, b) =>
//         a.key.localeCompare(b.key)
//       );

//       return sortedCurrent.every(
//         (permission, index) => {
//           const incomingPermission =
//             sortedIncoming[index];

//           return (
//             permission.key ===
//               incomingPermission.key &&
//             permission.allowed ===
//               incomingPermission.allowed
//           );
//         }
//       );
//     };

//     const handlePermissionUpdate = (
//       data
//     ) => {
//       // Get current permissions from state

//       setState((prevState) => {
//         const currentPermissions =
//           prevState.accessPermission;

//         const newPermissions =
//           data?.data || [];

//         if (
//           arePermissionsEqual(
//             currentPermissions,
//             newPermissions
//           )
//         ) {
//           return prevState;
//         }

//         return {
//           ...prevState,
//           accessPermission:
//             newPermissions,
//           permissionsLoaded: true,
//         };
//       });
//     };

//     Socket?.on(
//       "permission:getAllPermission",
//       handlePermissionUpdate
//     );

//     return () => {
//       Socket?.off(
//         "permission:getAllPermission",
//         handlePermissionUpdate
//       );
//     };
//   }, []);

//   const notAllowedPermissions =
//     useMemo(
//       () =>
//         accessPermission?.filter(
//           (item) =>
//             item.allowed === false
//         ) || [],
//       [accessPermission]
//     );

//   const updatedRoutesPermit =
//     useMemo(
//       () =>
//         Menuitems?.filter(
//           (route) =>
//             !notAllowedPermissions?.some(
//               (permission) =>
//                 permission.key ===
//                 route.key
//             )
//         ),
//       [notAllowedPermissions]
//     );

//   const PermissionCheck =
//     useCallback(
//       (key) => {
//         if (!permissionsLoaded)
//           return false;

//         if (
//           accessPermission.length === 0
//         )
//           return true;

//         return !notAllowedPermissions.some(
//           (ele) => ele.key === key
//         );
//       },
//       [
//         notAllowedPermissions,
//         permissionsLoaded,
//         accessPermission.length,
//       ]
//     );

//   // Helper function to check if we should show permission-gated

//   const hasPermission = useCallback(
//     (key) => {
//       if (
//         loading ||
//         !permissionsLoaded
//       )
//         return false;

//       return PermissionCheck(key);
//     },
//     [
//       loading,
//       permissionsLoaded,
//       PermissionCheck,
//     ]
//   );

//   const CheckTabsPermissions =
//     useCallback(
//       (permissionList) => {
//         const initialPermissions = {};

//         permissionList.forEach(
//           (permission) => {
//             initialPermissions[
//               permission
//             ] = hasPermission(
//               permission
//             );
//           }
//         );

//         return initialPermissions;
//       },
//       [hasPermission]
//     );

//   const editAccessPermission =
//     useCallback(
//       async (
//         userID,
//         changePermission,
//         setEdit
//       ) => {
//         try {
//           const body = {
//             permissions:
//               changePermission,
//             userId: userID,
//           };

//           const res =
//             await axiosInstance.post(
//               `api/permission/updateUserPermission`,
//               body
//             );

//           if (
//             res?.status === 200 ||
//             res?.status === 201
//           ) {
//             setEdit(false);

//             notifySuccess(
//               res?.data?.msg ||
//                 "Permissions updated successfully."
//             );

//             getPermission();
//           } else {
//             notifyError(
//               "Failed to update permissions."
//             );
//           }
//         } catch (error) {
//           notifyError(
//             error?.response?.data?.msg ||
//               "An error occurred while updating permissions."
//           );
//         }
//       },
//       [getPermission]
//     );

//   return {
//     loading,
//     permissionsLoaded,
//     updatedRoutesPermit,
//     PermissionCheck,
//     hasPermission,
//     CheckTabsPermissions,
//     accessPermission,
//     updateState,
//     getPermission,
//     editAccessPermission,
//   };
// };

// export default usePermissionUtils;