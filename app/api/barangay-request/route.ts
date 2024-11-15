import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const barangayArea = formData.get("barangayArea") as string;
    const area = formData.get("area") as string;
    const calamityType = formData.get("calamityType") as string;
    const contactPerson = formData.get("contactPerson") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const donationDropOff = formData.get("donationDropOff") as string;
    const donationLandmark = formData.get("donationLandmark") as string;
    const necessities = formData.get("necessities") as string;
    const specifications = formData.get("specifications") as string;
    const proofFile = formData.get("proofFile") as File;
    
    // Safely parse batchNumber to integer
    const batchNumberRaw = formData.get("batchNumber");
    const batchNumber = batchNumberRaw ? parseInt(batchNumberRaw.toString(), 10) : 0;

    // Validate batchNumber
    if (isNaN(batchNumber)) {
      return NextResponse.json(
        { error: "Invalid batch number" },
        { status: 400 }
      );
    }

    let proofFileBuffer: Buffer | null = null;
    if (proofFile) {
      const arrayBuffer = await proofFile.arrayBuffer();
      proofFileBuffer = Buffer.from(arrayBuffer);
    }

    const barangay = await prisma.barangay.findUnique({
      where: {
        name: barangayArea,
      },
      select: {
        id: true,
      },
    });

    const newPost = await prisma.barangayRequestPost.create({
      data: {
        area,
        typeOfCalamity: calamityType,
        person: contactPerson,
        contactNumber,
        dropOffAddress: donationDropOff,
        dropOffLandmark: donationLandmark,
        inKind: JSON.parse(necessities),
        specifications: JSON.parse(specifications),
        batchNumber, // Now properly typed as Int
        image: proofFileBuffer,
        Barangay: {
          connect: {
            id: barangay?.id
          }
        }
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating barangay request post:", error);
    return NextResponse.json(
      { error: "Failed to create barangay request post" },
      { status: 500 }
    );
  }
}
