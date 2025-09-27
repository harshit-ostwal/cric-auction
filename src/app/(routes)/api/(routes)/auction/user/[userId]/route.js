import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(routes)/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const auctions = await prisma.auction.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            {
                data: auctions,
                success: true,
                message: "Auctions retrieved successfully",
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
