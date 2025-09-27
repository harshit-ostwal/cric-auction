import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const auctionStats = await prisma.auction.findMany({
            select: {
                id: true,
                auctionDate: true,
                auctionTime: true,
                createdAt: true,
            },
        });

        const now = new Date();

        const getAuctionStatus = (auction) => {
            if (!auction.auctionDate || !auction.auctionTime) {
                return "UPCOMING";
            }

            const auctionDateTime = new Date(
                `${auction.auctionDate}T${auction.auctionTime}`
            );

            const auctionEndTime = new Date(
                auctionDateTime.getTime() + 4 * 60 * 60 * 1000
            );

            if (now < auctionDateTime) {
                return "UPCOMING";
            } else if (now >= auctionDateTime && now <= auctionEndTime) {
                return "ONGOING";
            } else {
                return "COMPLETED";
            }
        };

        let totalUpcomingAuctions = 0;
        let totalOngoingAuctions = 0;
        let totalCompletedAuctions = 0;

        auctionStats.forEach((auction) => {
            const status = getAuctionStatus(auction);
            switch (status) {
                case "UPCOMING":
                    totalUpcomingAuctions++;
                    break;
                case "ONGOING":
                    totalOngoingAuctions++;
                    break;
                case "COMPLETED":
                    totalCompletedAuctions++;
                    break;
            }
        });

        return NextResponse.json(
            {
                data: {
                    auctionStats: auctionStats.length,
                    totalOngoingAuctions,
                    totalUpcomingAuctions,
                    totalCompletedAuctions,
                },
                success: true,
                message: "Auction stats retrieved successfully",
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
