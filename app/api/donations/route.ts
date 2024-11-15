import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const isFeed = searchParams.get("isFeed");
  const isAdmin = session.user.userType === "admin";

  try {
    let posts;

    if (isAdmin) {
      const admin = await prisma.admin.findUnique({
        where: { id: session.user.id },
        select: { barangayId: true },
      });

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }

      posts = await prisma.barangayRequestPost.findMany({
        where: { barangayId: admin.barangayId },
        include: {
          donations: {
            include: {
              statusLogs: true,
              donationItems: true,
              donor: true,
            },
          },
          Barangay: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { dateTime: "desc" },
      });

      // Transform the data to include the required fields
      posts = posts.map((post: any) => ({
        ...post,
        barangayName: post.Barangay?.name || "Unknown",
        contactPerson: post.person, // 'person' field is used as contact person
        area: post.area,
        typeOfCalamity: post.typeOfCalamity,
      }));
    } else if (isFeed && postId) {
      posts = await prisma.donation.findMany({
        where: { barangayRequestPostId: postId },
        include: {
          statusLogs: true,
          donationItems: true,
          barangay: true,
          donor: true,
        },
      });
    } else {
      // Donor view: fetch all donations for the donor
      posts = await prisma.donation.findMany({
        where: { donorId: session.user.id },
        include: {
          statusLogs: true,
          donationItems: true,
          barangay: true,
          donor: true,
          BarangayRequestPost: {
            include: {
              Barangay: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching barangay request posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch barangay request posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
