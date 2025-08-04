# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AZ-400 exam practice question collection and display tool. It crawls practice questions from legitimate sources on the internet, translates them to Chinese, and displays them in a user-friendly format for exam preparation.

## Development Commands

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run scrape` - Run web scraper to collect questions
- `npm install` - Install backend dependencies

### Frontend
- `cd client && npm start` - Start React development server
- `cd client && npm run build` - Build React app for production
- `cd client && npm install` - Install frontend dependencies

### Full Stack
- `npm run install:all` - Install both backend and frontend dependencies
- `npm run build` - Build the complete application

## Architecture

### Backend (Node.js + Express)
- **Server**: `src/server.js` - Main Express server with API routes
- **Scraper**: `src/scraper/main.js` - Web scraping functionality using Puppeteer
- **Translator**: `src/translator/translator.js` - Translation service (MyMemory/Google Translate)
- **Data**: `data/questions.json` - JSON file storing collected questions

### Frontend (React)
- **App**: `client/src/App.js` - Main React application
- **Components**: 
  - `client/src/components/QuestionList.js` - Grid view of questions with pagination
  - `client/src/components/QuestionDetail.js` - Detailed view of single question
- **Styling**: CSS modules for responsive design

### API Endpoints
- `GET /api/questions` - Get paginated question list
- `GET /api/questions/:id` - Get specific question details
- `GET /api/stats` - Get collection statistics
- `POST /api/scrape` - Trigger manual scraping

## Data Flow
1. Scraper collects questions from ExamTopics, MeasureUp, etc.
2. Questions are translated to Chinese using translation service
3. Data stored in JSON format with source URLs for verification
4. React frontend displays questions with Chinese/original language toggle
5. Users can practice questions and view answers with explanations

## Configuration
- Environment variables in `.env` file
- Translation API keys (optional)
- Scraper delays and user agents
- Database paths and ports

## Legal Compliance
- All questions retain original source URLs for verification
- Tool is for educational use only
- Respects robots.txt and rate limiting
- No commercial use of collected content