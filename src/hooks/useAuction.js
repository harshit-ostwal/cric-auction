"use client";
import axiosClient from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAuctions = () => {
    return useQuery({
        queryKey: ["auctions"],
        queryFn: async () => {
            const res = await axiosClient.get("/auctions");
            return res.data.data;
        },
    });
};

export const useGetAuctionByUser = () => {
    return useQuery({
        queryKey: ["auction"],
        queryFn: async () => {
            const res = await axiosClient.get("/auction");
            return res.data.data;
        },
    });
};

export const useCreateAuction = () => {
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
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Auction creation error."
            );
        },
    });
};
