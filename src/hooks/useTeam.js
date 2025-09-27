"use client";
import axiosClient from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

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
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            router.refresh();
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });
};
