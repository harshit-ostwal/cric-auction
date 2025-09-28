import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: auctionId, teamId } = await params;

        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                auctionId: auctionId,
            },
            include: {
                auction: true,
            },
        });

        if (!team) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Team not found",
                },
                { status: 404 }
            );
        }

        if (team.auction.userId !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized to delete this team",
                },
                { status: 403 }
            );
        }

        await prisma.team.delete({
            where: {
                id: teamId,
            },
        });

        return NextResponse.json(
            { success: true, message: "Team deleted successfully" },
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

        const { id: auctionId, teamId } = await params;
        const body = await req.json();

        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                auctionId: auctionId,
            },
            include: {
                auction: true,
            },
        });

        if (!team) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Team not found",
                },
                { status: 404 }
            );
        }

        if (team.auction.userId !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized to update this team",
                },
                { status: 403 }
            );
        }

        const updatedTeam = await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                ...body,
            },
        });

        return NextResponse.json(
            {
                data: updatedTeam,
                success: true,
                message: "Team updated successfully",
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
