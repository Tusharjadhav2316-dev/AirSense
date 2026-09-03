# 04 — Project Rules (for Antigravity / any AI coding agent)

These rules apply to every prompt in every sprint. Paste this file's content
as a standing "system" instruction if the tool supports it, otherwise
reference it at the top of Day 1's prompt.

## Non-Negotiable Rules
1. **Never fabricate data.** If Open-Meteo doesn't return a value, show a
   clear "data unavailable" state — never invent a plausible-looking number.
2. **Every AI-generated health recommendation must show its source.** No
   ungrounded advice reaches the UI. If retrieval returns nothing relevant,
   the system must say so rather than let the LLM freewheel.
3. **Recommendation-first hierarchy, always.** No page should ever put a
   raw AQI number as the largest/first element. The AI reasoning/
   recommendation is always the visual and logical headline (see
   14_UI_UX_Guide.md).
4. **Use the design tokens file, not ad-hoc styling.** All colors,
   spacing, and type must come from the shared token system — no one-off
   hex codes or magic-number spacing in components.
5. **Keep the RAG knowledge base small and high-quality**, not large and
   noisy. 2-3 authoritative sources (WHO, EPA), well-chunked, beats a huge
   scraped corpus.
6. **Health profile data is sensitive.** Treat it as private user data —
   never log it in plaintext logs, never send it anywhere beyond the LLM
   call needed to generate personalized advice.
7. **Don't build features not in 22_Product_Requirements.md.** If an idea
   seems good mid-sprint, note it in 25_Backlog.md instead of building it
   now.

## Code Style
- TypeScript strict mode on (frontend)
- Type hints on all Python functions (backend)
- No commented-out dead code left in commits
- Environment variables for all API keys/secrets — never hardcoded (see
  06_API_Keys_and_Setup.md)

## When the Agent Is Unsure
If a prompt is ambiguous about implementation details, the agent should
pick the simplest working solution consistent with the architecture doc
and note the assumption in a code comment — not block on asking, since
these prompts are meant to be run somewhat unattended sprint-by-sprint.

## Definition of Done (per sprint task)
A task is only "done" when:
- It runs without errors
- It matches the relevant requirement in 22_Product_Requirements.md
- It doesn't violate any rule above
- It's committed with a clear commit message (see 15_Git_Workflow.md)
