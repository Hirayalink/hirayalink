import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const barangayRequests = await prisma.barangayRequestPost.findMany({
      orderBy: {
        dateTime: 'desc',
      },
    });

    const formattedRequests = barangayRequests.map((request: any) => ({
      ...request,
      uploadedPhoto: request.image ? Buffer.from(request.image).toString('base64') : null,
      dateTime: request.dateTime.toISOString(),
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching recipient requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
