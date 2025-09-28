import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteImage = () => {
    return useMutation({
        mutationKey: ["delete-image"],
        mutationFn: async (publicId) => {
            const res = await axiosClient.post("/upload/delete-image", {
                publicId,
            });
            return res.data;
        },
    });
};
