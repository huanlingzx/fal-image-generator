// app/api/history/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// const prisma = new PrismaClient();

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const entryId = params.id;
    // const userId = request.headers.get('x-user-id'); // TODO: Get user ID for auth

    try {
        const body = await request.json();
        const { isFavorite } = body;

        if (typeof isFavorite !== 'boolean') {
            return NextResponse.json({ error: 'isFavorite field is required and must be a boolean' }, { status: 400 });
        }

        const updatedEntry = await prisma.historyEntry.update({
            where: { 
                id: entryId,
                // userId: userId || undefined, // Ensure user owns the entry
            },
            data: { isFavorite },
        });

        if (!updatedEntry) {
            return NextResponse.json({ error: 'History entry not found or unauthorized' }, { status: 404 });
        }
        // You might want to use mapDbHistoryEntryToClient here if returning the full object
        return NextResponse.json({ id: updatedEntry.id, isFavorite: updatedEntry.isFavorite });
    } catch (error) {
        console.error(`Error updating history entry ${entryId}:`, error);
        return NextResponse.json({ error: 'Failed to update history entry' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const entryId = params.id;
    // const userId = request.headers.get('x-user-id'); // TODO: Get user ID for auth

    try {
        // Soft delete
        const deletedEntry = await prisma.historyEntry.update({
            where: { 
                id: entryId,
                // userId: userId || undefined, // Ensure user owns the entry
            },
            data: { isDeleted: true },
        });

        if (!deletedEntry) {
            return NextResponse.json({ error: 'History entry not found or unauthorized' }, { status: 404 });
        }
        return NextResponse.json({ message: 'History entry deleted successfully' });
    } catch (error) {
        console.error(`Error deleting history entry ${entryId}:`, error);
        return NextResponse.json({ error: 'Failed to delete history entry' }, { status: 500 });
    }
}
