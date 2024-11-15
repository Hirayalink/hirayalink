import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const post = await prisma.barangayRequestPost.findUnique({
      where: { id }, // id is already a string, no need for conversion
      include: {
        likes: true,
        comments: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching barangay request post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post details", details: error },
      { status: 500 }
    );
  }
}
