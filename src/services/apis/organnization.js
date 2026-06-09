import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosInstance";

// ==================== TENANT APIs ====================
// Get all tenants/Admins (supports pagination, search, etc.)
export const getAllTenants = (
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["GetAllTenants", params],

    queryFn: async () => {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || params.rowsPerPage || 10,
        search: params.searchQuery?.trim() || "",
      };

      console.log(" Final Params:", queryParams);

      const response = await axiosInstance.get(
        "/super/list-tenant-dbs",
        {
          params: queryParams,
        }
      );

      return response.data;
    },

    keepPreviousData: true,

    refetchOnWindowFocus: false,

    ...options,
  });
};

// ================= ADD ADMIN API =================

const addNewAdmin = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/super/create-admin",
      formData
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      "Failed to add admin"
    );
  }
};

// ================= MUTATION HOOK =================

export const useAddAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewAdmin,

    retry: 2,

    retryDelay: 1000,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllTenants"],
      });
    },
  });
};

// ================= Get All Org Details By Id=================
export const getAllOrgDetailsById = (
  orgId,
  options = {}
) => {
  return useQuery({
    queryKey: ["GetAllOrgDetailsById", orgId],

    queryFn: async () => {
      const response = await axiosInstance.get(
        `super/org-details/${orgId}`,
      );

      return response.data;
    },

    keepPreviousData: true,

    refetchOnWindowFocus: false,

    ...options,
  });
};

// ===============================Delete Admin Id ===================
export const DeleteOrgById = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["DeleteOrgById"],
    mutationFn: async (orgId) => {
      const response = await axiosInstance.delete(
        `super/delete-org/${orgId}`
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllTenants"],
      });
    },
    ...options,
  });
};


//========================Get Device details By Id================================
export const getDeviceDetailsByOrgId = (
  orgId,
  params = {},
  options = {}
) => {

  return useQuery({

    queryKey: [
      "getDeviceDetailsByOrgId",
      orgId,
      params,
    ],

    queryFn: async () => {

      const queryParams = {
        orgId,
        page: params.page || 1,
        limit: params.rowsPerPage || 10,
      };

      // ================= SEARCH =================

      if (
        params.searchQuery &&
        params.searchQuery.trim() !== ""
      ) {

        queryParams.search =
          params.searchQuery.trim();
      }

      // ================= POOL TYPE =================

      if (
        params.poolType &&
        params.poolType !== ""
      ) {

        queryParams.poolType =
          params.poolType;
      }

      console.log(
        "Final Params:",
        queryParams
      );

      const response =
        await axiosInstance.get(
          "/device-registry/get-all-device-inventory",
          {
            params: queryParams,
          }
        );

      return response.data;
    },

    keepPreviousData: true,

    refetchOnWindowFocus: false,

    ...options,
  });
};

// ========================Update Admin By Id==================================
export const UpdateOrgById = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UpdateOrgById"],
    mutationFn: async ({ id, formData }) => {
      const response = await axiosInstance.patch(`super/update-org/${id}`, formData);
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllTenants"],
      });
      queryClient.invalidateQueries({
        queryKey: ["GetAllOrgDetailsById"]
      })
    },
    ...options,
  });
};

// ==============================Get All Sim by Org id=========================================
export const GetAllSimByOrgId = (
  orgId,
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: [
      "GetAllSimByOrgId",
      orgId,
      params,
    ],
    queryFn: async () => {
      const queryParams = {
        orgId,
        page: params.page || 1,
        limit: params.rowsPerPage || 10,
      };

      // ================= SEARCH =================

      if (
        params.searchQuery &&
        params.searchQuery.trim() !== ""
      ) {

        queryParams.search =
          params.searchQuery.trim();
      }

      const response = await axiosInstance.get(
        `sim-registry/get-sim-inventory`,
        {
          params: queryParams,
        }
      );

      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });
};


//=================================== Activate Deactivate Admin By Id========================================
const activateDeactivateAdminById = async ({ orgId, body }) => {
  const response = await axiosInstance.patch(
    `super/tenant-db/${orgId}`,
    body
  );
  return response.data;
};

export const useActivateDeactivateAdminById = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["activateDeactivateAdminById"],
    mutationFn: activateDeactivateAdminById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllTenants"],
      });
      queryClient.invalidateQueries({
        queryKey: ["GetAllOrgDetailsById"],
      });
    },
    ...options,
  });
};