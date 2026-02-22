import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reconstructCondition(events: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentAlert = events.find((e: any) => e.type === 'ALERT' && e.alerts[0]?.severity === 'critical');
    if (recentAlert) return 'critical';

    // Check observations for bad vitals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentHeartRate = events.find((e: any) => e.type === 'OBSERVATION' && e.observations[0]?.metric === 'heart_rate');
    if (recentHeartRate && (recentHeartRate.observations[0].value > 100 || recentHeartRate.observations[0].value < 50)) {
        return 'at-risk';
    }

    return 'stable';
}

export async function GET() {
    try {
        // Fetch the most recent participant (for prototype, grab the first one)
        const participant = await prisma.participant.findFirst({
            include: {
                events: {
                    orderBy: { occurredAt: 'desc' },
                    take: 20,
                    include: {
                        observations: true,
                        alerts: true,
                        notes: true,
                        messages: true
                    }
                }
            }
        });

        if (!participant) {
            // Return empty baseline if NO data exists in LIVE mode
            return NextResponse.json({
                participantCondition: 'stable',
                heartRateStream: [],
                oxygenStream: [],
                aiInsights: [],
                systemLoad: 0
            });
        }

        const events = participant.events;
        const condition = reconstructCondition(events);

        // Reconstruct streams from factual observations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hrEvents = events.filter((e: any) => e.type === 'OBSERVATION' && e.observations[0]?.metric === 'heart_rate').reverse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const heartRateStream = hrEvents.map((e: any) => ({
            time: new Date(e.occurredAt).toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
            value: e.observations[0].value
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const o2Events = events.filter((e: any) => e.type === 'OBSERVATION' && e.observations[0]?.metric === 'spo2').reverse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oxygenStream = o2Events.map((e: any) => ({
            time: new Date(e.occurredAt).toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
            value: e.observations[0].value
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const insightEvents = events.filter((e: any) => e.type === 'NOTE' || e.type === 'ALERT');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aiInsights = insightEvents.map((e: any) => ({
            id: e.id,
            timestamp: new Date(e.occurredAt).toLocaleTimeString(),
            source: e.type === 'ALERT' ? 'Risk Engine' : 'Agent Sub-Routine',
            message: e.type === 'ALERT' ? (e.alerts[0]?.ruleCode || 'Unknown Alert Code') : (e.notes[0]?.text || 'System Event Registered'),
            severity: e.type === 'ALERT' ? 'alert' : 'info'
        }));


        return NextResponse.json({
            participantCondition: condition,
            heartRateStream,
            oxygenStream,
            aiInsights,
            // Compute arbitrary system load from event density for demo
            systemLoad: Math.min(100, events.length * 5)
        });

    } catch (error) {
        console.error("API State failed:", error);
        return NextResponse.json({ error: "Failed to reconstruct state" }, { status: 500 });
    }
}
