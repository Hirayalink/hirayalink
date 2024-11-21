import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Helper function to safely parse numbers
    const getNumberValue = (value: FormDataEntryValue | null) => {
      const strValue = value as string;
      return strValue && strValue !== "" ? parseInt(strValue) : 0;
    };

    const newPost = await prisma.recipientRequestPost.create({
      data: {
        completeName: formData.get("completeName") as string,
        age: getNumberValue(formData.get("age")),
        area: formData.get("area") as string,
        noOfFamilyMembers: getNumberValue(formData.get("noOfFamilyMembers")),
        numberOfChildren: getNumberValue(formData.get("numberOfChildren")),
        ageGroupInfant: getNumberValue(formData.get("ageGroupInfant")),
        ageGroupEarlyChild: getNumberValue(formData.get("ageGroupEarlyChild")),
        ageGroupMiddleChild: getNumberValue(
          formData.get("ageGroupMiddleChild")
        ),
        ageGroupAdolescent: getNumberValue(formData.get("ageGroupAdolescent")),
        contactNumber: formData.get("contactNumber") as string,
        emailAddress: (formData.get("emailAddress") as string) || null,
        typeOfCalamity: formData.get("typeOfCalamity") as string,
        inKindNecessities: formData.get("inKindNecessities") as string,
        specifications: formData.get("specifications") as string,
        uploadedPhoto: await (async () => {
          const file = formData.get("proofOfResidence") as File;
          if (file) {
            const arrayBuffer = await file.arrayBuffer();
            return Buffer.from(arrayBuffer);
          }
          return null;
        })(),
        barangayId: formData.get("barangayId") as string,
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
