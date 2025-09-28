import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const { publicId } = await req.json();

        if (!publicId) {
            return NextResponse.json(
                { error: "Public ID is required" },
                { status: 400 }
            );
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok") {
            return NextResponse.json({
                message: "Image deleted successfully",
                result,
            });
        } else {
            return NextResponse.json(
                { error: "Failed to delete image", result },
                { status: 400 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
