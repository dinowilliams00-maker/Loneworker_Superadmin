import { useMutation } from "@tanstack/react-query";

import axiosInstance from "src/utils/axiosInstance";

import Cookies from "js-cookie";

export const SignIn = () => {
    return useMutation({
        mutationKey: ["signIn"],

        mutationFn: async (formdata) => {
            const response =
                await axiosInstance.post(
                    "auth/superLogin",
                    formdata
                );

            return response?.data;
        },

        onSuccess: (data) => {
            Cookies.set(
                "authToken",
                data.token,
                {
                    expires: 1, // 1 day
                }
            );

            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.token}`;
        },
    });
};
