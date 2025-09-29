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

        const teams = await prisma.team.findMany({
            where: {
                auctionId: id,
            },
            include: {
                players: true,
                bidders: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            {
                data: teams,
                success: true,
                message: "Teams retrieved successfully",
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
        const team = await prisma.team.create({
            data: {
                ...body,
                auctionId: body.auctionId,
            },
            include: {
                players: true,
                bidders: true,
            },
        });

        if (!team) {
            return NextResponse.json(
                { success: false, message: "Team creation failed" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                data: team,
                success: true,
                message: "Team created successfully",
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
