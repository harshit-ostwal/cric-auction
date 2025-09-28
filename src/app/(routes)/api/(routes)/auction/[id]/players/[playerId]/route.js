import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: auctionId, playerId } = await params;

        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                auctionId: auctionId,
            },
        });

        if (!player) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Player not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: player,
                success: true,
                message: "Player fetched successfully",
            },
            { status: 200 }
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

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: auctionId, playerId } = await params;

        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                auctionId: auctionId,
            },
            include: {
                auction: true,
            },
        });

        if (!player) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Player not found",
                },
                { status: 404 }
            );
        }

        if (player.auction.userId !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized to delete this player",
                },
                { status: 403 }
            );
        }

        await prisma.player.delete({
            where: {
                id: playerId,
            },
        });

        return NextResponse.json(
            { success: true, message: "Player deleted successfully" },
            { status: 200 }
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

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: auctionId, playerId } = await params;
        const body = await req.json();

        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                auctionId: auctionId,
            },
            include: {
                auction: true,
            },
        });

        if (!player) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Player not found",
                },
                { status: 404 }
            );
        }

        if (player.auction.userId !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized to update this player",
                },
                { status: 403 }
            );
        }

        const updatedPlayer = await prisma.player.update({
            where: {
                id: playerId,
            },
            data: {
                ...body,
            },
        });

        return NextResponse.json(
            {
                data: updatedPlayer,
                success: true,
                message: "Player updated successfully",
            },
            { status: 200 }
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
