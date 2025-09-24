import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const user = { role: "user" };

        if (!hasPermission(user.role, "read")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
