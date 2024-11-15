import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the authenticated user is requesting their own profile
  if (session?.user?.id !== params.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const profile = await prisma.donor.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        orgName: true,
        contactNumber: true,
        address: true,
        donations: {
          select: {
            id: true,
            controlNumber: true,
            donationStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching donor profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, orgName, contactNumber, address, password } = await request.json();

    const donor = await prisma.donor.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!donor) {
      return NextResponse.json({ message: 'Donor not found' }, { status: 404 });
    }

    const isPasswordValid = await verifyPassword(password, donor.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    const updatedDonor = await prisma.donor.update({
      where: { id },
      data: {
        name,
        orgName,
        contactNumber,
        address,
      },
      select: {
        id: true,
        name: true,
        orgName: true,
        contactNumber: true,
        address: true,
        donations: {
          select: {
            id: true,
            controlNumber: true,
            donationStatus: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(updatedDonor);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the profile' },
      { status: 500 }
    );
  }
}
