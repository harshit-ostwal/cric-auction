import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0, // 👈 Always stale → always refetch
            refetchOnWindowFocus: false, // 👈 Optional: Don' t spam refetch on tab switch
            retry: 1, // 👈 1 retry only, safe
        },
    },
});
