import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    const participantId = searchParams.get('participantId');

    if (!participantId || !startParam || !endParam) {
        return NextResponse.json({ error: "Missing required parameters (participantId, start, end)" }, { status: 400 });
    }

    try {
        const events = await prisma.event.findMany({
            where: {
                participantId,
                occurredAt: {
                    gte: new Date(startParam),
                    lte: new Date(endParam)
                }
            },
            orderBy: {
                occurredAt: 'asc' // Critical for chronological replay
            },
            include: {
                presence: true,
                observations: true,
                taskExecutions: true,
                notes: true,
                alerts: true,
                messages: true
            }
        });

        // Replay payload streams all state changes sequentially
        return NextResponse.json({ success: true, replayEvents: events });

    } catch (error: unknown) {
        console.error("Replay fetch failed:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
