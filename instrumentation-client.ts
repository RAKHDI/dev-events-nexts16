import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Initialize PostHog analytics on the client only when a key is provided.
if (typeof window !== 'undefined' && POSTHOG_KEY) {
  try {
    posthog.init(POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      capture_exceptions: true, // Enables capturing exceptions using Error Tracking
      debug: process.env.NODE_ENV === 'development',
    });
  } catch (error) {
    // Swallow initialization errors so analytics never break the app shell.
    // eslint-disable-next-line no-console
    console.error('Failed to initialize PostHog:', error);
  }
} else if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.warn('PostHog disabled: NEXT_PUBLIC_POSTHOG_KEY is not set.');
}
