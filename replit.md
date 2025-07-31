# MemsLearn - English Learning Web Application

## Overview

MemsLearn is an English-learning web application that uses Reddit memes as the foundation for interactive, personalized vocabulary lessons. The application fetches memes from English-based subreddits and generates AI-powered vocabulary-focused lessons tailored to different English proficiency levels (beginner, intermediate, advanced).

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Architecture Pattern**: Minimal API approach - primarily serves static assets
- **Database**: Client-side only (IndexedDB) - no traditional backend database
- **External APIs**: Direct frontend calls to Reddit API and OpenAI API

### Data Storage Strategy
- **Client Storage**: IndexedDB for caching memes, lessons, and user progress
- **No Server Database**: All data persistence happens client-side
- **Caching Strategy**: Memes and lessons cached locally for offline access

## Key Components

### Meme Management
- **MemeCard**: Individual meme display component with Reddit metadata
- **MemeFeed**: Infinite scroll feed of memes from English subreddits
- **Meme Fetching**: Direct API calls to Reddit with fallback to meme API proxy

### Lesson System
- **LevelSelector**: Choose English proficiency level (beginner/intermediate/advanced)
- **LessonContent**: Generated lesson display with vocabulary and cultural context
- **InteractiveQuiz**: Dynamic quiz questions based on meme content

### Learning Features
- **Vocabulary Learning**: Extract and teach 5-8 key words from memes with level-appropriate definitions
- **Interactive Exercises**: 8-12 diverse quiz questions (multiple choice, fill-in-the-gap, true/false)
- **Mobile-Friendly Interface**: Bottom navigation for easy mobile access to saved lessons and account

## Data Flow

1. **Meme Discovery**: User browses infinite scroll feed of Reddit memes with proper aspect ratio display
2. **Lesson Initiation**: User clicks meme → navigates to lesson page
3. **Language Selection (Optional)**: User can choose from 20 languages to get meme explanation in their native language
4. **Meme Explanation**: OpenAI analyzes image and text to provide cultural context and humor explanation
5. **Level Selection**: User selects English proficiency level via improved desktop/mobile interface
6. **AI Generation**: OpenAI generates vocabulary-focused lesson (no meme descriptions) via server proxy
7. **Interactive Learning**: User completes 8-12 vocabulary exercises and quiz questions
8. **Progress Tracking**: Results saved to IndexedDB with account statistics and saved lessons management

## External Dependencies

### APIs
- **Reddit API**: Primary source for English memes from subreddits
- **Meme API Fallback**: Backup meme source (meme-api.com)
- **OpenAI API**: GPT-4 for generating personalized lessons

### Key Libraries
- **@neondatabase/serverless**: Database connectivity (Drizzle setup)
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/react-***: Accessible UI components
- **drizzle-orm**: Database ORM (configured but using IndexedDB instead)
- **wouter**: Lightweight routing library

## Deployment Strategy

### Development
- **Dev Server**: Vite development server with HMR
- **API Proxy**: Express server for development API routes
- **Database**: Drizzle configured for PostgreSQL (future use)

### Production
- **Build Process**: Vite builds React app to static assets
- **Server**: Express serves static files and minimal API endpoints
- **Database**: Currently IndexedDB only, Drizzle ready for PostgreSQL addition

### Environment Configuration
- **OpenAI API Key**: Required for lesson generation
- **Database URL**: Configured for future PostgreSQL integration
- **Reddit API**: Direct client-side API calls

## Recent Changes

**2025-01-31**: Updated OpenAI API integration to use Vision models
- Modified `/api/explain-meme` endpoint to analyze both meme images and text
- Updated `/api/generate-lesson` endpoint to use visual analysis for vocabulary extraction
- Both endpoints now use GPT-4V (vision) for comprehensive meme understanding
- Enhanced accuracy by processing both visual elements and text content

## Architecture Decisions

### Client-Side Data Storage
**Problem**: Need to store memes, lessons, and user progress
**Solution**: IndexedDB for client-side persistence
**Rationale**: Reduces server complexity, enables offline functionality, faster access to cached content

### Direct API Integration
**Problem**: Need meme content and AI lesson generation
**Solution**: Frontend makes direct calls to Reddit API and OpenAI
**Rationale**: Simpler architecture, reduces server load, leverages browser capabilities

### Component-Based UI
**Problem**: Need consistent, accessible UI components
**Solution**: shadcn/ui with Radix UI primitives
**Rationale**: Pre-built accessibility, consistent design system, TypeScript support

### Minimal Backend
**Problem**: Application needs some server functionality
**Solution**: Lightweight Express server serving static assets
**Rationale**: Simple deployment, focus on frontend functionality, ready for future backend expansion