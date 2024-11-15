import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminId = session.user.id;

    // Fetch admin's barangay number
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { 
        barangayId: true,
        barangay: {
          select: {
            name: true
          }
        }
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Fetch barangay request posts for this admin
    const barangayRequestPosts = await prisma.barangayRequestPost.findMany({
      where: { barangayId: admin.barangayId },
      select: {
        id: true,
        dateTime: true,
        area: true,
        barangayId: true,
        typeOfCalamity: true,
        batchNumber: true, // Include batchNumber here
        donations: {
          select: {
            donorId: true,
            controlNumber: true,
          },
        },
      },
      orderBy: { dateTime: 'desc' },
    });

    // Map posts to include unique donorIds
    const postsWithDonorIds = await Promise.all(
      barangayRequestPosts.map(async (post: any) => {
        const donorIds = Array.from(new Set(post.donations.map((donation: any) => donation.donorId))); // Get unique donorIds
        const controlNumbers = Array.from(new Set(post.donations.map((donation: any) => donation.controlNumber))); // Get unique controlNumbers
        return { ...post, donorIds, controlNumbers };
      })
    );

    return NextResponse.json({ 
      barangayId: admin.barangayId, 
      barangayName: admin.barangay.name,
      barangayRequestPosts: postsWithDonorIds 
    });
  } catch (error) {
    console.error('Error in GET /api/success-stories:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      postId, // Ensure postId is included in the request body
      nameOfCalamity,
      controlNumber,
      batchNumber,
      numberOfRecipients,
      storyText,
      image,
    } = await req.json();

    // Fetch the BarangayRequestPost to get the barangayId and area
    const barangayRequestPost = await prisma.barangayRequestPost.findUnique({
      where: { id: postId },
      select: { barangayId: true, area: true }, // Get both barangayId and area
    });

    if (!barangayRequestPost) {
      return NextResponse.json({ error: 'Invalid Barangay Request Post ID' }, { status: 404 });
    }

    // Fetch donorIds based on the postId
    const donorIds = await prisma.donation.findMany({
      where: {
        barangayRequestPostId: postId,
        donationStatus: {
          in: ['COLLECTED', 'PROCESSING', 'IN_TRANSIT', 'RECEIVED'],
        },
      },
      select: {
        donorId: true,
      },
    });

    // Extract all donorIds without uniqueness check
    const allDonorIds = donorIds.map((donation: any) => donation.donorId).join('; ');

    // Create success story
    const successStory = await prisma.successStory.create({
      data: {
        area: barangayRequestPost.area, // Use area from the fetched post
        barangayId: barangayRequestPost.barangayId, // Set the barangayId from the fetched post
        nameOfCalamity,
        controlNumber,
        transactionIds: allDonorIds, // Use all donorIds without filtering
        batchNumber, // Ensure this is being set correctly
        numberOfRecipients: parseInt(numberOfRecipients),
        storyText,
        image: image ? Buffer.from(image, 'base64') : null,
      },
    });

    return NextResponse.json(successStory);
  } catch (error) {
    console.error('Error in POST /api/success-stories:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
