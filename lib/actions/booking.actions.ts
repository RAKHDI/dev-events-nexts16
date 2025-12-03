'use server';

import mongoose from 'mongoose';
import { Booking } from '@/database/booking.model';
import { connectToDatabase } from '@/lib/mongodb';

export async function createBooking({
                                        eventId,
                                        slug,
                                        email
                                    }: {
    eventId: string;
    slug: string; // passed from UI but not stored in DB
    email: string;
}) {
    try {
        await connectToDatabase();

        // ensure eventId is ObjectId
        const objectId = new mongoose.Types.ObjectId(eventId);

        const bookingDoc = await Booking.create({
            eventId: objectId,
            email,
        });

        // convert to plain JS object
        const booking = bookingDoc.toObject();

        return { success: true, booking };
    } catch (error) {
        console.error('create booking failed:', error);
        return { success: false, error };
    }
}
