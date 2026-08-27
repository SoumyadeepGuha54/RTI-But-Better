# RTI But Better (Online RTI Portal)

A modern, citizen-centric web application designed to simplify the process of filing, tracking, and appealing Right to Information (RTI) requests with public authorities.

🔗 **Live Application:** [https://rti-but-better.vercel.app/](https://rti-but-better.vercel.app/)

![RTI But Better](public/favicon.svg)

---

## 🌐 Live Demo & Deployment

The application is deployed and live on Vercel:
- **Production URL**: [https://rti-but-better.vercel.app/](https://rti-but-better.vercel.app/)
- **Serverless API Endpoint**: `https://rti-but-better.vercel.app/api/chat`

---

## ✨ Features

- **Intuitive RTI Filing**: Guided multi-step form covering applicant details, public authority selection, request drafting with automated suggestions, document uploads, and simulated payment.
- **Smart RTI Assistant**: Built-in conversational AI assistant powered by Gemini (or OpenAI) to help citizens choose the correct public authority, refine drafting wording, and understand procedural steps.
- **Application Tracking**: Real-time lifecycle and milestone tracking (Submitted, Under Review, Response Available, Appeals) with registration verification.
- **First Appeal Workflow**: Simplified process to challenge incomplete responses, delayed replies, or unjustified refusals.
- **Personal Dashboard**: Track submitted requests, access downloaded documents/responses, and manage draft applications.
- **Interactive Help Center**: Searchable and categorized FAQ accordion for common RTI queries and legal guidance.
- **Accessible & Responsive**: High-contrast, clean civic design optimized across mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6
- **Icons**: Lucide React
- **Styling**: Modern CSS with typographic hierarchy & CSS variables
- **Backend / API**: Node.js HTTP server + Vercel Serverless Functions (`/api/chat`)
- **AI Integration**: Google Gemini API (`@google/genai` compatible endpoint / Google AI Studio) & OpenAI fallback support

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/rti-but-better.git
cd rti-but-better
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Gemini Configuration (Recommended)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Port for local backend API server (Optional)
PORT=8787
```

### 3. Run Locally

You can run the frontend development server and the backend chat API server:

```bash
# Terminal 1: Start Vite frontend (port 3000)
npm run dev

# Terminal 2: Start API backend (port 8787)
npm run api
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment (Vercel)

This application is deployed and hosted on **Vercel** at [https://rti-but-better.vercel.app/](https://rti-but-better.vercel.app/).

### Production Configuration

1. **Static Build**: `npm run build` generates the production frontend bundle into `dist/`.
2. **Serverless Functions**: The `/api/chat.js` function handles AI chatbot requests server-side.
3. **Environment Variables**:
   - `GEMINI_API_KEY`: Google Gemini API key
   - `GEMINI_MODEL`: `gemini-2.5-flash` (or `gemini-2.0-flash`)
4. **URL Rewrites**: Managed via `vercel.json` to handle client-side SPA routing and `/api/*` forwarding.

---

## 📁 Project Structure

```
├── api/                  # Vercel Serverless API routes (/api/chat)
├── public/               # Static assets & favicons (SVG, PNG)
├── server/               # Node.js backend server & AI prompt orchestrator
│   ├── ai/
│   │   ├── client.mjs    # AI provider callers (Gemini / OpenAI)
│   │   └── prompt.mjs    # System instructions & safety guardrails
│   └── index.mjs         # Standalone local HTTP API server
├── src/
│   ├── components/       # UI components (Header, Layout, Timeline, Chatbot)
│   ├── data/             # Mock authorities, FAQs, sample applications
│   ├── lib/              # Utility functions, lifecycles, formatting, types
│   ├── pages/            # Main views (Home, Dashboard, Track, Appeal, Help, Profile)
│   ├── store/            # Client demo state provider
│   ├── App.tsx           # Route definitions and filing workflow
│   └── main.tsx          # App entry point
├── vercel.json           # Vercel routing & rewrites configuration
├── vite.config.ts        # Vite configuration & dev proxy
└── package.json
```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
