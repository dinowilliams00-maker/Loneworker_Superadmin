// import {
//   useState,
//   useEffect,
// } from "react";

// import axiosInstance from "src/utils/axiosInstance";

// function usePermission(userId) {
//   const [
//     accessPermissionRoleBased,
//     setAccessPermission,
//   ] = useState([]);

//   const getPermissionBasedRole =
//     async () => {
//       try {
//         const { data, status } =
//           await axiosInstance.get(
//             `permission/getAllPermission/${userId}`
//           );

//         if (status === 200) {
//           setAccessPermission(
//             data?.data
//           );
//         }
//       } catch (err) {
//         console.error(
//           "Error fetching permission based on role:",
//           err
//         );
//       }
//     };

//   useEffect(() => {
//     if (userId) {
//       getPermissionBasedRole();
//     }
//   }, [userId]);

//   return {
//     accessPermissionRoleBased,
//     getPermissionBasedRole,
//   };
// }

// export default usePermission;