# AnonConnect

<div align="center">

![AnonConnect](https://img.shields.io/badge/AnonConnect-WebRTC-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-green?style=for-the-badge)

**Connect with random strangers worldwide through voice and chat**

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Deployment](#deployment)

</div>

---

## Overview

**AnonConnect** is a modern, real-time anonymous communication platform that connects strangers worldwide through WebRTC-powered voice calls and text chat. Built with Next.js 15, TypeScript, and Socket.IO, it offers a seamless and secure peer-to-peer communication experience.

## Features

### Core Functionality
- **Random Matching** - Instantly connect with random strangers from around the world
- **Country-Based Matching** - Filter matches by specific countries or regions
- **WebRTC Voice Calls** - High-quality, peer-to-peer audio communication
- **Real-Time Chat** - Send and receive text messages using RTCDataChannel
- **Dialer Interface** - Beautiful, interactive dialer with tap functionality
- **Next Button** - Skip to the next stranger with a single click

### Technical Highlights
- **Peer-to-Peer Architecture** - Direct WebRTC connections for privacy and low latency
- **Smart Matching Engine** - FIFO queue system with global and country-specific queues
- **Auto-Reconnect** - Handles network changes and connection drops gracefully
- **AI-Powered Feedback** - Google Generative AI analyzes user feedback for improvements
- **Beautiful UI** - Framer Motion animations and Tailwind CSS styling
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

**Frontend:**
- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Socket.IO Client
- shadcn/ui components
- WebRTC API

**Backend:**
- Node.js with Express
- Socket.IO Server
- TypeScript

**AI Integration:**
- Google Generative AI (Gemini)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0.0 or higher
- npm or yarn
- Git

## Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yaseenlenceria/AnonConnect.git
cd AnonConnect
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your configuration:

\`\`\`env
# Signaling Server URL
NEXT_PUBLIC_SIGNALING_SERVER_URL=http://localhost:3001

# Google Generative AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
\`\`\`

To get a Google AI API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your \`.env.local\` file

### 4. Run the application

**Development mode (runs both frontend and backend):**

\`\`\`bash
npm run dev:all
\`\`\`

This command concurrently runs:
- Next.js frontend on `http://localhost:3000`
- Signaling server on `http://localhost:3001`

**Or run them separately:**

Terminal 1 (Frontend):
\`\`\`bash
npm run dev
\`\`\`

Terminal 2 (Signaling Server):
\`\`\`bash
npm run server
\`\`\`

### 5. Access the application

Open your browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

## Usage

### Quick Start

1. **Select Region** - Choose "Global" or a specific country
2. **Start Connecting** - Click the button to join the matching queue
3. **Chat & Talk** - Once matched, use voice and text to communicate
4. **Next/End** - Skip to the next stranger or end the call

### Using the Dialer

1. Click **"Open Dialer"** on the home screen
2. Enter a user ID or tap **Shuffle** for random matching
3. Press the green call button to connect

### Features in Connected State

- **Voice Chat** - Automatic peer-to-peer audio connection
- **Text Messaging** - Send and receive instant messages
- **Next** - Disconnect and find a new stranger
- **End** - End the call and provide feedback

## Architecture

### Matching Engine

The signaling server uses intelligent queue management:

\`\`\`
┌─────────────────────────────────────┐
│         Signaling Server            │
├─────────────────────────────────────┤
│  Global Queue: [user1, user2, ...]  │
│  US Queue: [user3, user4, ...]      │
│  UK Queue: [user5, ...]             │
│  ...                                │
└─────────────────────────────────────┘
\`\`\`

**Matching Logic:**
1. User joins queue (global or country-specific)
2. Server checks for waiting users in the same queue
3. If found, immediately pair them (FIFO)
4. If not, add user to queue
5. When paired, exchange WebRTC offer/answer

### WebRTC Flow

\`\`\`
User A                 Signaling Server              User B
  │                           │                         │
  ├──── join-queue ──────────>│                         │
  │                           ├──── matched ───────────>│
  │                           │<─── join-queue ─────────┤
  │<──── matched ─────────────┤                         │
  │                           │                         │
  ├──── offer ───────────────>│──── offer ─────────────>│
  │                           │<─── answer ─────────────┤
  │<──── answer ──────────────┤                         │
  │                           │                         │
  ├──── ice-candidate ───────>│──── ice-candidate ─────>│
  │                           │                         │
  │<════ Direct P2P Connection ═════════════════════════>│
  │          (Audio + DataChannel)                      │
\`\`\`

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - \`NEXT_PUBLIC_SIGNALING_SERVER_URL\` - Your deployed signaling server URL
   - \`GOOGLE_GENERATIVE_AI_API_KEY\` - Your Google AI API key
4. Deploy

### Backend (Railway/Render/Heroku)

**Using Railway:**

1. Visit [Railway](https://railway.app)
2. Create a new project from your GitHub repository
3. Set the start command: \`npm run server\`
4. Set environment variable \`PORT\` (Railway auto-provides this)
5. Deploy

**Using Render:**

1. Visit [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Build command: \`npm install\`
5. Start command: \`npm run server\`
6. Deploy

### TURN Server (Optional)

For users behind restrictive NATs/firewalls, configure a TURN server:

1. Set up [Coturn](https://github.com/coturn/coturn) or use [Twilio TURN](https://www.twilio.com/stun-turn)
2. Update \`hooks/use-anon-connect.ts\`:

\`\`\`typescript
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  {
    urls: 'turn:your-turn-server.com:3478',
    username: 'username',
    credential: 'password'
  }
];
\`\`\`

## Project Structure

\`\`\`
AnonConnect/
├── app/                      # Next.js app directory
│   ├── actions.ts           # Server actions (feedback)
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page with animations
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── anon-connect.tsx     # Main UI component
│   ├── dialer.tsx           # Dialer component
│   └── icons.tsx            # Icon components
├── hooks/                   # Custom React hooks
│   └── use-anon-connect.ts  # WebRTC connection hook
├── lib/                     # Utility functions
│   ├── countries.ts         # Country data
│   └── utils.ts             # Helper functions
├── server/                  # Backend server
│   └── index.ts             # Socket.IO signaling server
├── ai/                      # AI integration
│   ├── flows/               # Genkit flows
│   └── genkit.ts            # AI configuration
├── .env.example             # Environment variables template
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
\`\`\`

## Scripts

| Script | Description |
|--------|-------------|
| \`npm run dev\` | Start Next.js development server |
| \`npm run server\` | Start signaling server |
| \`npm run dev:all\` | Start both frontend and backend concurrently |
| \`npm run build\` | Build for production |
| \`npm start\` | Start production server |
| \`npm run lint\` | Run ESLint |

## Browser Support

AnonConnect requires a browser with WebRTC support:

- Chrome/Edge 56+
- Firefox 44+
- Safari 11+
- Opera 43+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Socket.IO](https://socket.io/) - Real-time bidirectional communication
- [WebRTC](https://webrtc.org/) - Peer-to-peer communication
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Google Generative AI](https://ai.google.dev/) - AI-powered features

## Support

For support, please open an issue in the GitHub repository.

---

<div align="center">

**Made with ❤️ by the AnonConnect Team**

[⬆ Back to Top](#anonconnect)

</div>
