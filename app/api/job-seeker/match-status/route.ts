import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: เปลี่ยนสถานะแมตช์ (เช่น accept, decline)
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { matchId, status } = body;

        if (!matchId || !status) {
            return NextResponse.json({ message: 'Match ID and Status are required' }, { status: 400 });
        }

        // Validate status if needed
        const validStatuses = ['pending', 'accepted', 'declined', 'interview'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const updatedMatch = await prisma.match.update({
            where: { id: parseInt(matchId) },
            data: { status },
        });

        return NextResponse.json({ message: 'Match status updated', match: updatedMatch });
    } catch (error) {
        console.error('Error updating match status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
