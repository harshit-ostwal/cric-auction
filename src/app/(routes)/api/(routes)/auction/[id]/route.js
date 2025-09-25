import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const auction = await prisma.auction.findUnique({
            where: { id },
        });

        if (!auction) {
            return NextResponse.json(
                { success: false, message: "Auction not found" },
                { status: 404 }
            );
        }

        if (auction.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                data: auction,
                success: true,
                message: "Auction retrieved successfully",
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

        const { id } = params;

        const auction = await prisma.auction.findUnique({
            where: { id },
        });

        if (!auction) {
            return NextResponse.json(
                { success: false, message: "Auction not found" },
                { status: 404 }
            );
        }

        if (auction.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        await prisma.auction.delete({
            where: { id },
        });

        return NextResponse.json(
            { success: true, message: "Auction deleted successfully" },
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
        const { id } = params;

        const auction = await prisma.auction.findUnique({
            where: { id },
        });

        if (!auction) {
            return NextResponse.json(
                { success: false, message: "Auction not found" },
                { status: 404 }
            );
        }

        if (auction.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await req.json();

        const updatedAuction = await prisma.auction.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(
            {
                data: updatedAuction,
                success: true,
                message: "Auction updated successfully",
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
