import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Event, type Event as EventShape } from '@/database/event.model';

/**
 * Route parameters for /api/events/[slug].
 */
interface RouteParams {
  slug: string;
}

/**
 * Shape of a successful response body for a single event.actions.ts.
 */
interface EventSuccessResponse {
  message: string;
  event: EventShape;
}

/**
 * Shape of an error response body.
 */
interface ErrorResponse {
  message: string;
  error?: string;
}

/**
 * GET /api/events/[slug]
 *
 * Returns a single event.actions.ts by its slug.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<RouteParams> },
): Promise<NextResponse<EventSuccessResponse | ErrorResponse>> {
  try {
    const { slug: rawSlug } = await context.params;

    // Validate presence of slug parameter
    if (typeof rawSlug !== 'string') {
      return NextResponse.json<ErrorResponse>(
        { message: 'Invalid slug parameter type.' },
        { status: 400 },
      );
    }

    const slug = rawSlug.trim();

    if (slug.length === 0) {
      return NextResponse.json<ErrorResponse>(
        { message: 'Slug parameter is required and must be non-empty.' },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Use a lean query to return plain JSON-compatible objects.
    const event = await Event.findOne({ slug }).lean<EventShape | null>().exec();

    if (!event) {
      return NextResponse.json<ErrorResponse>(
        { message: 'Event not found for the given slug.' },
        { status: 404 },
      );
    }

    return NextResponse.json<EventSuccessResponse>(
      {
        message: 'Event fetched successfully.',
        event,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred while fetching the event.actions.ts.';

    return NextResponse.json<ErrorResponse>(
      {
        message: 'Event fetching failed.',
        error: message,
      },
      { status: 500 },
    );
  }
}
