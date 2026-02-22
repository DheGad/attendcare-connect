import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { workerId, participantId, taskCode, timeWindowStart, timeWindowEnd, requiredPreviousTask } = body;

        // Validation Engine Rules
        const errors = [];

        // 1. Verify Assigned Worker (Mock validation for prototype)
        if (!workerId) errors.push("Unassigned worker attempted action.");

        // 2. Verify Time Window
        const now = new Date();
        const start = new Date(timeWindowStart);
        const end = new Date(timeWindowEnd);

        if (now < start || now > end) {
            errors.push(`Action out of allowed time window (${start.toLocaleTimeString()} - ${end.toLocaleTimeString()})`);
        }

        // 3. Verify Checklist Order (Sequence)
        if (requiredPreviousTask) {
            // Check the Event Ledger
            const priorTask = await prisma.event.findFirst({
                where: {
                    participantId,
                    type: 'TASK_EXECUTION',
                    taskExecutions: {
                        some: { taskCode: requiredPreviousTask, result: 'completed' }
                    }
                }
            });

            if (!priorTask) {
                errors.push(`Sequence violation: Required prior task [${requiredPreviousTask}] is incomplete.`);
            }
        }

        if (errors.length > 0) {
            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        // Simulate Network Flakiness for Verification
        if (Math.random() > 0.8) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            return NextResponse.json({ success: false, errors: ["Network Drop: Edge gateway unreachable. Retrying locally."] }, { status: 503 });
        }

        // If Valid -> Store Factual Event
        const event = await prisma.event.create({
            data: {
                participantId,
                actorId: workerId,
                occurredAt: new Date(),
                type: 'TASK_EXECUTION',
                taskExecutions: {
                    create: [{ taskCode, result: 'completed' }]
                }
            }
        });

        return NextResponse.json({ success: true, eventId: event.id });

    } catch (error: unknown) {
        console.error("Validation logic failed:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
