import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { Event } from '../database/event.model';

jest.setTimeout(120000);

describe('Event model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      dbName: 'test-event.actions.ts',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Event.deleteMany({});
  });

  function buildBaseEvent(overrides: Partial<Parameters<typeof Event.create>[0]> = {}) {
    const base = {
      title: 'My Awesome Test Event',
      slug: 'initial-slug',
      description: 'Description',
      overview: 'Overview',
      image: 'https://example.com/image.png',
      venue: 'Main Hall',
      location: 'Test City',
      date: '2025-11-22',
      time: '18:30',
      mode: 'online',
      audience: 'developers',
      agenda: ['Intro', 'Talk'],
      organizer: 'Test Org',
      tags: ['tech', 'test'],
    };

    return { ...base, ...overrides } as any;
  }

  it('should generate a correct slug from the title on save', async () => {
    const event = await Event.create(
      buildBaseEvent({ title: '  Hello World: Next.js & Mongo!  ' }),
    );

    expect(event.slug).toBe('hello-world-next-js-mongo');
  });

  it('should validate agenda and tags arrays to contain non-empty items', async () => {
    await expect(
      Event.create(
        buildBaseEvent({
          agenda: [],
        }),
      ),
    ).rejects.toThrow(/Agenda must contain at least one non-empty item/i);

    await expect(
      Event.create(
        buildBaseEvent({
          tags: ['valid', '   '],
        }),
      ),
    ).rejects.toThrow(/Tags must contain at least one non-empty item/i);

    const validEvent = await Event.create(
      buildBaseEvent({
        agenda: ['  Intro  ', 'Talk'],
        tags: ['  tag-one  ', 'tag-two'],
      }),
    );

    expect(validEvent.agenda).toEqual(['Intro', 'Talk']);
    expect(validEvent.tags).toEqual(['tag-one', 'tag-two']);
  });
});
