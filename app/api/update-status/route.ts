import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { donationId, donationIds, status, remarks } = await request.json();

    // Handle single donation update
    if (donationId) {
      const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: {
          donationStatus: status,
          statusLogs: {
            create: {
              status,
              remarks,
            },
          },
        },
        include: {
          statusLogs: true,
          donationItems: true,
        },
      });

      return NextResponse.json(updatedDonation);
    }

    // Handle bulk donation updates
    if (Array.isArray(donationIds) && donationIds.length > 0) {
      const updatedDonations = await prisma.$transaction(
        donationIds.map((id) =>
          prisma.donation.update({
            where: { id },
            data: {
              donationStatus: status,
              statusLogs: {
                create: {
                  status,
                  remarks,
                },
              },
            },
            include: {
              statusLogs: true,
              donationItems: true,
            },
          })
        )
      );

      return NextResponse.json(updatedDonations);
    }

    return NextResponse.json(
      { error: "Invalid request: Missing donationId or donationIds" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating donation status:", error);
    return NextResponse.json(
      { error: "Failed to update donation status", details: error },
      { status: 500 }
    );
  }
}



