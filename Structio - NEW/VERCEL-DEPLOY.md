# Vercel deployment

This static site uses a Vercel serverless function at `/api/consultation` to deliver consultation requests through Resend.

## Configure email delivery

1. Create a Resend account and verify a sender domain you control. Do not use a sender address on an unverified domain.
2. Create a Resend API key with permission to send email.
3. Import the GitHub repository into Vercel as a project. Leave the project root at the repository root; the `api/` directory must be at that root for Vercel to discover the function.
4. In Vercel project settings, add these environment variables for Production (and Preview if you want to test there):
   - `RESEND_API_KEY`: the private Resend API key.
   - `RESEND_FROM_EMAIL`: a verified sender, for example `Structio Website <website@your-verified-domain.co.za>`.
5. Deploy or redeploy after adding the variables. Configure Resend account notifications and access controls as appropriate.
6. Submit a test consultation request on the deployed site and confirm it arrives at `info@structio.com` and the success page appears.

Never commit the API key to GitHub or expose it in frontend JavaScript. Real delivery will return a configuration error until both environment variables are set in Vercel.
