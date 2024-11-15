import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const area = url.searchParams.get("area") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;
  const session = await getServerSession(authOptions);
  const userContactNumber = session?.user?.contactNumber;

  try {
    const user = await prisma.donor.findUnique({
      where: {
        contactNumber: userContactNumber,
      },
      select: {
        id: true,
      },
    });

    let posts;
    let totalPosts;

    const whereCondition = area ? { Barangay: { name: area } } : {};

    if (type === "barangay") {
      posts = await prisma.barangayRequestPost.findMany({
        where: whereCondition,
        orderBy: {
          dateTime: "desc",
        },
        skip: offset,
        take: limit,
        include: {
          likes: {
            select: {
              id: true,
              userId: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          Barangay: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      totalPosts = await prisma.barangayRequestPost.count({
        where: whereCondition,
      });
    } else if (type === "recipient") {
      posts = await prisma.recipientRequestPost.findMany({
        where: whereCondition,
        orderBy: {
          dateTime: "desc",
        },
        skip: offset,
        take: limit,
        include: {
          likes: {
            select: {
              id: true,
              userId: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  orgName: true,
                },
              },
            },
          },
          Barangay: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      totalPosts = await prisma.recipientRequestPost.count({
        where: whereCondition,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    // Add likedByUser property
    const postsWithLikes = posts.map((post: any) => ({
      ...post,
      likedByUser: post.likes.some((like: any) => like.userId === user?.id),
      barangayName: post.Barangay.name,
    }));

    const hasMore = offset + posts.length < totalPosts;

    return NextResponse.json({ posts: postsWithLikes, hasMore });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
