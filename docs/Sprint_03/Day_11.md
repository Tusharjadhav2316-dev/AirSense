# Sprint 3 — Day 11: Landing & Login/Signup Pages

## Prompt for Antigravity

```
Build the first two pages of AirSense using yesterday's component library.
Reference 14_UI_UX_Guide.md pages 1-2 and 22_Product_Requirements.md for
exact requirements.

TASK:
1. Build `src/pages/Landing.tsx`:
   - Hero: NOT a big AQI widget. Show a sample/example AI recommendation
     sentence as the headline (can be a realistic hardcoded example for
     the landing page only — real data isn't needed until dashboard),
     with a small AQI category badge off to the side as supporting
     evidence
   - 3-step "how it works" section (real-time data → grounded AI
     reasoning → personalized action)
   - Trust section referencing WHO/EPA as data sources
   - CTA button → routes to /signup

2. Build `src/pages/Auth.tsx` (handles both login and signup, toggle
   between modes):
   - Login: email/password → calls backend auth endpoint (build this
     backend endpoint now if it wasn't done in Sprint 1 — simple JWT
     login/signup using the User model)
   - Signup: email/password + a visible, non-buried step for home
     location (search input, calls the geocoding helper from backend) +
     health profile picker (None/Asthma/Elderly/Child) — store this on
     the User model
   - On successful auth, store JWT (localStorage or memory + refresh
     pattern — keep simple for this scope) and redirect to /dashboard

3. Set up `src/context/AuthContext.tsx` — global auth state, including the
   user's health profile, since that drives personalization on nearly
   every other page.

4. Set up React Router in `App.tsx` with routes for all 8 pages
   (placeholders okay for pages not yet built), with a protected-route
   wrapper redirecting unauthenticated users to /login.

Test: full signup flow works end to end (create account → pick location +
profile → land on dashboard placeholder), and login works for an existing
account.
```
