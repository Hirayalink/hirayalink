import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const donations = await prisma.donation.findMany({
      include: {
        BarangayRequestPost: true, // Include the related BarangayRequestPost
        donor: true,
        donationItems: true,
        statusLogs: true,
      },
    });

    // Group donations by barangayRequestPostId
    const groupedDonations = donations.reduce((acc: any, donation: any) => {
      const postId = donation.barangayRequestPostId;
      if (!acc[postId]) {
        acc[postId] = {
          post: donation.BarangayRequestPost,
          donations: [],
        };
      }
      acc[postId].donations.push(donation);
      return acc;
    }, {});

    return NextResponse.json(groupedDonations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations", details: error },
      { status: 500 }
    );
  }
}
