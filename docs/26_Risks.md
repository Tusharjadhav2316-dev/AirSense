# 26 — Risks

## 1. RAG quality risk (highest impact)
**Risk:** Poor PDF text extraction or bad chunking leads to irrelevant
retrieval, which makes the AI advice generic/wrong despite "using RAG."
**Mitigation:** Manual quality check built into Sprint 2 Day 5-6 — don't
skip the manual review steps even under time pressure.

## 2. Timeline risk on RAG/Agent sprint (Sprint 2)
**Risk:** This is the most technically involved sprint; delays here
threaten the whole timeline.
**Mitigation:** Sprint 4 has an explicit buffer day; borrow from it before
cutting Sprint 3 (frontend) short — grading weight favors a working
RAG/agent core over full UI polish.

## 3. Free-tier LLM/API cost or rate limits
**Risk:** Free LLM credits could run out during heavy testing.
**Mitigation:** Use the rule-based skip for "Good" AQI category to reduce
unnecessary LLM calls; batch manual testing rather than looping
constantly during development.

## 4. Deployment free-tier limitations
**Risk:** Free backend hosting tiers (Render/Railway) may spin down after
inactivity, causing a slow first request during a live demo.
**Mitigation:** Mention this openly if presenting live ("first request may
take a few seconds to wake the server") rather than being caught off
guard.

## 5. Scope creep
**Risk:** Adding "just one more feature" eats into RAG/agent quality time.
**Mitigation:** 25_Backlog.md exists specifically to catch these ideas
without acting on them mid-sprint.

## 6. "Looks like a weather app" perception risk
**Risk:** If the recommendation-first hierarchy isn't implemented
correctly in the UI, the core differentiation becomes invisible.
**Mitigation:** Explicit self-check built into Sprint 3 Day 12's prompt —
screenshot comparison against a generic weather app before moving on.
