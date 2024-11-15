import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { name, barangayName, contactNumber, address, password } = await req.json();

  // Validate input
  if (!name || !barangayName || !contactNumber || !address || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    // Check if barangay already exists
    const existingBarangay = await prisma.barangay.findUnique({
      where: { name: barangayName },
    });

    if (existingBarangay) {
      return NextResponse.json(
        { message: "A barangay with this name already exists" },
        { status: 400 }
      );
    }

    const barangay = await prisma.barangay.create({
      data: {
        name: barangayName,
      },
    });

		const hashedPassword = await hashPassword(password);

		const admin = await prisma.admin.create({
			data:{
				name,
				contactNumber,
        address,
        password: hashedPassword,
        barangayId: barangay.id,
      },
    });

    return NextResponse.json({ message: 'Admin created successfully', admin }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Handle any other HTTP method
export async function OPTIONS(req: Request) {
  return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
}
