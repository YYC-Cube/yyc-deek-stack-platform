import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  debug: false,

  environment: process.env.NODE_ENV,

  integrations: [new Sentry.Integrations.Http({ tracing: true })],

  beforeSend(event, hint) {
    if (event.exception) {
      console.error("[Sentry Server]", event.exception)
    }
    return event
  },
})
