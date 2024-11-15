import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limitNumber = parseInt(url.searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limitNumber;

  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const calamityType = url.searchParams.get("calamityType");

  if (isNaN(page) || isNaN(limitNumber)) {
    throw new Error("Invalid pagination parameters.");
  }

  try {
    const barangay = await prisma.barangay.findUnique({
      where: {
        name: session?.user?.brgyName,
      },
      select: {
        id: true,
      },
    });

    const filters: any = {
      barangayId: barangay?.id,
    };

    if (startDate && endDate) {
      filters.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (calamityType) {
      filters.typeOfCalamity = calamityType;
    }

    const requests = await prisma.recipientRequestPost.findMany({
      where: filters,
      skip: offset,
      take: limitNumber,
      select: {
        id: true,
        completeName: true,
        area: true,
        typeOfCalamity: true,
        dateTime: true,
        inKindNecessities: true,
        specifications: true,
      },
    });

    const totalRequests = await prisma.recipientRequestPost.count({
      where: filters,
    });

    return NextResponse.json({
      requests,
      totalPages: Math.ceil(totalRequests / limitNumber),
    });
  } catch (error) {
    console.error("Error fetching requests:", error); // Enhanced error logging
    return NextResponse.json(
      { error: "Failed to fetch requests", details: error }, // Include error details
      { status: 500 }
    );
  }
}
