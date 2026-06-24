/**
 * Runtime setup for @sparticuz/chromium. This module MUST be imported before
 * '@sparticuz/chromium', because that package configures LD_LIBRARY_PATH at
 * import time based on the env vars set here.
 *
 * Vercel's Node serverless functions run on AWS Lambda (Amazon Linux 2023 for
 * the nodejs20.x/22.x runtimes) but do NOT expose the AWS_EXECUTION_ENV /
 * AWS_LAMBDA_JS_RUNTIME variables that @sparticuz/chromium uses to detect it is
 * inside Lambda. Without that signal the library never extracts its bundled
 * shared libraries (libnspr4.so, libnss3.so, ...) nor points LD_LIBRARY_PATH at
 * them, so Chromium fails to launch with:
 *   "error while loading shared libraries: libnspr4.so: cannot open shared object file"
 *
 * We set the variable ourselves so the import-time setup runs correctly.
 *
 * NOTE: @sparticuz/chromium@123 only maps the "20.x" token to the Amazon Linux
 * 2023 library bundle, so we use 'nodejs20.x' even though Vercel runs us on
 * nodejs22.x — both runtimes are AL2023 and ship the same shared libraries.
 * Using 'nodejs22.x' would (incorrectly) select the Amazon Linux 2 bundle.
 *
 * Guarded on AWS_REGION so it is a no-op during local `vercel dev`, where the
 * locally installed Chrome is used instead of @sparticuz/chromium.
 */
if (process.env.AWS_REGION && !process.env.AWS_LAMBDA_JS_RUNTIME) {
    process.env.AWS_LAMBDA_JS_RUNTIME = 'nodejs20.x';
}
