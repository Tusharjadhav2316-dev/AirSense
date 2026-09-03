# 08 — Testing Guide

## Priority Order (given limited time, test in this order)
1. The agentic advice endpoint (`/agent/advice`) — this is the graded core
2. RAG retrieval quality — bad retrieval breaks everything downstream
3. Data analytics correctness (anomaly detection math)
4. Frontend click-through of all 8 pages
5. Auth flows

## Backend Testing
- Unit test the anomaly detection logic with known hardcoded data (see
  Sprint 1 Day 4) — confirm the math, not just "it runs"
- Manually test `/agent/advice` across a matrix: 4 AQI categories x 4
  health profiles = 16 combinations minimum, spot-check at least 8
- Manually test retrieval quality with the 5 queries listed in Sprint 2
  Day 6 — this is qualitative judgment, not automatable easily at this
  scale

## Frontend Testing
- Manual click-through, not automated tests, given the timeline — but be
  systematic: use the checklist in Sprint 4 Day 15
- Test at both desktop and mobile (375px) viewport widths
- Test with a slow network throttle (browser dev tools) to confirm
  loading states actually show up, not just work by coincidence on fast
  connections

## What NOT to Over-Invest In
Given 18 days, don't build a full automated test suite (Jest/Pytest CI
pipeline) unless there's spare time in the Day 18 buffer — manual,
systematic testing following the checklists above is sufficient for this
scope and timeline, and more time is better spent on RAG/agent quality.
