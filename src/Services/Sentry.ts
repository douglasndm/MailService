import * as Sentry from '@sentry/node';

console.log(process.env.SENTRY_DSN);

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
