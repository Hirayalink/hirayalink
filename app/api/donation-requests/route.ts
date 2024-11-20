import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

// Add proper types for the data structures
interface BarangayData {
  typeOfCalamity: string;
  Barangay: {
    name: string | null;
  } | null;
  dateTime: Date;
}

interface RequestData extends BarangayData {
  id: string;
  completeName: string;
  area: string;
  inKindNecessities: string;
  specifications: string;
}

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

    const timeFilter =
      startDate && endDate
        ? {
            dateTime: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {};

    const allBarangaysData = await prisma.recipientRequestPost.findMany({
      where: timeFilter,
      select: {
        typeOfCalamity: true,
        Barangay: {
          select: {
            name: true,
          },
        },
        dateTime: true,
      },
    });

    const requests = await prisma.recipientRequestPost.findMany({
      where: {
        ...timeFilter,
        barangayId: barangay?.id,
        ...(calamityType ? { typeOfCalamity: calamityType } : {}),
      },
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
        Barangay: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalRequests = await prisma.recipientRequestPost.count({
      where: {
        ...timeFilter,
        barangayId: barangay?.id,
        ...(calamityType ? { typeOfCalamity: calamityType } : {}),
      },
    });

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newRequestsCount = await prisma.recipientRequestPost.count({
      where: {
        barangayId: barangay?.id,
        dateTime: {
          gte: last24Hours,
        },
      },
    });

    const calamityImpact = processCalamityImpact(allBarangaysData);
    const barangayCalamityData =
      processBarangayMostRequestedCalamity(allBarangaysData);
    const inKindByCalamityData = processInKindByCalamity(requests);

    return NextResponse.json({
      requests,
      allBarangaysData,
      calamityImpact,
      barangayCalamityData,
      inKindByCalamityData,
      totalPages: Math.ceil(totalRequests / limitNumber),
      totalRequests,
      newRequestsCount,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests", details: error },
      { status: 500 }
    );
  }
}

function processCalamityImpact(data: BarangayData[]) {
  const impactMap = new Map<string, Map<string, number>>();

  data.forEach((record) => {
    const calamityType = record.typeOfCalamity;
    const barangayName = record.Barangay?.name || "Unknown";

    if (!impactMap.has(calamityType)) {
      impactMap.set(calamityType, new Map());
    }

    const barangayMap = impactMap.get(calamityType)!;
    barangayMap.set(barangayName, (barangayMap.get(barangayName) || 0) + 1);
  });

  return Array.from(impactMap.entries()).map(([calamityType, barangayMap]) => {
    const [mostImpacted] = Array.from(
      barangayMap.entries()
    ).sort((a, b) => b[1] - a[1]) as [string, number][];

    return {
      calamityType,
      mostImpactedBarangay: {
        name: mostImpacted[0],
        count: mostImpacted[1],
      },
    };
  });
}

function processBarangayMostRequestedCalamity(data: BarangayData[]) {
  const barangayMap = new Map<string, Map<string, number>>();

  data.forEach((record) => {
    const barangayName = record.Barangay?.name || "Unknown";
    const calamityType = record.typeOfCalamity;

    if (!barangayMap.has(barangayName)) {
      barangayMap.set(barangayName, new Map());
    }

    const calamityMap = barangayMap.get(barangayName)!;
    calamityMap.set(calamityType, (calamityMap.get(calamityType) || 0) + 1);
  });

  return Array.from(barangayMap.entries()).map(
    ([barangayName, calamityMap]) => {
      const [mostRequested] = Array.from(
        calamityMap.entries()
      ).sort((a, b) => b[1] - a[1]) as [string, number][];

      return {
        barangayName,
        mostRequestedCalamity: {
          type: mostRequested[0],
          count: mostRequested[1],
        },
      };
    }
  );
}

function processInKindByCalamity(data: RequestData[]) {
  const calamityInKindMap = new Map<string, Map<string, number>>();

  data.forEach((record) => {
    if (!record.inKindNecessities) {
      console.log("Missing inKindNecessities for record:", record);
      return;
    }

    const calamityType = record.typeOfCalamity;
    const inKindItems = record.inKindNecessities
      .split(",")
      .map((item: string) => item.trim());

    if (!calamityInKindMap.has(calamityType)) {
      calamityInKindMap.set(calamityType, new Map<string, number>());
    }

    const itemMap = calamityInKindMap.get(calamityType)!;
    inKindItems.forEach((item: string) => {
      itemMap.set(item, (itemMap.get(item) || 0) + 1);
    });
  });

  return Array.from(calamityInKindMap.entries()).map(
    ([calamityType, itemMap]) => {
      const sortedItems = Array.from(itemMap.entries()).sort(
        ([, a], [, b]) => b - a
      );

      // Handle case where there might be no items
      if (sortedItems.length === 0) {
        return {
          calamityType,
          mostRequestedItem: null,
          count: 0,
        };
      }

      const [mostRequested] = sortedItems;

      return {
        calamityType,
        mostRequestedItem: mostRequested[0],
        count: mostRequested[1],
      };
    }
  );
}
