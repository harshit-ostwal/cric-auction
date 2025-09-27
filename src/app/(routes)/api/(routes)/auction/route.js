import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const auctions = await prisma.auction.findMany();

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

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const first = Math.floor(10000 + Math.random() * 90000);
        const second = Math.floor(100 + Math.random() * 900);
        const code = `${first}${second}`;

        const exists = await prisma.auction.findUnique({
            where: { auctionCode: code },
        });

        if (exists) {
            return NextResponse.json(
                { success: false, message: "Please try again" },
                { status: 400 }
            );
        }

        body.auctionCode = code;

        const auction = await prisma.auction.create({
            data: {
                ...body,
                userId: session.user.id,
            },
        });

        if (!auction) {
            return NextResponse.json(
                { success: false, message: "Auction creation failed" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                data: auction,
                success: true,
                message: "Auction created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
