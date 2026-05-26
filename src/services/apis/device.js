import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosInstance";


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

            if (params.isSimAssigned !== undefined) {
                queryParams.isSimAssigned = params.isSimAssigned;
                // Also adding isAssigned just in case backend expects it that way
                // queryParams.isAssigned = params.isSimAssigned;
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
