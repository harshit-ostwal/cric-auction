import { z } from "zod/v4";

export const createAuctionSchema = z.object({
    auctionLogo: z
        .url({ error: "Please enter a valid URL for the logo" })
        .optional()
        .or(z.literal("")),

    auctionName: z
        .string({ error: "Auction name is required" })
        .min(3, { error: "Auction name must be at least 3 characters" })
        .max(100, { error: "Auction name must be at most 100 characters" })
        .trim(),

    auctionDate: z.coerce.date({ error: "Auction date is required" }),

    auctionTime: z
        .string({ error: "Auction time is required" })
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            error: "Please enter a valid time in HH:MM format",
        }),

    teamPoints: z.coerce
        .number({ error: "Team points is required" })
        .min(0, { error: "Team points must be a positive number" })
        .max(10000000, { error: "Team points cannot exceed 10,000,000" }),

    minimumBid: z.coerce
        .number({ error: "Minimum bid is required" })
        .min(100, { error: "Minimum bid must be at least 1,000" })
        .max(10000000, { error: "Minimum bid cannot exceed 10,000,000" }),

    bidIncreaseBy: z.coerce
        .number({ error: "Bid increase amount is required" })
        .min(100, { error: "Bid increase amount must be at least 100" })
        .max(10000000, { error: "Bid increase amount cannot exceed 100,000" }),

    playerPerTeam: z.coerce
        .number({ error: "Players per team is required" })
        .min(5, { error: "At least 5 players per team required" })
        .max(25, { error: "Maximum 25 players per team allowed" }),

    venue: z
        .string({ error: "Venue is required" })
        .min(3, { error: "Venue must be at least 3 characters" })
        .max(200, { error: "Venue must be at most 200 characters" })
        .trim(),

    status: z
        .enum(["UPCOMING", "ONGOING", "COMPLETED"], {
            error: "Auction status is required",
        })
        .default("UPCOMING"),
});
