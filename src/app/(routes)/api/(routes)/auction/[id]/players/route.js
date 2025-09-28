import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const auction = await prisma.auction.findFirst({
            where: {
                id,
            },
        });

        if (!auction) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Auction not found or unauthorized",
                },
                { status: 404 }
            );
        }

        const players = await prisma.player.findMany({
            where: {
                auctionId: id,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            {
                data: players,
                success: true,
                message: "Players retrieved successfully",
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

        const auction = await prisma.auction.findFirst({
            where: {
                id: body.auctionId,
                userId: session.user.id,
            },
        });

        if (!auction) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Auction not found or unauthorized",
                },
                { status: 404 }
            );
        }
        const player = await prisma.player.create({
            data: {
                ...body,
            },
        });

        if (!player) {
            return NextResponse.json(
                { success: false, message: "Player creation failed" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                data: player,
                success: true,
                message: "Player created successfully",
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
