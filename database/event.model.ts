import {
  Schema,
  model,
  models,
  type Model,
  type HydratedDocument,
} from 'mongoose';

/**
 * Core Event shape used by Mongoose.
 * `createdAt` and `updatedAt` are added by Mongoose via `timestamps: true`.
 */
export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // normalized ISO date string (YYYY-MM-DD)
  time: string; // normalized 24h time string (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<Event>;
export type EventModel = Model<Event>;

/**
 * Simple slugify helper to generate a URL-friendly slug from the title.
 */
function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    // decompose accents, then strip non-ASCII
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // replace non-alphanumerics with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Event schema definition with strict types.
 */
const eventSchema = new Schema<Event>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => item.trim().length > 0),
        message: 'Agenda must contain at least one non-empty item.',
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((tag) => tag.trim().length > 0),
        message: 'Tags must contain at least one non-empty item.',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

// Ensure slug uniqueness at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Normalize and validate required string fields so they are non-empty after trimming.
 */
function assertRequiredNonEmptyStrings(event: EventDocument): void {
  const requiredStringFields: (keyof Event)[] = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'mode',
    'audience',
    'organizer',
  ];

  for (const field of requiredStringFields) {
    const value = event[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Field "${field}" is required and must be a non-empty string.`);
    }
    // TypeScript cannot infer that we're only touching string fields here, so cast.
    (event as any)[field] = value.trim();
  }
}

/**
 * Validate and normalize the `date` and `time` fields.
 * - `date` is stored as ISO date string (YYYY-MM-DD).
 * - `time` is stored as 24h time string in HH:mm format.
 */
function normalizeDateAndTime(event: EventDocument): void {
  // Normalize date
  const parsedDate = new Date(event.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Invalid event date. Provide a valid date string.');
  }
  event.date = parsedDate.toISOString().split('T')[0];

  // Normalize time
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(event.time);
  if (!timeMatch) {
    throw new Error('Invalid time format. Expected HH:mm (24-hour clock).');
  }

  const hours = Number.parseInt(timeMatch[1], 10);
  const minutes = Number.parseInt(timeMatch[2], 10);

  if (hours < 0 || hours > 23) {
    throw new Error('Hour must be between 0 and 23.');
  }
  if (minutes < 0 || minutes > 59) {
    throw new Error('Minutes must be between 0 and 59.');
  }

  event.time = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Pre-save hook:
 * - Generate slug from title when the title changes.
 * - Validate and normalize date/time formats.
 * - Enforce non-empty required fields.
 */
eventSchema.pre<EventDocument>('save', function () {
  const event = this as EventDocument;

  assertRequiredNonEmptyStrings(event);
  normalizeDateAndTime(event);

  if (event.isModified('title') || !event.slug) {
    event.slug = slugifyTitle(event.title);
  }
});

/**
 * Cached Event model to avoid recompilation in dev / hot reloads.
 */
export const Event: EventModel =
  (models.Event as EventModel | undefined) ?? model<Event>('Event', eventSchema);
