"use client";
import axiosClient from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useAuctions = () => {
    return useQuery({
        queryKey: ["auctions"],
        queryFn: async () => {
            const res = await axiosClient.get("/auction");
            return res.data.data;
        },
    });
};

export const useGetAuctionsByUserId = (userId) => {
    return useQuery({
        queryKey: ["auctions", "user", userId],
        queryFn: async () => {
            const res = await axiosClient.get(`/auction/user/${userId}`);
            return res.data.data;
        },
        enabled: !!userId,
    });
};

export const useGetMyAuctions = () => {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ["auctions", "user", session?.user?.id],
        queryFn: async () => {
            const res = await axiosClient.get(
                `/auction/user/${session?.user?.id}`
            );
            return res.data.data;
        },
        enabled: !!session?.user?.id,
    });
};

export const useGetAuctionById = (id) => {
    return useQuery({
        queryKey: ["auction", id],
        queryFn: async () => {
            const res = await axiosClient.get(`/auction/${id}`);
            return res.data.data;
        },
        enabled: !!id,
    });
};

export const useCreateAuction = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/auction", data);
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res?.message || "Auction created successfully!");
            } else {
                toast.error(res?.message || "Failed to create auction.");
            }
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
            router.replace("/");
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Auction creation error."
            );
        },
    });
};

export const useDeleteAuction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosClient.delete(`/auction/${id}`);
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res?.message || "Auction deleted successfully!");
            } else {
                toast.error(res?.message || "Failed to delete auction.");
            }
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Auction deletion error."
            );
        },
    });
};

export const useUpdateAuction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await axiosClient.patch(`/auction/${id}`, data);
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res?.message || "Auction updated successfully!");
            } else {
                toast.error(res?.message || "Failed to update auction.");
            }
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Auction update error."
            );
        },
    });
};
