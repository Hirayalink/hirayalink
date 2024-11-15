import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { barangayId, area, nameOfCalamity, storyText, createdAt, image } =
      await req.json();

    // Create a new calamity impact record
    const calamityImpact = await prisma.calamityImpact.create({
      data: {
        barangayId,
        area,
        nameOfCalamity,
        storyText,
        createdAt: new Date(createdAt), // Ensure createdAt is a Date object
        image: image ? Buffer.from(image, "base64") : null, // Ensure image is processed correctly
      },
    });

    return NextResponse.json(calamityImpact);
  } catch (error) {
    console.error("Error in POST /api/calamity-impact:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
