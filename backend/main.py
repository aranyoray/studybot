"""
FastAPI Backend for Learning Companion App
Handles multimodal engagement monitoring, adaptive learning, and assistive features
for students with diverse learning needs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime
from models import (
    LearningProfile,
    EngagementSnapshot,
    HybridEngagementAnalysis,
    AdaptiveThresholds,
    LearningPlan,
    SessionData,
    ProgressReport,
    EyeGazePoint,
    Scanpath,
    AudioFeatures,
    MicroexpressionData,
    GestureData,
    EngagementLevel,
)

app = FastAPI(title="Learning Companion API", version="2.0.0")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class MouseEvent(BaseModel):
    x: float
    y: float
    timestamp: int

class Answer(BaseModel):
    questionId: str
    answer: any
    correct: bool
    timeSpent: int

class AttentionCheck(BaseModel):
    passed: bool
    timestamp: int

class SessionData(BaseModel):
    sessionId: str
    startTime: int
    endTime: Optional[int] = None
    mouseEvents: List[MouseEvent] = []
    answers: List[Answer] = []
    attentionChecks: List[AttentionCheck] = []

class DiagnosticResult(BaseModel):
    workingMemory: float
    attention: float
    processingSpeed: float
    executiveFunction: float
    estimatedSkillLevel: float

class MathFeelingSurvey(BaseModel):
    score: int  # 1-10
    timestamp: int

class ProgressUpdate(BaseModel):
    userId: Optional[str] = None
    level: int
    xp: int
    coins: int
    badges: List[str]
    sessionsCompleted: int

# In-memory storage (replace with database in production)
sessions_db: Dict[str, Dict] = {}
progress_db: Dict[str, Dict] = {}
profiles_db: Dict[str, Dict] = {}
learning_plans_db: Dict[str, Dict] = {}
engagement_data_db: Dict[str, List[Dict]] = {}

# Default adaptive thresholds based on research guidelines (UN, APA, AAP)
DEFAULT_THRESHOLDS = {
    "typical": AdaptiveThresholds(
        condition="typical",
        minAttentionScore=50.0,
        criticalAttentionScore=30.0,
        minEngagementScore=55.0,
        criticalEngagementScore=35.0,
        maxFrustrationLevel=60.0,
        criticalFrustrationLevel=80.0,
        recommendedSessionLength=25,
        maxSessionLength=45,
        breakFrequency=20,
        breakDuration=5,
    ),
    "adhd": AdaptiveThresholds(
        condition="adhd",
        minAttentionScore=40.0,  # Lower threshold - expect more variability
        criticalAttentionScore=20.0,
        minEngagementScore=45.0,
        criticalEngagementScore=25.0,
        maxFrustrationLevel=50.0,  # More sensitive to frustration
        criticalFrustrationLevel=70.0,
        recommendedSessionLength=15,  # Shorter sessions
        maxSessionLength=25,
        breakFrequency=10,  # More frequent breaks
        breakDuration=5,
        notes="APA recommends shorter, more frequent sessions with movement breaks",
    ),
    "asd": AdaptiveThresholds(
        condition="asd",
        minAttentionScore=45.0,
        criticalAttentionScore=25.0,
        minEngagementScore=50.0,
        criticalEngagementScore=30.0,
        maxFrustrationLevel=50.0,
        criticalFrustrationLevel=75.0,
        recommendedSessionLength=20,
        maxSessionLength=30,
        breakFrequency=15,
        breakDuration=7,  # Longer breaks for regulation
        normalResponseTime=5.0,  # Allow more processing time
        slowResponseTime=15.0,
        notes="AAP/APA guidelines emphasize predictable structure and sensory breaks",
    ),
    "dyslexia": AdaptiveThresholds(
        condition="dyslexia",
        minAttentionScore=45.0,
        criticalAttentionScore=25.0,
        minEngagementScore=50.0,
        criticalEngagementScore=30.0,
        maxFrustrationLevel=65.0,
        criticalFrustrationLevel=85.0,
        recommendedSessionLength=25,
        maxSessionLength=40,
        breakFrequency=20,
        breakDuration=5,
        normalResponseTime=4.0,  # Extra processing time for reading
        slowResponseTime=12.0,
    ),
    "dyscalculia": AdaptiveThresholds(
        condition="dyscalculia",
        minAttentionScore=45.0,
        criticalAttentionScore=25.0,
        minEngagementScore=50.0,
        criticalEngagementScore=30.0,
        maxFrustrationLevel=65.0,
        criticalFrustrationLevel=85.0,
        recommendedSessionLength=20,
        maxSessionLength=35,
        breakFrequency=15,
        breakDuration=5,
        normalResponseTime=4.0,
        slowResponseTime=12.0,
    ),
    "anxiety": AdaptiveThresholds(
        condition="anxietyDisorder",
        minAttentionScore=40.0,
        criticalAttentionScore=20.0,
        minEngagementScore=45.0,
        criticalEngagementScore=25.0,
        maxFrustrationLevel=45.0,  # Very sensitive to stress
        criticalFrustrationLevel=65.0,
        recommendedSessionLength=20,
        maxSessionLength=30,
        breakFrequency=15,
        breakDuration=5,
        notes="Monitor for anxiety signals; provide frequent positive reinforcement",
    ),
}

@app.get("/")
async def root():
    return {
        "message": "Learning Companion API",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Multimodal engagement monitoring",
            "Eye tracking and scanpath analysis",
            "Audio/speech analysis with MFCC",
            "Microexpression detection",
            "Gesture recognition",
            "Hybrid CNN+LSTM engagement model",
            "Adaptive thresholds for learning disorders",
            "Personalized learning plans",
            "Assistive technology integration",
        ],
    }

@app.post("/api/sessions")
async def create_session(sessionData: SessionData):
    """Store session data"""
    sessions_db[sessionData.sessionId] = sessionData.dict()
    return {"status": "success", "sessionId": sessionData.sessionId}

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Retrieve session data"""
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions_db[session_id]

@app.post("/api/diagnostic")
async def submit_diagnostic(result: DiagnosticResult):
    """Process and store diagnostic results"""
    # In production, this would update user profile and initialize skill estimate
    return {
        "status": "success",
        "recommendedDifficulty": result.estimatedSkillLevel,
        "skillEstimate": result.dict()
    }

@app.post("/api/survey/math-feeling")
async def submit_math_feeling(survey: MathFeelingSurvey):
    """Store math anxiety/feeling survey response"""
    # In production, this would be stored in user profile
    return {"status": "success", "score": survey.score}

@app.post("/api/progress")
async def update_progress(progress: ProgressUpdate):
    """Update user progress"""
    user_id = progress.userId or "default"
    if user_id not in progress_db:
        progress_db[user_id] = progress.dict()
    else:
        progress_db[user_id].update(progress.dict())
    return {"status": "success", "progress": progress_db[user_id]}

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    """Get user progress"""
    if user_id not in progress_db:
        return {"level": 1, "xp": 0, "coins": 0, "badges": [], "sessionsCompleted": 0}
    return progress_db[user_id]

@app.get("/api/analytics/session/{session_id}")
async def get_session_analytics(session_id: str):
    """Get analytics for a session"""
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions_db[session_id]
    answers = session.get("answers", [])

    if not answers:
        return {
            "accuracy": 0,
            "totalQuestions": 0,
            "averageTime": 0,
            "attentionScore": 0
        }

    correct = sum(1 for a in answers if a.get("correct", False))
    total = len(answers)
    avg_time = sum(a.get("timeSpent", 0) for a in answers) / total if total > 0 else 0

    attention_checks = session.get("attentionChecks", [])
    attention_score = sum(1 for ac in attention_checks if ac.get("passed", False)) / len(attention_checks) * 100 if attention_checks else 0

    return {
        "accuracy": (correct / total * 100) if total > 0 else 0,
        "totalQuestions": total,
        "averageTime": avg_time,
        "attentionScore": attention_score,
        "mouseEventsCount": len(session.get("mouseEvents", []))
    }


# ==================== NEW LEARNING COMPANION ENDPOINTS ====================

@app.post("/api/profile")
async def create_profile(profile: LearningProfile):
    """Create or update learning profile"""
    # Determine adaptive thresholds based on diagnosed conditions
    thresholds = _get_adaptive_thresholds(profile.diagnosedConditions.dict())

    profile_dict = profile.dict()
    profile_dict["engagementThresholds"] = thresholds

    profiles_db[profile.userId] = profile_dict

    return {
        "status": "success",
        "userId": profile.userId,
        "thresholds": thresholds,
        "message": "Profile created successfully with adaptive thresholds"
    }


@app.get("/api/profile/{user_id}")
async def get_profile(user_id: str):
    """Get user learning profile"""
    if user_id not in profiles_db:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profiles_db[user_id]


@app.get("/api/thresholds/{user_id}")
async def get_thresholds(user_id: str):
    """Get adaptive thresholds for a user"""
    if user_id not in profiles_db:
        # Return default thresholds
        return DEFAULT_THRESHOLDS["typical"].dict()

    profile = profiles_db[user_id]
    return profile.get("engagementThresholds", DEFAULT_THRESHOLDS["typical"].dict())


@app.post("/api/engagement/snapshot")
async def record_engagement_snapshot(snapshot: EngagementSnapshot):
    """Record a single engagement snapshot"""
    session_id = snapshot.sessionId

    if session_id not in engagement_data_db:
        engagement_data_db[session_id] = []

    engagement_data_db[session_id].append(snapshot.dict())

    return {"status": "success", "snapshotCount": len(engagement_data_db[session_id])}


@app.post("/api/engagement/batch")
async def record_engagement_batch(snapshots: List[EngagementSnapshot]):
    """Record multiple engagement snapshots (batch upload)"""
    for snapshot in snapshots:
        session_id = snapshot.sessionId
        if session_id not in engagement_data_db:
            engagement_data_db[session_id] = []
        engagement_data_db[session_id].append(snapshot.dict())

    return {"status": "success", "snapshotsRecorded": len(snapshots)}


@app.get("/api/engagement/{session_id}")
async def get_engagement_data(session_id: str):
    """Get engagement data for a session"""
    if session_id not in engagement_data_db:
        return {"sessionId": session_id, "snapshots": []}

    return {
        "sessionId": session_id,
        "snapshots": engagement_data_db[session_id],
        "count": len(engagement_data_db[session_id])
    }


@app.post("/api/engagement/analyze")
async def analyze_engagement(analysis: HybridEngagementAnalysis):
    """Store hybrid model analysis results"""
    session_id = analysis.sessionId

    if session_id not in sessions_db:
        sessions_db[session_id] = {}

    sessions_db[session_id]["hybridAnalysis"] = analysis.dict()

    # Check if intervention is needed
    if analysis.interventionNeeded:
        return {
            "status": "intervention_needed",
            "analysis": analysis.dict(),
            "recommendation": "Consider taking a break or adjusting difficulty"
        }

    return {"status": "success", "analysis": analysis.dict()}


@app.post("/api/eye-tracking/scanpath")
async def record_scanpath(scanpath: Scanpath):
    """Record eye tracking scanpath data"""
    session_id = scanpath.sessionId

    if session_id not in sessions_db:
        sessions_db[session_id] = {"scanpaths": []}

    if "scanpaths" not in sessions_db[session_id]:
        sessions_db[session_id]["scanpaths"] = []

    sessions_db[session_id]["scanpaths"].append(scanpath.dict())

    return {"status": "success", "scanpathCount": len(sessions_db[session_id]["scanpaths"])}


@app.post("/api/audio/features")
async def record_audio_features(audio: AudioFeatures):
    """Record audio/speech features (MFCC)"""
    # Store with session ID if available
    session_id = f"audio_{audio.timestamp}"

    if session_id not in sessions_db:
        sessions_db[session_id] = {"audioFeatures": []}

    if "audioFeatures" not in sessions_db[session_id]:
        sessions_db[session_id]["audioFeatures"] = []

    sessions_db[session_id]["audioFeatures"].append(audio.dict())

    return {"status": "success"}


@app.post("/api/learning-plan")
async def create_learning_plan(plan: LearningPlan):
    """Create personalized learning plan"""
    plan_dict = plan.dict()
    learning_plans_db[plan.planId] = plan_dict

    # Also associate with user
    user_id = plan.userId
    if user_id not in profiles_db:
        raise HTTPException(status_code=404, detail="User profile not found")

    if "learningPlans" not in profiles_db[user_id]:
        profiles_db[user_id]["learningPlans"] = []

    profiles_db[user_id]["learningPlans"].append(plan.planId)

    return {
        "status": "success",
        "planId": plan.planId,
        "activitiesCount": len(plan.activities)
    }


@app.get("/api/learning-plan/{plan_id}")
async def get_learning_plan(plan_id: str):
    """Get learning plan by ID"""
    if plan_id not in learning_plans_db:
        raise HTTPException(status_code=404, detail="Learning plan not found")
    return learning_plans_db[plan_id]


@app.get("/api/learning-plan/user/{user_id}")
async def get_user_learning_plans(user_id: str):
    """Get all learning plans for a user"""
    if user_id not in profiles_db:
        raise HTTPException(status_code=404, detail="User profile not found")

    plan_ids = profiles_db[user_id].get("learningPlans", [])
    plans = [learning_plans_db[pid] for pid in plan_ids if pid in learning_plans_db]

    return {"userId": user_id, "plans": plans, "count": len(plans)}


@app.post("/api/microexpression")
async def record_microexpression(data: MicroexpressionData):
    """Record microexpression detection data"""
    # Store for analysis
    session_id = f"expr_{data.timestamp}"
    if session_id not in sessions_db:
        sessions_db[session_id] = {"microexpressions": []}

    if "microexpressions" not in sessions_db[session_id]:
        sessions_db[session_id]["microexpressions"] = []

    sessions_db[session_id]["microexpressions"].append(data.dict())

    return {"status": "success", "frustration": data.frustration, "engagement": data.engagement}


@app.post("/api/gesture")
async def record_gesture(data: GestureData):
    """Record gesture detection data"""
    session_id = f"gesture_{data.timestamp}"
    if session_id not in sessions_db:
        sessions_db[session_id] = {"gestures": []}

    if "gestures" not in sessions_db[session_id]:
        sessions_db[session_id]["gestures"] = []

    sessions_db[session_id]["gestures"].append(data.dict())

    return {"status": "success", "gestureType": data.gestureType}


# Helper functions
def _get_adaptive_thresholds(conditions: Dict[str, Any]) -> Dict[str, Any]:
    """
    Determine appropriate thresholds based on diagnosed conditions
    Uses research-based guidelines from UN, APA, AAP
    """
    # Priority order: most specific conditions first
    if conditions.get("asd"):
        return DEFAULT_THRESHOLDS["asd"].dict()
    elif conditions.get("adhd"):
        return DEFAULT_THRESHOLDS["adhd"].dict()
    elif conditions.get("anxietyDisorder"):
        return DEFAULT_THRESHOLDS["anxiety"].dict()
    elif conditions.get("dyslexia"):
        return DEFAULT_THRESHOLDS["dyslexia"].dict()
    elif conditions.get("dyscalculia"):
        return DEFAULT_THRESHOLDS["dyscalculia"].dict()
    else:
        return DEFAULT_THRESHOLDS["typical"].dict()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

