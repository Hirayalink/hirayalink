import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id; // Keep postId as a string (UUID)
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  try {
    const user = await prisma.donor.findUnique({
      where: { contactNumber: session?.user?.contactNumber },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    if (type === "barangay") {
      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          barangayRequestPostId: postId,
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        return NextResponse.json({ liked: false });
      } else {
        await prisma.like.create({
          data: {
            userId,
            barangayRequestPostId: postId,
          },
        });
        return NextResponse.json({ liked: true });
      }
    }

    if (type === "recipient") {
      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          recipientRequestPostId: postId,
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        return NextResponse.json({ liked: false });
      } else {
        await prisma.like.create({
          data: {
            userId,
            recipientRequestPostId: postId,
          },
        });
        return NextResponse.json({ liked: true });
      }
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Error toggling like" }, { status: 500 });
  }
}
