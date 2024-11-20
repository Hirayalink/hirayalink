import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the admin's details
    const admin = await prisma.admin.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        barangayId: true,
        barangay: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const barangayId = admin.barangayId;

    // Fetch data for the report
    const recipientRequests = await prisma.recipientRequestPost.findMany({
      where: { barangayId },
      orderBy: { dateTime: 'desc' },
    });

    const barangayRequests = await prisma.barangayRequestPost.findMany({
      where: { barangayId },
      orderBy: { dateTime: 'desc' },
    });

    const donations = await prisma.donation.findMany({
      where: { barangayId },
      include: { donationItems: true },
      orderBy: { createdAt: 'desc' },
    });

    const calamityImpacts = await prisma.calamityImpact.findMany({
      where: { barangayId },
      orderBy: { createdAt: 'desc' },
    });

    const successStories = await prisma.successStory.findMany({
      where: { barangayId },
      orderBy: { createdAt: 'desc' },
    });

    // Add this after fetching the data for each category
    const totalRecipientRequests = recipientRequests.length;
    const totalBarangayRequests = barangayRequests.length;
    const totalDonations = donations.length;
    const totalCalamityImpacts = calamityImpacts.length;
    const totalSuccessStories = successStories.length;

    // Include totals in the response
    return NextResponse.json({
      admin,
      recipientRequests,
      barangayRequests,
      donations,
      calamityImpacts,
      successStories,
      totals: {
        totalRecipientRequests,
        totalBarangayRequests,
        totalDonations,
        totalCalamityImpacts,
        totalSuccessStories,
      },
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { error: "Failed to fetch report data", details: error },
      { status: 500 }
    );
  }
}
