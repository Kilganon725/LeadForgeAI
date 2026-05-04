# LeadForge AI

Current version: `1.3.2`

LeadForge AI is a simple web app for generating B2B outreach copy for foreign trade sales.  
It creates:

- Cold email
- WhatsApp first message
- Follow-up messages
- English and Chinese versions for the main email

## Features

- Simple HTML + TailwindCSS front end
- Node.js + Express backend
- DeepSeek API integration
- Light and dark mode
- English / Chinese language switch

## Versioning

- `1.0.0` base release
- `1.1.0` current UI/history update
- `1.2.0` WhatsApp Chinese version + follow-up language toggle
- `1.3.0` new theme picker with rainbow flow and glass grid
- `1.3.1` theme menu stacking fix
- `1.3.2` glass theme menu contrast fix
- Increase the major version for larger breaking changes

## Tech Stack

- Frontend: HTML, TailwindCSS, vanilla JavaScript
- Backend: Node.js, Express
- AI: DeepSeek API

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Use the example file as a reference:

```bash
cp .env.example .env
```

Then fill in your DeepSeek API key:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 3. Start the app

```bash
npm start
```

Open:

```bash
http://localhost:3000
```

## Project Structure

```text
.
├── public/
│   └── index.html
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Notes

- Do not commit `.env` to GitHub.
- The app expects `DEEPSEEK_API_KEY` to be available in the environment.
- If you change `.env`, restart the server.
