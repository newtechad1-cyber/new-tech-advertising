# Claude independent review entry point

Read `AGENTS.md`, `docs/ai-review/README.md` and `docs/ai-review/review-template.md` first. Use the coordinator-provided neutral brief based on `docs/ai-review/assignment-template.md`; it must specify a **current, exact source commit**. The November 5 first-review brief at `docs/ai-review/pilot-2026-11-05.md` is preserved as history, not a task to repeat.

By default review **read-only**: no editing, merging, publishing, GitHub permission changes, production submissions or paid services. Report the branch/commit you could actually access; do not assume repository metadata or unmerged branch access is available in your tools. List the precise files inspected and checks you personally ran, using NOT RUN for everything else.

To protect review independence, do not read `docs/ai-review/coordinator-status-2026-11-05.md`, another AI's report or an implementation discussion of the exact finding until you have completed your first report. Include reproducible evidence and a minimal proposed regression test. A clean review can report zero findings.

Creating this file neither connects Claude nor starts a bot. The first pilot was performed as a separate manual review; new reviews require an explicit assignment and a verified provider response.
