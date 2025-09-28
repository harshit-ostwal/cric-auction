"use client";
import axiosClient from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTeams = (id) => {
    return useQuery({
        queryKey: ["teams", id],
        queryFn: async () => {
            const res = await axiosClient.get(`/auction/${id}/teams`);
            return res.data.data;
        },
    });
};

export const useDeleteTeam = (auctionId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (teamId) => {
            const res = await axiosClient.delete(
                `/auction/${auctionId}/teams/${teamId}`
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Team deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
    });
};

export const useCreateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post(
                `/auction/${data.auctionId}/teams`,
                data
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Team added successfully");
            queryClient.invalidateQueries({ queryKey: ["auction"] });
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });
};
