// /components/BookEvent.tsx
'use client';
import React, { useState } from 'react';
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

interface BookEventProps {
    eventId: string;
    slug: string;
}

const BookEvent: React.FC<BookEventProps> = ({ eventId, slug }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { success, error } = await createBooking({ eventId, slug, email });

        if (success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            console.error('Booking creation failed', error);

            // Type-safe error message
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

            posthog.capture('booking_failed', {
                error: errorMessage,
                eventId,
                slug,
                email
            });
        }
    };


    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email address"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default BookEvent;
