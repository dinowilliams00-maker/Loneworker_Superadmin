import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosInstance";



// get All Sim
export const useGetAllSim = (
    params = {},
    options = {}
) => {
    return useQuery({
        queryKey: [
            "GetAllSim",
            params,
        ],
        queryFn: async () => {
            const queryParams = {
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

            if (params.organization) {
                queryParams.orgId = params.organization;
            }

            if (params.device) {
                queryParams.deviceId = params.device;
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

// ===============Add Sim Api=======================================================

const addNewSim = async (formData) => {
    try {
        const response = await axiosInstance.post(
            "sim-registry/create-sim-inventory",
            formData
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to add sim"
        );
    }
};


export const useAddSim = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addNewSim,

        retry: 2,

        retryDelay: 1000,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllSim"],
            });
        },
    });
};

//=================================View Details By Id==================================

const getSimDetailsById = async (id) => {
    try {
        const response = await axiosInstance.get(
            `sim-registry/get-sim-inventory/${id}`
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to fetch sim details"
        );
    }
};

export const useGetSimDetailsById = (id, options = {}) => {
    return useQuery({
        queryKey: ["getSimDetailsById", id],
        queryFn: () => getSimDetailsById(id),
        enabled: !!id,
        ...options,
    });
};


// ===============================================Delete Sim =========================================================
export const useDeleteSimById = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["DeleteSim"],
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`sim-registry/delete-sim-inventory/${id}`);
            return response?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllSim"],
            });
        },
        ...options,
    });
};

//=============Assign and Unassign Sim===========================================
const AssignAndUnassignSim = async ({ id, type, deviceId, userId }) => {
    try {
        const payload = { type, deviceId };
        let url = `sim-registry/assign-unassign-sim/${id}`;
        if (userId ) {
            payload.assigned_to = userId;
            url += `?assigned_to=${userId}`;
        }

        const response = await axiosInstance.patch(
            url,
            payload
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to assign or unassign sim"
        );
    }
};

export const useAssignAndUnassignSim = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AssignAndUnassignSim,

        retry: 2,

        retryDelay: 1000,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllSim"],
            });
            queryClient.invalidateQueries({
                queryKey: ["GetAllDevices"],
            });
            queryClient.invalidateQueries({
                queryKey: ["getSimDetailsById"],
            });
        },
    });
};


//=============Update sim api==================================================================================
const updateSim = async ({ id, formData }) => {
    try {
        const response = await axiosInstance.patch(
            `sim-registry/update-sim-inventory/${id}`,
            formData
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to update sim"
        );
    }
};

export const useUpdateSim = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSim,
        retry: 2,
        retryDelay: 1000,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getSimDetailsById"],
            });
        },
    });
};


// ========================== Bulk Sim Upload =========================================

const BulkSimUpload = async (formData) => {
    try {
        const response = await axiosInstance.post(
            "sim-registry/bulk-create-sim-inventory",
            formData
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to bulk upload sim"
        );
    }
};

export const useBulkSimUpload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: BulkSimUpload,
        retry: 2,
        retryDelay: 1000,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllSim"],
            });
        },
    });
};