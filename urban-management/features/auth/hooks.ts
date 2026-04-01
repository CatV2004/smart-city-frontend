"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, logoutApi, registerApi } from "./api";
import { userKeys } from "../user/querykeys";
import { useRealtimeClient } from "@/lib/realtime/RealtimeProvider";

export const useRegister = () =>
    useMutation({
        mutationFn: registerApi,
    });

export const useLogin = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: loginApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userKeys.current(),
            });
        },
    });

    return mutation;
};

export const useLogout = () =>
    useMutation({
        mutationFn: logoutApi,
    });

export const useLogoutWithInvalidate = () => {
    const queryClient = useQueryClient();
    const logoutMutation = useLogout();
    const client = useRealtimeClient();

    const logout = async () => {
        try {
            if (client && client.active) {
                await client.deactivate();
                console.log("🔌 WebSocket disconnected");
            }

            await logoutMutation.mutateAsync();

        } finally {
            localStorage.removeItem("accessToken");

            queryClient.removeQueries({
                queryKey: userKeys.current(),
            });

            queryClient.clear();
        }
    };

    return {
        logout,
        isLoading: logoutMutation.isPending,
        error: logoutMutation.error,
    };
};