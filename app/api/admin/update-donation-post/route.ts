import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, person, contactNumber, inKind, specifications, area, typeOfCalamity } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const updatedPost = await prisma.barangayRequestPost.update({
      where: { id },
      data: {
        person,
        contactNumber,
        inKind,
        specifications,
        area,
        typeOfCalamity,
      },
    });

    console.log(updatedPost);
    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'An error occurred while updating the post' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
