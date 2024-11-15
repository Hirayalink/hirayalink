import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, inKind, specifications, ...otherFields } = body;

  try {
    const updatedPost = await prisma.barangayRequestPost.update({
      where: { id },
      data: {
        inKind: JSON.stringify(inKind),
        specifications: JSON.stringify(specifications),
        ...otherFields,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating BarangayRequestPost:", error);
    return NextResponse.json({ error: "Failed to update BarangayRequestPost" }, { status: 500 });
  }
}
