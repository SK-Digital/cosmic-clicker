# Cosmic Clicker

A cosmic-themed incremental clicker game available on both mobile and web platforms. Players can collect cosmic energy, upgrade their clicking power, and explore space-themed upgrades.

## Features

- **Incremental Gameplay**: Click to generate cosmic energy and unlock upgrades
- **Cross-Platform**: Available on mobile (React Native/Expo) and web (React/Vite)
- **Cloud Sync**: Supabase backend for saving progress across devices
- **Modern UI**: Beautiful space-themed interface with smooth animations

## Tech Stack

- **Mobile App**: React Native, Expo, TypeScript
- **Web App**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Supabase (database and authentication)
- **Icons**: Lucide React

## Project Structure

```
├── cosmic-clicker-mobile/     # React Native mobile app
│   ├── app/                   # Expo Router pages
│   ├── components/            # Reusable components
│   └── package.json
├── cosmic-clicker-website/    # React web app
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   └── package.json
└── README.md                  # This file
```

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cosmic-clicker
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Create a `.env` file in the root directory:
   ```
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 3. Install Dependencies

**For Mobile App:**
```bash
cd cosmic-clicker-mobile
npm install
```

**For Web App:**
```bash
cd cosmic-clicker-website
npm install
```

### 4. Configure Supabase Tables

Create the following tables in your Supabase dashboard:

- `user_progress` - Store user game progress
- `upgrades` - Available upgrades
- `achievements` - Game achievements

## Running the Apps

### Mobile App

```bash
cd cosmic-clicker-mobile
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

### Web App

```bash
cd cosmic-clicker-website
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

### Building for Production

**Mobile:**
```bash
cd cosmic-clicker-mobile
expo build:android  # or build:ios
```

**Web:**
```bash
cd cosmic-clicker-website
npm run build
```

### Testing

**Web App:**
```bash
cd cosmic-clicker-website
npm run test:e2e  # Runs Playwright tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
