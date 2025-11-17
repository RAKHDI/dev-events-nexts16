'use client'
import posthog from '@/lib/posthog'

export default function TestButton() {
    return (
        <button
            onClick={() => posthog.capture('manual button click', { clicked: true })}
            className="p-2 bg-blue-600 text-white rounded"
        >
            Send PostHog Event
        </button>
    )
}
