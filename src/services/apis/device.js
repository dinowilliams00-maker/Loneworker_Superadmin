import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axiosInstance from "src/Components/common/utils/axiosInstance";


// Get all Devices (supports pagination, search, etc.)
export const getAllDevice = (
    params = {},
    options = {}
) => {
    return useQuery({
        queryKey: ["GetAllDevices", params],

        queryFn: async () => {
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || params.rowsPerPage || 10,
                search: params.searchQuery?.trim() || "",
            };

            // Forward isOrgAssigned (Assign dialog) if provided
            if (params.isOrgAssigned !== undefined) {
                queryParams.isOrgAssigned = params.isOrgAssigned;
            }

            // Forward orgId (Unassign dialog) if provided
            if (params.orgId !== undefined) {
                queryParams.orgId = params.orgId;
            }

            if (params.isSimAssigned !== undefined) {
                queryParams.isSimAssigned = params.isSimAssigned;
            }

            console.log("📤 Final Params:", queryParams);

            const response = await axiosInstance.get(
                "device-registry/get-all-device-inventory",
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


// ================= ADD DEVICE API =================

const addNewDevice = async (formData) => {
    try {
        const response = await axiosInstance.post(
            "device-registry/create-device-inventory",
            formData
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to add device"
        );
    }
};

// ================= MUTATION HOOK =================

export const useAddDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addNewDevice,

        retry: 2,

        retryDelay: 1000,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllDevices"],
            });
        },
    });
};




const getDeviceById = async (deviceId) => {
    try {
        const response = await axiosInstance.get(
            `device-registry/get-device-inventory/${deviceId}`
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to fetch device details"
        );
    }
};

export const useGetDeviceById = (id, options = {}) => {
    return useQuery({
        queryKey: ["getDeviceById", id],
        queryFn: () => getDeviceById(id),
        enabled: !!id,
        ...options,
    });
};

//   ===========================Assign and Unassign Device ======================================
const updateDeviceStatus = async ({ userId, orgId, status, deviceId }) => {
    try {
        const response = await axiosInstance.patch(
            `device-registry/assign-unassign-device-to-org?assigned_to=${userId}`,
            {
                orgId,
                status,
                deviceId
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to update device status"
        );
    }
};

export const useUpdateDeviceStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDeviceStatus,

        retry: 2,

        retryDelay: 1000,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllOrgDetailsById"]
            });
            queryClient.invalidateQueries({
                queryKey: ["getDeviceDetailsByOrgId"]
            });
            queryClient.invalidateQueries({
                queryKey: ["GetAllSimByOrgId"]
            });
            // Also refresh the list of all devices used for assign dialog
            queryClient.invalidateQueries({
                queryKey: ["GetAllDevices"]
            });
        },
    });
};

// ======================Device Bulk Upload ======================
const deviceBulkUpload = async (formData) => {
    try {
        const response = await axiosInstance.post(
            "device-registry/bulk-create-device-inventory",
            formData
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to upload devices"
        );
    }
};

export const useDeviceBulkUpload = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deviceBulkUpload,

        retry: 2,

        retryDelay: 1000,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetAllDevices"],
            });
        },
    });
};

// ==================================Update Device By Id==================================

const updateDeviceById = async ({ id, assignedTo, data }) => {
    try {
        let url = `device-registry/update-device/${id}?assigned_to=${assignedTo}`;
        const response = await axiosInstance.patch(url, data);

        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to update device"
        );
    }
};

export const useUpdateDeviceById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDeviceById,

        retry: 2,

        retryDelay: 1000,

        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["getDeviceById", variables.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["GetAllDevices"],
            });
        },
    });
};

// Delete Api 

const deleteDeviceById = async ({ id, assignedTo }) => {
    try {
        const response = await axiosInstance.delete(
            `device-registry/delete-device/${id}`,
            {
                params: {
                    assigned_to: assignedTo,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            "Failed to delete device"
        );
    }
};

export const useDeleteDeviceById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDeviceById,

        retry: 2,

        retryDelay: 1000,

        onSuccess: () => {
            // Only refresh the list — don't refetch getDeviceById since the device is deleted
            queryClient.invalidateQueries({
                queryKey: ["GetAllDevices"],
            });
        },
    });
};
