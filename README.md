# ClimbGroup Notebook

A community-driven platform for climbing and bouldering enthusiasts to upload, analyze, and reflect on their climbing sessions with automated Beta detection.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage, Real-time)
- **Deployment**: Vercel
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project

### Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

3. Run the Supabase migration SQL to set up your database schema

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start.

### Build

```bash
npm run build
```

## Features

- **Video Upload & Playback**: Upload climbing session videos with cloud storage
- **Beta Detection**: Automated climbing move detection with visual overlays
- **Community Groups**: Create and join climbing groups, share videos
- **Progress Dashboard**: Track your climbing journey over time
- **Annotations**: Add notes and feedback to specific video moments

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utilities and helpers
├── types/            # TypeScript type definitions
└── hooks/            # Custom React hooks
```

## Database Schema

The app uses the following main tables:
- `profiles` - User profiles
- `videos` - Uploaded climbing videos
- `beta_detections` - Detected climbing moves
- `groups` - Climbing groups
- `group_members` - Group membership
- `comments` - Video and group comments
- `annotations` - Video annotations

## License

MIT
