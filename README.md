# AI-Powered Learning Companion for Diverse Learners

A comprehensive web-based learning companion supporting students ages 5-18 with personalized learning plans, advanced engagement monitoring, and assistive technology for diverse learning needs including dyslexia, dyscalculia, ADHD, ASD, and more.

## Features

### Multimodal Engagement Monitoring
- **Eye Tracking**: WebGazer.js integration for scanpath analysis, fixation detection, and velocity mapping
- **Audio Analysis**: MFCC extraction for speech pattern analysis and engagement detection
- **Microexpression Detection**: face-api.js for emotional state tracking (frustration, confusion, engagement)
- **Gesture Recognition**: MediaPipe Hands for detecting fidgeting, hand-raising, and other behavioral signals
- **Hybrid ML Model**: CNN for visual scanpath analysis + LSTM for audio time-series analysis with ensemble fusion

### Adaptive Thresholds for Learning Disorders
Based on research guidelines from UN, APA (American Psychological Association), and AAP (American Academy of Pediatrics):
- **ADHD**: Shorter sessions (15 min), frequent breaks (every 10 min), reduced distractions
- **ASD**: Predictable structure, longer breaks (7 min) for self-regulation, extended response time
- **Dyslexia**: Extended time (1.5x), text-to-speech, dyslexia-friendly fonts, colored overlays
- **Dyscalculia**: Visual calculator, number lines, manipulatives, step-by-step guidance
- **Anxiety Disorders**: Low-pressure environment, flexible pacing, simplified progress tracking

### Comprehensive Assistive Features
- **Text-to-Speech (TTS)**: Adjustable speed and voice selection
- **Speech-to-Text (STT)**: For students with dysgraphia or writing difficulties
- **Visual Accommodations**: Adjustable font size, spacing, high-contrast modes, colored overlays
- **Content Chunking**: Break complex content into manageable pieces
- **Structured Breaks**: Automatic break scheduling with movement break options
- **Multi-modal Learning**: Visual, auditory, and kinesthetic presentation options

### Personalized Learning Plans
- **Customized Activities**: Selected based on age, learning goals, and diagnosed conditions
- **Adaptive Difficulty**: Real-time adjustment based on performance and engagement
- **IEP/504 Integration**: Accommodations aligned with educational plans
- **Progress Tracking**: Detailed analytics for students, parents, and educators

### Onboarding & Profile System
Comprehensive survey collecting:
- Age and grade level
- Diagnosed conditions (dyslexia, dyscalculia, ADHD, ASD, dysgraphia, processing disorders, anxiety)
- IEP/504 status
- Learning preferences and styles
- Goals and subjects needing support
- Baseline confidence, motivation, and anxiety levels

## Tech Stack

### Frontend
- **Next.js 14**: React framework with app directory
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Zustand**: State management

### Engagement Monitoring
- **WebGazer.js**: Eye tracking and gaze analysis
- **Meyda**: Audio feature extraction (MFCC)
- **face-api.js**: Facial expression detection
- **MediaPipe Hands**: Gesture recognition
- **TensorFlow.js**: Client-side ML inference

### Backend
- **FastAPI**: Python REST API
- **TensorFlow/Keras**: Deep learning models (CNN + LSTM hybrid)
- **Librosa**: Audio processing and MFCC extraction
- **OpenCV**: Computer vision utilities
- **Pydantic**: Data validation

### Database
- **Supabase**: PostgreSQL database and authentication
- **Real-time subscriptions**: Live progress updates

## Getting Started

### Frontend Setup

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Student dashboard
│   └── onboarding/               # Onboarding flow
├── components/                   # React components
│   ├── OnboardingSurvey.tsx      # Comprehensive onboarding
│   ├── EngagementMonitor.tsx     # Real-time engagement display
│   └── LearningGame.tsx          # Interactive learning activities
├── lib/                          # Utilities and libraries
│   ├── eyeTracker.ts             # Eye tracking module
│   ├── audioAnalyzer.ts          # Audio/MFCC analysis
│   ├── emotionGestureDetector.ts # Microexpression & gesture detection
│   ├── advancedEngagementTracker.ts # Multimodal engagement tracker
│   ├── assistiveFeatures.ts      # Assistive technology module
│   └── learningPlanGenerator.ts  # Personalized plan creation
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # API endpoints
│   ├── models.py                 # Pydantic data models
│   ├── hybrid_model.py           # CNN + LSTM hybrid model
│   └── requirements.txt          # Python dependencies
└── public/                       # Static assets
    └── models/                   # Pre-trained ML models
```

## Key Components

### Onboarding Survey
Comprehensive assessment that collects demographics, diagnosed learning differences, IEP/504 accommodation status, learning preferences, goals, and baseline emotional state.

### Advanced Engagement Tracker
Multimodal system combining eye tracking (scanpath analysis, fixations), audio analysis (speech rate, MFCC), facial analysis (emotions, frustration), and gesture detection with adaptive thresholds.

### Hybrid ML Model
- **CNN Branch**: Processes eye tracking scanpaths/velocity maps
- **LSTM Branch**: Analyzes audio MFCC time series
- **Ensemble Layer**: Fuses features for engagement prediction
- **Outputs**: Engagement class, attention score, frustration level

### Assistive Features Engine
Automatically configures accommodations based on diagnosed conditions including font adjustments, TTS/STT, content chunking, break scheduling, and sensory accommodations.

### Learning Plan Generator
Creates personalized plans considering age-appropriate activities, subject areas, learning styles, diagnosed conditions, IEP/504 requirements, and baseline metrics.

## API Endpoints

### Learning Profiles
- `POST /api/profile` - Create/update learning profile
- `GET /api/profile/{user_id}` - Get user profile
- `GET /api/thresholds/{user_id}` - Get adaptive thresholds

### Engagement Monitoring
- `POST /api/engagement/snapshot` - Record engagement snapshot
- `POST /api/engagement/analyze` - Submit hybrid model analysis
- `POST /api/eye-tracking/scanpath` - Record eye tracking data
- `POST /api/audio/features` - Record audio features (MFCC)
- `POST /api/microexpression` - Record facial expression data
- `POST /api/gesture` - Record gesture data

### Learning Plans
- `POST /api/learning-plan` - Create personalized plan
- `GET /api/learning-plan/{plan_id}` - Get plan details
- `GET /api/learning-plan/user/{user_id}` - Get all plans for user

## Research-Based Guidelines

This app implements evidence-based practices from:
- **International Dyslexia Association (IDA)**: Multi-sensory literacy, dyslexia-friendly fonts, extended time
- **AAP (ASD Guidelines)**: Predictable structure, visual schedules, sensory accommodations
- **APA (ADHD Best Practices)**: Shorter work periods, frequent movement breaks, immediate feedback
- **Universal Design for Learning (UDL)**: Multiple means of representation, action, and engagement

## Privacy & Ethics

- **Data Privacy**: All engagement data is encrypted and stored securely
- **Parental Consent**: Required for users under 18
- **Transparency**: Clear explanation of data collection
- **Bias Mitigation**: Models trained on diverse populations
- **Accessibility**: WCAG 2.1 Level AA compliant

## Live Demo

Visit the app at: https://learningcompanion.app

---

**Note**: This application is designed to supplement, not replace, professional educational assessment and intervention. Always consult with qualified educators and healthcare professionals for learning disabilities.
