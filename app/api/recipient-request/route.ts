import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const completeName = formData.get("completeName") as string;
    const age = parseInt(formData.get("age") as string);
    const noOfFamilyMembers = parseInt(
      formData.get("noOfFamilyMembers") as string
    );
    const contactNumber = formData.get("contactNumber") as string;
    const emailAddress = formData.get("emailAddress") as string;
    const barangayId = formData.get("barangayId") as string;
    const area = formData.get("area") as string;
    const typeOfCalamity = formData.get("typeOfCalamity") as string;
    const inKindNecessities = formData.get("inKindNecessities") as string;
    const specifications = formData.get("specifications") as string;
    const proofOfResidence = formData.get("proofOfResidence") as File;

    let proofOfResidenceBuffer: Buffer | null = null;
    if (proofOfResidence) {
      const arrayBuffer = await proofOfResidence.arrayBuffer();
      proofOfResidenceBuffer = Buffer.from(arrayBuffer);
    }

    const newPost = await prisma.recipientRequestPost.create({
      data: {
        completeName,
        age,
        area,
        noOfFamilyMembers,
        contactNumber,
        emailAddress,
        typeOfCalamity,
        inKindNecessities,
        specifications,
        uploadedPhoto: proofOfResidenceBuffer,
        barangayId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating recipient request post:", error);
    return NextResponse.json(
      { error: "Failed to create recipient request post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
