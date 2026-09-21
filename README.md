# Complaint Router

An AI-based complaint triage and auto-routing system for college/institutional use. Students submit a complaint as free text; the system automatically classifies it into one of five categories and routes it to the relevant department — removing the manual sorting step colleges currently do by hand (email threads, physical complaint boxes).

## Live demo

[https://complaint-auto-router.vercel.app](https://complaint-auto-router.vercel.app)

## How it works

The complaint text is lowercased and scored against a keyword list for each category. The category with the highest keyword match count wins; ties or zero matches default to **Administrative**, since that office can always manually re-forward a misrouted complaint. The matched keywords are returned alongside the result so the classification is explainable, not a black box.

**Categories and routing:**

| Category | Routed to |
|---|---|
| Academic | Academic Affairs Office |
| Hostel/Infrastructure | Hostel & Facilities Management |
| Administrative | Administrative Office |
| IT/Technical | IT Support Desk |
| Faculty/Staff Behavior | Dean of Student Affairs — **human review required** |

Complaints classified as **Faculty/Staff Behavior** are never auto-resolved. They are flagged `needsHumanReview: true` and routed for mandatory manual review instead, since misconduct-related complaints are too sensitive for full automation.

## Tech stack

- Plain HTML/CSS/JavaScript frontend — no frameworks
- Vercel serverless function (`api/classify.js`) for classification — no external ML libraries, no database
- Rule-based keyword scoring, chosen deliberately over a trained ML model for full transparency and zero deployment/dependency risk within a one-day build window

## Why rule-based, not ML

A trained classifier (TF-IDF, embeddings, or a transformer) was considered but not used, given the project timeline. Rule-based keyword scoring is fully explainable — every classification can be traced to the exact words that triggered it — which fits this project's core positioning: a transparent, inspectable alternative to opaque enterprise systems, not a black box.

## Market positioning

Enterprise platforms like Zendesk, Freshdesk, and Salesforce Service Cloud already offer AI-based complaint/ticket routing. This project does not claim to be the first system of its kind — it claims to be a **lightweight, free, explainable, purpose-built version for a context those platforms don't specifically serve**: colleges, which typically rely on email or physical complaint boxes rather than paid enterprise ticketing software.

## Limitations

- Keyword matching cannot understand context, sarcasm, or complaints that genuinely span multiple categories — it picks whichever category has the most keyword overlap.
- No persistence: complaints are classified per-request and not stored or tracked through resolution.
- Small, hand-labeled keyword lists, not a trained model — coverage will miss phrasing outside the anticipated vocabulary.

## Future scope

Not built, intentionally kept out of the core deliverable to stay reliable within a one-day timeline:

- Sentiment/urgency detection
- Duplicate complaint clustering via embeddings
- Full resolution-tracking lifecycle (status updates, closure)

## Running locally

```bash
npm install
vercel dev
```

## Project structure

```
complaint-router/
├── index.html      → complaint submission form
├── style.css        → styling
├── script.js        → sends complaint text to the API, displays result
├── package.json      → Node project config for Vercel
├── README.md
└── api/
    └── classify.js  → serverless function: keyword-scores the complaint,
                        returns category, routed department, and human-review flag
```
