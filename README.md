# RTI Online Demo

This is a mock RTI portal prototype, not an official Government of India service.

## Connect Supabase

1. Create a Supabase project, then run [supabase/schema.sql](./supabase/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local` and add the project URL and **anon** key.
3. In Authentication, set the site URL and redirect URL to your app URL. Enable email/password authentication.
4. Deploy the two Edge Functions:

   ```bash
   supabase functions deploy request-tracking-otp
   supabase functions deploy verify-tracking-otp
   supabase secrets set OTP_PEPPER="a-long-random-secret"
   ```

5. Add a transactional email/SMS provider inside `request-tracking-otp`. The function intentionally never returns OTPs in a configured environment.

## Included backend behaviour

- Supabase email/password sign-up, sign-in, sessions, sign-out, and password reset
- RLS-protected profiles, applications, appeals, notifications, payments, documents, and history
- Private document bucket with per-user Storage policies
- Application and draft persistence, payment records, notifications, and status history
- First-appeal service function and public tracking OTP endpoints with expiry, single-use tokens, retry limits, and SHA-256 hashes

Keep the Supabase service-role key only in Edge Function secrets; never expose it in Vite variables.
