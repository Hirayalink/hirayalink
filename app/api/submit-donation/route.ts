import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

function generateControlNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const randomFactor = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number

  return `DON-${year}${month}${day}-${randomFactor}`;
}

export async function POST(req: NextRequest) {
  try {
    const { donorId, barangayId, barangayRequestPostId, items } = await req.json();

    let controlNumber;
    let isUnique = false;

    // Keep generating control numbers until we get a unique one
    while (!isUnique) {
      controlNumber = generateControlNumber();
      const existingDonation = await prisma.donation.findUnique({
        where: { controlNumber },
      });
      if (!existingDonation) {
        isUnique = true;
      }
    }

    const donation = await prisma.donation.create({
      data: {
        controlNumber: controlNumber || "",
        donorId,
        barangayId,
        barangayRequestPostId,
        donationStatus: "PLEDGED",
        donationItems: {
          create: items.map((item: { itemName: string; quantity: number }) => ({
            itemName: item.itemName,
            quantity: item.quantity,
          })),
        },
        statusLogs: {
          create: {
            status: "PLEDGED",
            remarks: "Donation pledged",
          },
        },
      },
      include: {
        donationItems: true,
        statusLogs: true,
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Error submitting donation:", error);
    return NextResponse.json({ message: "Error submitting donation" }, { status: 500 });
  }
}
