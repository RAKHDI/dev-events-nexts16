// lib/posthog.js
import posthog from 'posthog-js'

// Initialize PostHog only in the browser (not during SSR)
if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: true, // optional, automatically captures page views
    })
}

export default posthog
