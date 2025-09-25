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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const auctionStats = await prisma.auction.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json(
            {
                data: {
                    auctionStats: auctionStats.length,
                    totalOngoingAuctions: auctionStats.filter(
                        (auction) => auction.status === "ONGOING"
                    ).length,
                    totalUpcomingAuctions: auctionStats.filter(
                        (auction) => auction.status === "UPCOMING"
                    ).length,
                    totalCompletedAuctions: auctionStats.filter(
                        (auction) => auction.status === "COMPLETED"
                    ).length,
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
