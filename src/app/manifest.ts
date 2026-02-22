
import { Metadata } from 'next';

export default function manifest(): Metadata {
    return {
        name: 'AttendCare 4.0',
        short_name: 'AttendCare',
        description: 'Proof-of-Care & Decision Infrastructure',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    } as Metadata; // Casting as Metadata for now, though nextjs handles this route specifically
}
