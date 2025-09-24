import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useStats = () => {
    return useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await axiosClient.get("/stats");
            return res.data;
        },
    });
};
