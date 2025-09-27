"use client";
import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export const useUpdateUser = () => {
    const { update } = useSession();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await axiosClient.patch(`/user/${id}`, data);
            return res.data;
        },
        onSuccess: async (res) => {
            if (res.success) {
                await update({
                    ...res.data,
                });
                toast.success(res?.message || "User updated successfully!");
            } else {
                toast.error(res?.message || "Failed to update user.");
            }
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "User update error.");
        },
    });
};
