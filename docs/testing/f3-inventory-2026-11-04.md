# F3 test coverage: discovery and content follow-up batches

Original inventory baseline: `0279a89b1b930ed65cb2f7103e13dde01c98c544` (merged PR #106).
Batch-two baseline: `b5e239e185c8e09cf1ab339402140e097a2483e9` (merged PR #107).
This is a scoped wiring inventory, not a runtime audit or an all-tests result.
The source of truth for executed results is the candidate's GitHub Actions log.
An unmerged candidate is not active coverage on main.

## Why this batch

The first independent review identified 15 tests without npm wiring and a
podcast suite outside the release gate. Its follow-up recommended separating
F3 from the F2 repair and checking existing tests before enabling them.
PR #107 added the three discovery files unchanged. Batch two selects the two
content-to-inquiry files unchanged: five helper-runtime cases plus four cases
that execute Contact.jsx with simulated hooks and submission responses.
Neither selected suite's assertions change. Application behavior, content,
dependencies and the F2/IndexNow fixes are unchanged.

The new `test:content-follow-up` command is appended with `&&` after the exact
PR #107 `check:ci` chain, including `test:discovery`. Existing tests and their
order are preserved. A nonzero exit
still fails the job. GitHub's existing no-network step runs the extended chain;
no live diagnostic, email, interpretation request or URL submission is added.

## Baseline inventory and disposition

These 16 files existed under `tests/` but were not reached by the original
PR #106 release workflow or its recursively invoked npm scripts. PR #107
covered three; batch two proposes two more, leaving 11 ungated after approval.
The first 15 had no npm test
command; `growth-show-podcast` already had `test:podcast`, but was not gated.
All names below end in `.test.mjs`. No remaining file has been deleted, retired
or declared correct merely because it is deferred.

| File stem | Current / proposed disposition | Evidence / next action |
| --- | --- | --- |
| discovery-input-mode | Required since PR #107 | Five source-structure cases: voice/text choices, microphone recovery, consent guards, saved-answer progression and storage-failure handling. Not browser or backend execution. |
| discovery-question-selection | Required since PR #107 | Two runtime selector cases. Imports the dependency-free walkthrough module; no service calls. |
| discovery-trigger-routing | Required since PR #107 | Four source-structure cases for the fixed internal transport, credential forwarding and event guards. Does not execute the backend handler. |
| content-journey | Batch two: add unchanged | Five runtime helper cases: context handoff without private query values, rejected destinations, safe learning links, published video relationships and follow-up details. Verify all five in the candidate log. |
| content-follow-up-form | Batch two: add unchanged | Four runtime Contact.jsx harness cases: reply preference, one in-flight submission with context, failed/unconfirmed response handling and an editable unsent Guide draft. Uses existing locked TypeScript and React; verify all four in the candidate log. |
| growth-show | Still ungated | Previous reviewer reported passing; reproduce before adding. |
| video-gallery | Still ungated | Obtain a dependency-complete, isolated result before disposition. |
| youtube-learning-identity | Still ungated | Previous reviewer reported passing; reproduce before adding. |
| ai-confusion-lesson | Still ungated | Prior review reported failures, including absent build output. Separate artifact availability from assertion/content questions. |
| ai-foundations-conversation-lesson | Still ungated | Prior source-test failure; verify approved meaning before changing source or expectations. |
| ai-foundations-editorial | Still ungated | Prior source-test failure; verify approved meaning before changing source or expectations. |
| brand-positioning | Still ungated | Prior wording mismatch; compare with approved NTA positioning, not majority AI opinion. |
| homepage-business-audiences | Still ungated | Prior failures include absent build output; rerun with artifacts and review wording separately. |
| homepage-live-review | Still ungated | Prior source-test failures; content/structure review required. |
| talk-to-my-office-homepage | Still ungated | Prior source-test failures; content/structure review required. |
| growth-show-podcast | Still ungated | Existing test:podcast is not required by check:ci. Reproduce separately before enabling. |

Historical reviewer results above are leads for triage, not fresh results for
this commit and not proof of a live application defect. Lint and typecheck also
remain open. Do not repeat the withdrawn expanded-suite counts from the first
PR #106 evaluation: its build stopped before that suite ran.

## Verification and review

Before readiness, inspect the actual candidate Actions log, not just its badge.
Require the entire previous gate, including all 11 discovery cases, to finish.
Then `test:content-follow-up` must actually run and report all nine cases
passing, with zero failed or skipped tests. The release-check guard must reject
removing the appended command, omitting either file, suppressing failures or
reordering the prior chain.
The new guard is structural; the existing Node tests still determine pass/fail.

Claude reviews the exact base-to-head difference before Rick considers merging.
Passing this batch establishes only these automated checks. It does not verify
microphones, browser validation, live consent, Turnstile, Core delivery, mailbox
receipt, current podcast data, indexing or sales. The form harness replaces
React hooks and the verified submission client; it is not an end-to-end test.
Read the actual run for this candidate, not historical reviewer results.

Candidate builds remain disposable and must not be published or committed.
The tracked generated-feed risk from PR #106 remains open; no output-path or
working-tree guard is implemented here. No new schedule, service or paid model
connection is activated. Rollback before approval is to leave the draft unmerged;
after approval, revert only this batch to restore the previous gate.
