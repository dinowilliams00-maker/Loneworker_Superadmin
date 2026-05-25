// import {
//   useEffect,
//   useState,
// } from "react";

// function useAccessPermissionFilter(
//   accessPermission
// ) {
//   const filterAccessPermissions = (
//     path
//   ) =>
//     accessPermission?.filter(
//       (data) => data?.module === path
//     ) || [];

//   const [
//     filteredPermissions,
//     setFilteredPermissions,
//   ] = useState(null);

//   useEffect(() => {
//     if (accessPermission) {
//       setFilteredPermissions({
//         Device:
//           filterAccessPermissions(
//             "device"
//           ),

//         Worker:
//           filterAccessPermissions(
//             "worker"
//           ),

//         Site:
//           filterAccessPermissions(
//             "site"
//           ),

//         // User: filterAccessPermissions("user"),

//         // Dashboard:
//         // filterAccessPermissions("dashboard"),
//       });
//     }
//   }, [accessPermission]);

//   return filteredPermissions;
// }

// export default useAccessPermissionFilter;