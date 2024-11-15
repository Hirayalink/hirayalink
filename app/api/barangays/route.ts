import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  try {
    const barangays = await prisma.barangay.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(barangays, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return NextResponse.json(
      { error: "Error fetching barangays" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
