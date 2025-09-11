import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://81dc596001ff09c576a08c10c22bbabb@o4509959835811840.ingest.us.sentry.io/4509959843545088",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],
  // tracesSampleRate:1.0,
});
Sentry.profiler.startProfiler();
