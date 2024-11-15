import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, items } = await request.json();

    const post = await prisma.barangayRequestPost.findUnique({
      where: { id: postId },
      include: { Barangay: true },
    });

    if (!post || !post.barangayId) {
      return NextResponse.json({ error: "Invalid post or barangay" }, { status: 404 });
    }

    // Generate formatted control number
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const controlNumber = `DON-${dateStr}-${randomNum}`;

    const donation = await prisma.donation.create({
      data: {
        controlNumber: controlNumber,
        donorId: session.user.id,
        barangayId: post.barangayId, // Use the barangayId from the post
        barangayRequestPostId: postId, // Add this line to associate the donation with the BarangayRequestPost
        donationStatus: "PLEDGED",
        donationItems: {
          create: items.map((item: any) => ({
            itemName: item.name,
            quantity: item.quantity,
          })),
        },
        statusLogs: {
          create: {
            status: "PLEDGED",
            remarks: "Initial pledge",
          },
        },
      },
      include: {
        donationItems: true,
        statusLogs: true,
        barangay: true,
        donor: true,
      },
    });

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { error: "Failed to create donation", details: error },
      { status: 500 }
    );
  }
}
