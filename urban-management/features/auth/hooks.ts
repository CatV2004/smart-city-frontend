"use client";

import { useMutation } from "@tanstack/react-query";
import { loginApi, logoutApi, registerApi } from "./api";

export const useRegister = () =>
    useMutation({
        mutationFn: registerApi,
    });

export const useLogin = () =>
    useMutation({
        mutationFn: loginApi,
    });

export const useLogout = () =>
    useMutation({
        mutationFn: logoutApi,
    });