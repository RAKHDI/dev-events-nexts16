import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {Event} from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'buffer';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await req.formData();

        let eventData: any;

        try {
            eventData = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json(
                { message: 'Invalid form data format' },
                { status: 400 }
            );
        }

        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json(
                { message: 'Image file is required.' },
                { status: 400 }
            );
        }

        function parseArray(value: FormDataEntryValue | null) {
            if (!value) return [];

            const text = value.toString().trim();

            // If it's already JSON: ["Cloud","DevOps"]
            if (text.startsWith("[") && text.endsWith("]")) {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error("Invalid JSON array:", text);
                    return [];
                }
            }

            // Fallback: comma-separated
            return text.split(",").map(v => v.trim()).filter(Boolean);
        }

        const tags = parseArray(formData.get('tags'));
        const agenda = parseArray(formData.get('agenda'));


        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                })
                .end(buffer);
        });

        eventData.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...eventData,
            tags:tags,
            agenda:agenda,
        });

        return NextResponse.json(
            { message: 'Event created successfully.', event: createdEvent },
            { status: 201 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {
                message: 'Event Creation Failed',
                error: e instanceof Error ? e.message : 'Unknown',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json(
            { message: 'Events fetched successfully.', events },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            {
                message: 'Event fetching failed',
                error: e instanceof Error ? e.message : 'Unknown',
            },
            { status: 500 }
        );
    }
}
