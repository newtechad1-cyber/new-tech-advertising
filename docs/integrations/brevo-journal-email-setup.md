# Brevo Journal Email Setup

The NTA Journal keeps the Base44 `Subscriber` record as the authoritative
consent record and mirrors active `nta-journal` subscribers into one Brevo
contact list for campaign delivery.

## Required Base44 settings

| Setting | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Existing Brevo API key |
| `BREVO_FROM_EMAIL` | Authenticated NTA sender |
| `BREVO_FROM_NAME` | Sender name |
| `LEAD_REPLY_TO_EMAIL` | Reply address shared with the proven lead-email setup |
| `BREVO_JOURNAL_LIST_ID` | Numeric ID of the Brevo `NTA Journal Subscribers` list |
| `BREVO_JOURNAL_SYNC_ENABLED` | Enables website subscriber sync when `true` |
| `JOURNAL_TEST_TO` | Rick's controlled test inbox |
| `BREVO_JOURNAL_TEST_ENABLED` | Enables only the admin Send Test action |
| `BREVO_JOURNAL_SEND_ENABLED` | Enables live subscriber delivery; keep `false` through testing |
| `NTA_PUBLIC_URL` | Optional; defaults to `https://newtechadvertising.com` |

Never commit the API key or private account values to GitHub.

## Safe activation

1. Create the Brevo list `NTA Journal Subscribers` and copy its numeric list ID.
2. Add the settings above with sync, test, and subscriber sending set to `false`.
3. Set `BREVO_JOURNAL_SYNC_ENABLED=true`.
4. Submit the public Journal form with Rick's controlled test address.
5. Verify the Base44 Subscriber record and the Brevo list contact.
6. Set `BREVO_JOURNAL_TEST_ENABLED=true`.
7. Open Edition 1 in the Journal Builder and click **Send Test**.
8. Verify subject, content, website link, reply address, mobile layout, and
   unsubscribe link.
9. Leave `BREVO_JOURNAL_SEND_ENABLED=false` until Rick explicitly approves
   the test email.
10. After approval, set `BREVO_JOURNAL_SEND_ENABLED=true` and use **Email
    Subscribers** once. `JournalDelivery` prevents a second successful bulk
    send for the same issue slug.

Brevo campaigns provide the marketing-email unsubscribe handling. The NTA
Journal does not use the transactional lead acknowledgment endpoint for weekly
publication delivery.
