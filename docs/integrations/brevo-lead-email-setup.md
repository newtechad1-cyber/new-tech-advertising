# Brevo Lead Email Setup

The lead intake code is safe to deploy before Brevo is enabled. CRM capture,
source tracking, follow-up tasks, and the existing Base44 lead notification do
not depend on Brevo or AI credits.

## Required Base44 function settings

Configure these secrets/settings for `ntaUnifiedIntake`:

| Setting | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Brevo transactional email API key |
| `BREVO_FROM_EMAIL` | Authenticated NTA sender address |
| `BREVO_FROM_NAME` | Sender name, normally `New Tech Advertising` |
| `LEAD_NOTIFICATION_TO` | Rick's lead-alert inbox |
| `LEAD_REPLY_TO_EMAIL` | Address prospects should reach when replying |
| `BREVO_LEAD_EMAIL_ENABLED` | Set to `true` only after the test below succeeds |

Do not commit the API key or other credentials to GitHub.

## Safe activation order

1. Add the API key and sender/recipient settings while
   `BREVO_LEAD_EMAIL_ENABLED` is absent or `false`.
2. Confirm the sender address is authenticated in Brevo.
3. Submit the Contact form using a controlled NTA test address.
4. Verify the CRM contains the Submission, company, contact, opportunity,
   SalesLead, SalesDeal, and follow-up task with the correct page and message.
5. Temporarily set `BREVO_LEAD_EMAIL_ENABLED=true`.
6. Submit one more controlled test and verify:
   - Rick receives the full internal lead alert;
   - the test prospect receives one acknowledgment;
   - replying to the acknowledgment addresses Rick;
   - the Brevo transactional log shows both deliveries.
7. Leave the switch enabled only after all checks pass.

## Credit independence

`AI_LEAD_SCORING_ENABLED` defaults to off. Lead capture and follow-up therefore
continue even when AI or Victor credits are unavailable. Enable AI scoring
later only if its value and cost are intentionally approved.
