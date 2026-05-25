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
export const useAssignAndUnassignSim = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, type, deviceId }) => {
            const payload = { type };
            if (deviceId) {
                payload.deviceId = deviceId;
            }
            const response = await axiosInstance.patch(
                `sim-registry/assign-unassign-sim/${id}`,
                payload
            );
            return response.data;
        },
        retry: 2,
        retryDelay: 1000,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllSim"],
            });
        },
    });
};