# 🚀 Hiremate — Next-Gen AI Interview Readiness Simulator

<div align="center">

![Hiremate Banner](https://img.shields.io/badge/Hiremate-Interview_Platform-indigo?style=for-the-badge&logo=rocket)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**An ultra-realistic, multi-track AI interview practice platform designed for Product Managers, AI Engineers, and Tech Leaders.**  
Experience real-time dynamic questioning, live speech synthesis, live audio frequency waveforms, neural reasoning telemetry, and structured benchmark evaluations.

[Explore Tracks](#-interview-tracks) • [Features](#-core-features) • [Quickstart](#-getting-started) • [Tech Stack](#-tech-stack) • [Roadmap](#-roadmap)

---

</div>

## 🌟 Overview

**Hiremate** bridges the gap between passive interview prep and the high-pressure environment of FAANG / Tier-1 tech interviews. Powered by modern LLMs and real-time audio visualization, Hiremate simulates authentic interviewer personas who challenge your frameworks, stress-test your trade-offs, and assess both behavioral & analytical competency.

---

## 🎯 Interview Tracks & Frameworks

Hiremate offers comprehensive mock interview simulations spanning both core management and cutting-edge AI product disciplines:

### 1. 💼 Core Product Management (Core PM)
* **Product Sense & Design**: Problem discovery, user personas, journey mapping, solutions, prioritization, and MVP design.
* **Product Strategy & Vision**: Moats, flywheel dynamics, market entry, competitive defense, pricing, and 3-5 year roadmaps.
* **Metrics & Execution**: North Star metric selection, counter-metrics, funnel diagnosis, root cause analysis, and A/B test structuring.
* **Behavioral & Leadership**: STAR method coaching, cross-functional stakeholder conflict resolution, failure post-mortems, and engineering partnership.

### 2. 🤖 AI & Technical Product Management (AI PM)
* **AI System Design & Architecture**: Evaluation of RAG pipelines, Vector DB latency, context window economics, and multi-agent topologies.
* **Model Selection & Trade-offs**: Latency vs. accuracy trade-offs, parameter sizing (SLMs vs. LLMs), and fine-tuning vs. prompt-engineering.
* **Data Flywheels & Continuous Feedback**: RLHF/DPO loops, active learning, data curation pipelines, and data moat engineering.
* **AI Ethics, Safety & Hallucination Mitigation**: Red-teaming strategies, guardrail enforcement, hallucination detectors, and compliance frameworks.

---

## ⚡ Core Features

- 🎙️ **Live Interactive Audio & Speech Waveform**: Real-time microphone input visualization with custom canvas audio frequency oscillators.
- 🧠 **Neural Reasoning Graph**: Interactive visual graphs mapping candidate argumentation flow, depth of thought, and structural integrity.
- 🔮 **Adaptive Multi-Persona Interviewer**: AI interviewer personas ranging from encouraging coaches to rigorous technical bar-raisers.
- 📊 **Instant Benchmarking & Multi-Dimensional Feedback**: Scorecards analyzing communication clarity, strategic thinking, analytical rigor, and technical depth.
- 📋 **Syllabus & Question Tracks Explorer**: Full searchable question library covering standard, advanced, and emerging product scenarios.
- 🌓 **Modern Cyberpunk / Glassmorphic UI**: High-contrast, dark-mode-first aesthetic with smooth micro-animations and zero clutter.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), PostCSS, Autoprefixer
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI / SDK Integration**: [@ai-sdk/react](https://sdk.vercel.ai/), OpenAI & Google AI SDKs, Vercel AI SDK
- **Backend / Storage (Optional)**: [Supabase](https://supabase.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm`, `yarn`, or `pnpm`

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/asvinpradeep04/Hiremate_project.git
   cd Hiremate_project
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the project root:
   ```env
   # AI Provider API Keys (optional for full live API generation)
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional Supabase Integration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Starts Vite dev server with hot module reloading |
| `npm run build` | Compiles TypeScript and builds production-ready bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to verify code quality |
| `npm run typecheck` | Validates TypeScript types across the project |

---

## 📂 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components (Header, AudioWaveform, AICoreSphere, etc.)
│   ├── data/               # Simulation data, question banks, tracks, and cases
│   ├── hooks/              # Custom React hooks (audio, recognition, state)
│   ├── screens/            # Application views (Landing, Setup, Interview, Feedback, etc.)
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── App.tsx             # Root routing and application state orchestrator
│   └── main.tsx            # React application entry point
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Custom theme, colors, and styling rules
└── vite.config.ts          # Vite build and plugin configurations
```

---

## 🤝 Contributing

Contributions, feedback, and track suggestions are always welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add amazing new feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Crafted with passion for aspiring PMs & Tech Leaders worldwide. 🌟
</div>
