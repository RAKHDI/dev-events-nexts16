import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { Booking } from '../database/booking.model';
import { Event } from '../database/event.model';

jest.setTimeout(120000);

describe('Booking model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      dbName: 'test-booking',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Booking.deleteMany({});
    await Event.deleteMany({});
  });

  function buildValidEventOverrides(overrides: Partial<Omit<Parameters<typeof Event.create>[0], 'slug'>> = {}) {
    const base = {
      title: 'Sample Event',
      slug: 'sample-event', // will be recomputed by pre-save hook but must satisfy schema
      description: 'A sample event for testing',
      overview: 'Overview',
      image: 'https://example.com/image.png',
      venue: 'Main Hall',
      location: 'Test City',
      date: '2025-11-22',
      time: '18:30',
      mode: 'offline',
      audience: 'developers',
      agenda: ['Intro'],
      organizer: 'Test Org',
      tags: ['test'],
    };

    return { ...base, ...overrides } as any;
  }

  it('should validate email format correctly on save', async () => {
    const event = await Event.create(buildValidEventOverrides());

    const validBooking = new Booking({
      eventId: event._id,
      email: 'valid.user@example.com',
    });

    await expect(validBooking.save()).resolves.toMatchObject({
      email: 'valid.user@example.com',
    });

    const invalidBooking = new Booking({
      eventId: event._id,
      email: 'invalid-email-format',
    });

    await expect(invalidBooking.save()).rejects.toThrow(/Invalid email format|A valid, non-empty email is required/i);
  });

  it('should prevent saving if referenced event does not exist', async () => {
    const nonExistingEventId = new Types.ObjectId();

    const booking = new Booking({
      eventId: nonExistingEventId,
      email: 'user@example.com',
    });

    await expect(booking.save()).rejects.toThrow('Referenced event does not exist.');
  });
});
