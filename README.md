# Cine-Stream

A responsive React + Vite movie discovery app with infinite scroll, favorites, and animated movie summaries.

## Features

- Search movies with debounced input
- Infinite scroll movie loading
- Save/remove favorites (persisted in `localStorage`)
- Click any movie card to open a details modal
- Animated plot summary reveal in the modal
- Optional YouTube trailer embed
- Mobile-friendly responsive layout and interactions

## UX Notes

- The modal closes on background click, close button, or `Esc`.
- Keyboard focus styles are included for interactive controls.
- Card details and spacing adapt for desktop and mobile screens.

## Tech Stack

- React 19
- Vite 7
- React Router
- Framer Motion
- TMDb API
- YouTube Data API

## Environment Variables

Create a `.env` file in project root:

```env
VITE_TMDB_API_KEY=your_tmdb_key
VITE_YOUTUBE_API_KEY=your_youtube_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GEMINI_MODEL=gemini-1.5-flash
```

`VITE_GEMINI_API_KEY` is only required if you use the mood matcher flow.
`VITE_GEMINI_MODEL` is optional.

## Run Locally

```bash
npm install
npm run dev
```

## GitHub Setup

### 1) What files should NOT be pushed

```bash
node_modules/
dist/
.env
.env.*
*.log
```

These are already covered in `.gitignore`. Keep a safe template like `.env.example` for shared variable names.

### 2) Initialize local repo (if not already)

```bash
git init
git branch -M main
```

### 3) Commit your code

```bash
git add .
git status
git commit -m "Initial commit"
```

### 4) Create a GitHub repository

- Create an empty repo on GitHub (do not auto-add README/.gitignore/license since project already has them).

### 5) Connect and push

HTTPS:

```bash
git remote add origin https://github.com/<your-username>/cine-stream.git
git branch -M main
git push -u origin main
```

SSH:

```bash
git remote add origin git@github.com:<your-username>/cine-stream.git
git branch -M main
git push -u origin main
```

### 6) Day-to-day update flow

```bash
git add .
git commit -m "Describe your change"
git push
```

### 7) Pull latest changes

```bash
git pull origin main
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
```


