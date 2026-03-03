"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { loginApi, getCurrentUserApi, logoutApi, registerApi } from "./api";

export const useRegister = () =>
    useMutation({
        mutationFn: registerApi,
    });

export const useLogin = () =>
    useMutation({
        mutationFn: loginApi,
    });

export const useCurrentUser = () =>
    useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUserApi,
        retry: false,
    });

export const useLogout = () =>
    useMutation({
        mutationFn: logoutApi,
    });