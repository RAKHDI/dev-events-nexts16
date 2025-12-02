import {
  Schema,
  model,
  models,
  type Model,
  type HydratedDocument,
  Types,
} from 'mongoose';
import { Event } from './event.model';

/**
 * Core Booking shape used by Mongoose.
 */
export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;
export type BookingModel = Model<Booking>;

/**
 * Simple email validator for basic format checks.
 * For production you might integrate a more robust validator if needed.
 */
function isValidEmail(email: string): boolean {
  // Basic RFC 5322-like pattern suitable for most application use-cases.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Booking schema definition with strict types.
 */
const bookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // field-level index for faster event.actions.ts lookups
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => isValidEmail(value),
        message: 'Invalid email format.',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

// Additional explicit index on eventId (useful if you ever change field options).
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook:
 * - Ensure email is valid and non-empty after trimming.
 * - Ensure the referenced Event exists before creating the booking.
 */
bookingSchema.pre<BookingDocument>('save', async function () {
  const booking = this as BookingDocument;

  const normalizedEmail = booking.email.trim();
  if (normalizedEmail.length === 0 || !isValidEmail(normalizedEmail)) {
    throw new Error('A valid, non-empty email is required.');
  }
  booking.email = normalizedEmail;

  // Ensure the event.actions.ts exists before saving the booking.
  const eventExists = await Event.exists({ _id: booking.eventId });
  if (!eventExists) {
    throw new Error('Referenced event.actions.ts does not exist.');
  }
});

/**
 * Cached Booking model to avoid recompilation in dev / hot reloads.
 */
export const Booking: BookingModel =
  (models.Booking as BookingModel | undefined) ??
  model<Booking>('Booking', bookingSchema);
