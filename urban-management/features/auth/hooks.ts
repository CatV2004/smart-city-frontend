"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, logoutApi, registerApi } from "./api";
import { userKeys } from "../user/querykeys";

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

    const logout = async () => {
        await logoutMutation.mutateAsync();

        await queryClient.invalidateQueries({
            queryKey: userKeys.current(),
        });
    };

    return {
        logout,
        isLoading: logoutMutation.isPending,
        error: logoutMutation.error,
    };
};