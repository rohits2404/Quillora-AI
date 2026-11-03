import { NextResponse } from "next/server";
import ImageKit from "@imagekit/nodejs";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const fileName = formData.get("fileName");

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json(
                { success: false, error: "No Valid File Provided" },
                { status: 400 },
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { success: false, error: "Only Image Files Are Allowed" },
                { status: 400 },
            );
        }

        const timestamp = Date.now();

        const sanitizedFileName =
            typeof fileName === "string" && fileName.trim()
                ? fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "_")
                : "upload";

        const uniqueFileName = `${timestamp}_${sanitizedFileName}`;

        const uploadResponse = await imagekit.files.upload({
            file,
            fileName: uniqueFileName,
            folder: `/blog_images/${userId}`,
            useUniqueFileName: true,
        });

        return NextResponse.json({
            success: true,
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
            width: uploadResponse.width,
            height: uploadResponse.height,
            size: uploadResponse.size,
            name: uploadResponse.name,
        });
    } catch (error) {
        console.error("ImageKit Upload Error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed To Upload Image",
            },
            { status: 500 },
        );
    }
}
