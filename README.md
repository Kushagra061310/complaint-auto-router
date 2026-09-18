# College Complaint Auto-Router

A lightweight prototype that classifies a student complaint (typed as free text)
into one of 5 categories and routes it to the relevant department automatically.

## Categories
- Academic
- Hostel/Infrastructure
- Administrative
- IT/Technical
- Faculty/Staff Behavior (flagged for mandatory human review, not auto-resolved)

## How it works
- `index.html` / `style.css` / `script.js` — the complaint submission form
- `api/classify.js` — a Vercel serverless function that scores the complaint
  text against keyword lists for each category and returns the best match

No build step, no external dependencies, no database — deploys as-is on Vercel.
