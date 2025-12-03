// /database/booking.model.ts
import {
    Schema,
    model,
    models,
    type Model,
    type HydratedDocument,
    Types,
    Document
} from 'mongoose';
import { Event } from './event.model';

export interface Booking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type BookingDocument = HydratedDocument<Booking>;
export type BookingModel = Model<Booking>;

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const bookingSchema = new Schema<Booking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: isValidEmail,
                message: 'Invalid email format.',
            },
        },
    },
    { timestamps: true, strict: true }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre<BookingDocument>('save', async function () {
    const normalizedEmail = this.email.trim();
    if (!isValidEmail(normalizedEmail)) {
        throw new Error('A valid, non-empty email is required.');
    }
    this.email = normalizedEmail;

    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
        throw new Error('Referenced event does not exist.');
    }
});

export const Booking: BookingModel =
    (models.Booking as BookingModel) || model<Booking>('Booking', bookingSchema);
