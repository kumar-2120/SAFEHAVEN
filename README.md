# SafeHaven (React + Vite)

SafeHaven is a support-focused web app built with React and Vite.

## Run Locally

1. Install dependencies:

	npm install

2. Start development server:

	npm run dev

3. Build for production:

	npm run build

## CodeSandbox Notes

- Use:

  npm install
  npm start

- The project is configured to bind correctly for sandbox preview ports.

## Deploy on Render

This repo includes `render.yaml` for blueprint deployment.

### Option A: Blueprint (recommended)

1. Push your latest code to GitHub.
2. In Render, click **New +** → **Blueprint**.
3. Select this repository.
4. Deploy.

### Option B: Manual Static Site

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

For SPA routing, keep rewrite to `/index.html` (already configured in `render.yaml`).
