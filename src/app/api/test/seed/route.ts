import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // Create baseline users if they don't exist
        const worker = await prisma.user.upsert({
            where: { email: 'worker@attendcare.test' },
            update: {},
            create: { name: 'Test Worker', email: 'worker@attendcare.test', role: 'worker' }
        });

        const participant = await prisma.participant.create({
            data: {
                name: 'Evelyn Carter',
                dob: new Date('1945-06-12'),
                address: '123 Care Facility Lane, Suite 402'
            }
        });

        // Generate factual events spanning the last 24 hours
        const now = Date.now();
        const eventsToCreate = [];

        // 1. Presence established 2 hours ago
        eventsToCreate.push({
            participantId: participant.id,
            actorId: worker.id,
            occurredAt: new Date(now - 2 * 60 * 60 * 1000),
            type: 'PRESENCE',
            presence: { create: { latitude: 40.7128, longitude: -74.0060, accuracy: 5.0 } }
        });

        // 2. Observations
        for (let i = 0; i < 5; i++) {
            eventsToCreate.push({
                participantId: participant.id,
                actorId: worker.id,
                occurredAt: new Date(now - (120 - i * 15) * 60 * 1000), // Every 15 mins
                type: 'OBSERVATION',
                observations: { create: [{ metric: 'heart_rate', value: 75 + Math.random() * 5, unit: 'bpm' }] }
            });
            eventsToCreate.push({
                participantId: participant.id,
                actorId: worker.id,
                occurredAt: new Date(now - (120 - i * 15) * 60 * 1000),
                type: 'OBSERVATION',
                observations: { create: [{ metric: 'spo2', value: 96 + Math.random() * 2, unit: '%' }] }
            });
        }

        // 3. Task Execution
        eventsToCreate.push({
            participantId: participant.id,
            actorId: worker.id,
            occurredAt: new Date(now - 60 * 60 * 1000),
            type: 'TASK_EXECUTION',
            taskExecutions: { create: [{ taskCode: 'MED_ADMIN_AM', result: 'completed' }] }
        });

        // 4. A recent Alert to trigger the 'at-risk' condition
        eventsToCreate.push({
            participantId: participant.id,
            actorId: worker.id,
            occurredAt: new Date(now - 10 * 60 * 1000),
            type: 'OBSERVATION',
            observations: { create: [{ metric: 'heart_rate', value: 105, unit: 'bpm' }] }
        });

        eventsToCreate.push({
            participantId: participant.id,
            actorId: worker.id,
            occurredAt: new Date(now - 9 * 60 * 1000),
            type: 'ALERT',
            alerts: { create: [{ ruleCode: 'HR_TACHYCARDIA_DETECTED', severity: 'critical' }] }
        });

        // Note exactly right now
        eventsToCreate.push({
            participantId: participant.id,
            actorId: worker.id,
            occurredAt: new Date(now),
            type: 'NOTE',
            notes: { create: [{ text: 'Elevated HR verified. Hydration protocol initiated.' }] }
        });

        for (const evt of eventsToCreate) {
            await prisma.event.create({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: evt as any
            });
        }

        return NextResponse.json({ success: true, message: 'Seeded test Participant and Events', participantId: participant.id });
    } catch (error: unknown) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
