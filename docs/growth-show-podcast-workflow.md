# Growth Show connected podcast publishing
Owner rule, preserved exactly:
> “I want everything I do to live on my websites. That’s a rule. What we do from there to build it out are the decisions we make as we go.”

Every approved public creation needs an appropriate, usable website home. Private material remains private.

Use the existing GrowthShowEpisode identity, slug, YouTube ID and lesson/Journal connections.
Do not create a separate podcast episode library. Audio fields belong to the same record.
The generic episode page and four native pages reuse GrowthShowAudioPlayer.
Missing/Review/Failed audio never exposes a working Listen control or RSS enclosure.
RSS is a static XML file, /growth-show.xml, regenerated in npm run build from public episode records.
Future media preparation: scripts/prepare-growth-show-audio.py accepts a completed master and an existing YouTube identity, extracts the original audio, verifies complete decoding and duration, and attaches it to the existing record.
Its first pass stores Review, withholds Listen/RSS, and needs owner sound review plus hosted range verification before Ready.
It requires owner authentication in BASE44_USER_TOKEN for updates; never commit or print that token.
Use --check-only for verification without mutations. Use ffmpeg and ffprobe installed in the execution environment; do not pay for new production or subscriptions.
Ready in this build means technical preparation passed in the development server; public availability is a separate Publish and live-host check.
Existing historic website dates were preserved even where YouTube upload dates differ. No episode numbering was guessed.
Run episode/RSS tests and build; review mobile layout, actual browser seeking, full sound, website learning links, and RSS/media HTTP responses.
Create a checkpoint, align GitHub, then Rick performs Publish → Publish App.
After Publish retrieve https://newtechadvertising.com/growth-show.xml; require XML content, eight (or the current actual number of) unique entries, correct audio/mpeg enclosures and file sizes, and successful 206 range responses from the public media host.
No podcast directory submission, email, social release, or distribution automation is included.

## October 6 reconciliation
The public Growth Show playlist PLX5kVEXUqakQ returns nine videos, representing eight established show identities plus 9xQ1lvyKiIs, titled NTA Growth Show S01E01 v3. Its description points to the same tools-vs-system Episode 1 page, so it was preserved as an alternate version rather than counted as another distinct episode.
Owner clarified that early videos were not set up like later shows. After this cleanup, review the channel presentation and develop one or two new shows toward ten. This is future editorial direction, not approval to render paid media or alter existing YouTube videos.
The eight source IDs: bRuUdNZZzwQ, Wz9Gqshyk3o, S-hRkzo6_3M, 6lhiYFHFsCQ, PmXSEkj03ak, T4fPojz2RmI, rbqIiynd1zo, 814-k8Tl-LE.
Audio was recovered from the assembled YouTube programs, not HeyGen segments or regenerated readings.
The Drive Episode 2 master 1TGcx-UGEkgfOtYJzQKiYhLacNf_HSYOc decoded only about 140 seconds despite a 160.8 second header; it was rejected for podcast production. The complete YouTube audio was used.
