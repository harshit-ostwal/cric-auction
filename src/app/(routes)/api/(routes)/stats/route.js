import prisma from "@/lib/prisma";
import { hasPermission } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = { role: "user" };

        if (!hasPermission(user.role, "read")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const users = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!users) {
            return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        const auctionStats = await prisma.auction.findMany({
            where: { userId: users.id },
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
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
