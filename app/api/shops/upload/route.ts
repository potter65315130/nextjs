import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// --------------------------------------------------------
// POST /api/shops/upload — อัปโหลดรูปภาพร้าน
// --------------------------------------------------------
export async function POST(request: NextRequest) {
    try {
        // 1. Parse multipart/form-data
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No image file provided',
                },
                { status: 400 }
            );
        }

        // 2. Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
                },
                { status: 400 }
            );
        }

        // 3. Generate unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const filename = `shop_${timestamp}.${fileExtension}`;

        // 4. Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'shops');
        await mkdir(uploadDir, { recursive: true });

        // 5. Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // 6. Return public URL
        const imageUrl = `/uploads/shops/${filename}`;

        return NextResponse.json({
            success: true,
            data: {
                imageUrl,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to upload image',
            },
            { status: 500 }
        );
    }
}
