# Remaining F3 content tests: diagnostic assessment only

Baseline: `721b967571447d328729d8f8ea9a9c55947e9ecb` (merged PR #110).
Status: assessment in progress; no results claimed before the job log is read.

Rick approved continuing the assessment of the seven remaining homepage,
lesson and positioning test files. This draft is NOT a release proposal and
must NOT be merged. It adds one temporary diagnostic workflow and this scope
record; it does not change the website, source tests, package commands,
dependencies, existing release workflow, IndexNow or publishing behavior.

The separate job first confirms the assessed source is byte-unchanged from
this baseline, installs the committed dependencies without lifecycle scripts,
and runs the full retained check:ci with outbound networking blocked and an
empty environment apart from PATH, HOME and CI. This generates the required
candidate-only dist files. It then runs the seven original suites unchanged,
in the same OS-enforced no-network environment. No failure is suppressed.
A red diagnostic is a result to explain, not approval to change the website.
The ordinary release gate remains separate and unchanged.

## Questions to resolve from exact evidence

- Which assertions protect still-approved meaning or behavior?
- Which hard-code earlier homepage wording, section order, component locations,
  transport call shapes or a fixed lesson count/position?
- Which failures persist after real candidate build output exists?
- Does current source preserve the safety property behind a stale assertion?
- Which discrepancies need Rick's editorial decision rather than a code fix?

Prior reviewer counts are not a new baseline. Do not reuse the withdrawn first
PR #106 totals. Inspect the actual final diagnostic step, case names and totals.
The seven files define 37 top-level cases; runtime discovery must confirm that.

The seven suites are ai-confusion-lesson, ai-foundations-conversation-lesson,
ai-foundations-editorial, brand-positioning, homepage-business-audiences,
homepage-live-review and talk-to-my-office-homepage, all in tests/*.test.mjs.
Most inspect source text. The AI-confusion file also executes curriculum
helpers; the homepage-live-review file extracts and executes a link sanitizer.
Two files require generated dist output. None is a live browser check.

The latest approved NTA direction is business-first, education-centered,
question-first guidance with human judgment and approval. An older string
match alone is not evidence that current approved content should be reverted.
The reported October 30 approval to simplify the homepage is relevant context,
not permission to invent new copy or silently accept every implementation detail.

## Boundaries and remaining work

Do not edit approved text, weaken assertions, suppress a failing case, retire a
test, add these suites to main's gate, merge or publish during this assessment.
No live diagnostic, media request, message, inquiry, URL submission, credential
change or new subscription is included. No candidate artifact is published or
committed. The tracked public/growth-show.xml rewrite risk remains open; the
runner checkout is disposable. Lint/typecheck and F4-F7 remain separate.

Record results and the proposed smallest follow-up in the PR conversation and
Rick's Working Brain. Independent review and Rick's approval precede any
subsequent repair merge. This temporary diagnostic workflow should not become
a permanent failing check on main.
