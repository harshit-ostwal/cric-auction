"use client";
import axiosClient from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePlayers = (id) => {
    return useQuery({
        queryKey: ["players", id],
        queryFn: async () => {
            const res = await axiosClient.get(`/auction/${id}/players`);
            return res.data.data;
        },
    });
};

export const usePlayerById = (auctionId, playerId) => {
    return useQuery({
        queryKey: ["player", auctionId, playerId],
        queryFn: async () => {
            const res = await axiosClient.get(
                `/auction/${auctionId}/players/${playerId}`
            );
            return res.data;
        },
        enabled: !!auctionId && !!playerId,
    });
};

export const useDeletePlayer = (auctionId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (playerId) => {
            const res = await axiosClient.delete(
                `/auction/${auctionId}/players/${playerId}`
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Player deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["players"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
    });
};

export const useCreatePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post(
                `/auction/${data.auctionId}/players`,
                data
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Player added successfully");
            queryClient.invalidateQueries({ queryKey: ["auction"] });
            queryClient.invalidateQueries({ queryKey: ["players"] });
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });
};

export const useUpdatePlayer = (auctionId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ playerId, data }) => {
            const res = await axiosClient.patch(
                `/auction/${auctionId}/players/${playerId}`,
                data
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Player updated successfully");
            queryClient.invalidateQueries({ queryKey: ["auction"] });
            queryClient.invalidateQueries({ queryKey: ["players"] });
            queryClient.invalidateQueries({ queryKey: ["player"] });
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });
};
