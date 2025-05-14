// app/api/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { HistoryEntry as ClientHistoryEntry, GenerationParameters, ApiImage } from '@/lib/types'; // Your client-side types

const prisma = new PrismaClient();

// Helper to convert DB BigInt to number for client
const mapDbHistoryEntryToClient = (dbEntry: any): ClientHistoryEntry => {
    const parameters: GenerationParameters = {
        prompt: dbEntry.prompt,
        image_size: dbEntry.imageSize ? (dbEntry.imageSize.startsWith('{') ? JSON.parse(dbEntry.imageSize) : dbEntry.imageSize) : "unknown",
        num_inference_steps: dbEntry.numInferenceSteps ?? undefined,
        seed: dbEntry.seed ? Number(dbEntry.seed) : undefined,
        guidance_scale: dbEntry.guidanceScale ?? undefined,
        num_images: dbEntry.numImages ?? undefined,
        output_format: (dbEntry.outputFormat as "jpeg" | "png") ?? undefined,
        enable_safety_checker: dbEntry.enableSafetyChecker ?? undefined,
        loras: dbEntry.lorasJson ? JSON.parse(dbEntry.lorasJson) : undefined,
    };
    if (dbEntry.otherParamsJson) {
        const otherParams = JSON.parse(dbEntry.otherParamsJson);
        for (const key in otherParams) {
            parameters[key] = otherParams[key];
        }
    }

    return {
        id: dbEntry.id,
        modelId: dbEntry.modelId,
        modelName: dbEntry.modelName,
        timestamp: new Date(dbEntry.timestamp).getTime(),
        image: {
            url: dbEntry.imageUrl,
            content_type: dbEntry.imageContentType,
            width: dbEntry.imageWidth,
            height: dbEntry.imageHeight,
        },
        parameters,
        isFavorite: dbEntry.isFavorite,
        // isDeleted is handled by query, not usually sent to client unless needed
    };
};


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const searchTerm = searchParams.get('searchTerm') || '';
    const modelFilter = searchParams.get('modelFilter') || '';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'; // 'asc' or 'desc'
    // const userId = searchParams.get('userId'); // TODO: Implement user authentication

    const skip = (page - 1) * limit;

    try {
        const whereClause: any = {
            isDeleted: false, // Only get non-deleted items
            // userId: userId || undefined, // Filter by user if implemented
        };

        if (searchTerm) {
            whereClause.OR = [
                { prompt: { contains: searchTerm, mode: 'insensitive' } },
                { modelName: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        if (modelFilter) {
            whereClause.modelId = modelFilter; // Assuming modelFilter is the modelId
        }

        const historyEntries = await prisma.historyEntry.findMany({
            where: whereClause,
            orderBy: {
                timestamp: sortOrder,
            },
            skip: skip,
            take: limit,
        });

        const totalEntries = await prisma.historyEntry.count({ where: whereClause });
        
        const clientEntries = historyEntries.map(mapDbHistoryEntryToClient);

        return NextResponse.json({
            data: clientEntries,
            totalPages: Math.ceil(totalEntries / limit),
            currentPage: page,
            totalItems: totalEntries,
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // const userId = request.headers.get('x-user-id'); // TODO: Get user ID from auth
    try {
        const body = await request.json();
        const {
            modelId,
            modelName,
            image, // ApiImage
            parameters, // GenerationParameters
        } = body as { modelId: string; modelName: string; image: ApiImage; parameters: GenerationParameters };

        if (!modelId || !modelName || !image || !parameters || !parameters.prompt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        // Destructure known parameters and collect others
        const {
            prompt, image_size, num_inference_steps, seed, guidance_scale,
            num_images, output_format, enable_safety_checker, loras,
            ...otherParams // Collect remaining parameters
        } = parameters;

        const newEntry = await prisma.historyEntry.create({
            data: {
                // userId: userId || undefined,
                modelId,
                modelName,
                imageUrl: image.url,
                imageContentType: image.content_type,
                imageWidth: image.width,
                imageHeight: image.height,
                prompt: prompt,
                imageSize: typeof image_size === 'string' ? image_size : JSON.stringify(image_size),
                numInferenceSteps: num_inference_steps,
                seed: seed ? BigInt(seed) : null,
                guidanceScale: guidance_scale,
                numImages: num_images,
                outputFormat: output_format,
                enableSafetyChecker: enable_safety_checker,
                lorasJson: loras ? JSON.stringify(loras) : null,
                otherParamsJson: Object.keys(otherParams).length > 0 ? JSON.stringify(otherParams) : null,
                isFavorite: false,
                isDeleted: false,
            },
        });
        return NextResponse.json(mapDbHistoryEntryToClient(newEntry), { status: 201 });
    } catch (error: any) {
        console.error("Error creating history entry:", error);
        // Check for Prisma specific errors if needed
        return NextResponse.json({ error: 'Failed to create history entry', details: error.message }, { status: 500 });
    }
}
