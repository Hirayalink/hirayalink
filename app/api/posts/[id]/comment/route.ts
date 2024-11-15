import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const postId = params.id; 
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const { content } = await request.json();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.contactNumber) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find the user by their contact number
    const user = await prisma.donor.findUnique({
      where: { contactNumber: session.user.contactNumber },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (type === 'recipient') {
      const comment = await prisma.comment.create({
        data: {
          content,
          userId: user.id,
          recipientRequestPostId: postId, // Use postId directly as a string
        },
      });
      return NextResponse.json(comment);
    } else if (type === 'barangay') {
      const comment = await prisma.comment.create({
        data: {
          content,
          userId: user.id,
          barangayRequestPostId: postId, // Use postId directly as a string
        },
      });
      return NextResponse.json(comment);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Error adding comment' }, { status: 500 });
  }
}
