import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  debug: false,

  environment: process.env.NODE_ENV,

  replaysOnErrorSampleRate: 1.0,

  replaysSessionSampleRate: 0.1,

  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/yanyucloud\.com/],
    }),
  ],

  beforeSend(event, hint) {
    if (event.exception) {
      console.error("[Sentry]", event.exception)
    }
    return event
  },

  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    "Network request failed",
  ],
})
