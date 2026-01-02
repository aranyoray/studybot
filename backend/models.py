"""
Data models for Learning Companion API
Supports multiple learning disorders and adaptive engagement monitoring
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# Enums
class LearningStyle(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    READING = "reading"


class TimeOfDay(str, Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"
    FLEXIBLE = "flexible"


class EngagementLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    CRITICAL = "critical"


# Learning Profile Models
class DiagnosedConditions(BaseModel):
    dyslexia: bool = False
    dyscalculia: bool = False
    adhd: bool = False
    asd: bool = False
    dysgraphia: bool = False
    processingDisorder: bool = False
    anxietyDisorder: bool = False
    other: str = ""


class LearningProfile(BaseModel):
    """Comprehensive user learning profile from onboarding"""
    userId: str
    age: int = Field(ge=5, le=18)
    gradeLevel: str

    # Diagnosed conditions
    diagnosedConditions: DiagnosedConditions

    # Educational support
    hasIEP: bool = False
    has504Plan: bool = False
    receivesSpecialEducation: bool = False

    # Learning preferences
    preferredLearningStyle: List[LearningStyle]
    learningGoals: List[str]
    subjectsNeedHelp: List[str]

    # Session preferences
    preferredSessionLength: int = Field(default=20, ge=10, le=60)
    timeOfDay: TimeOfDay = TimeOfDay.FLEXIBLE

    # Baseline metrics
    selfReportedConfidence: int = Field(ge=1, le=10)
    motivationLevel: int = Field(ge=1, le=10)
    anxietyLevel: int = Field(ge=1, le=10)

    # Adaptive thresholds (set based on diagnosed conditions)
    engagementThresholds: Optional[Dict[str, float]] = None

    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)


# Eye Tracking Models
class EyeGazePoint(BaseModel):
    """Single eye gaze data point"""
    x: float  # Screen coordinates
    y: float
    timestamp: int  # milliseconds
    confidence: float = Field(ge=0.0, le=1.0)  # WebGazer confidence score


class Scanpath(BaseModel):
    """Visual scanpath representation for CNN analysis"""
    points: List[EyeGazePoint]
    velocityMap: List[float]  # Saccade velocities
    fixationDuration: List[int]  # Fixation durations in ms
    heatmapData: Optional[List[List[float]]] = None  # 2D heatmap matrix
    sessionId: str
    timestamp: int


class EyeTrackingMetrics(BaseModel):
    """Aggregated eye tracking metrics"""
    avgFixationDuration: float  # milliseconds
    saccadeCount: int
    avgSaccadeVelocity: float  # degrees/second
    pupilDilation: Optional[float] = None
    blinkRate: Optional[float] = None  # blinks per minute
    gazeDispersion: float  # measure of focus vs wandering
    attentionScore: float = Field(ge=0.0, le=100.0)


# Audio/Speech Models
class AudioFeatures(BaseModel):
    """Audio features for engagement analysis"""
    mfcc: List[List[float]]  # Mel-frequency cepstral coefficients
    pitch: List[float]
    energy: List[float]
    speechRate: float  # words per minute
    pauseDuration: List[int]  # milliseconds
    timestamp: int


class SpeechMetrics(BaseModel):
    """Aggregated speech/audio metrics"""
    averagePitch: float
    pitchVariance: float
    speechRateWPM: float
    pauseFrequency: float
    responseLatency: float  # milliseconds
    confidenceScore: float = Field(ge=0.0, le=100.0)
    engagementScore: float = Field(ge=0.0, le=100.0)


# Multimodal Engagement Models
class MicroexpressionData(BaseModel):
    """Facial microexpression detection"""
    emotions: Dict[str, float]  # emotion: probability
    valence: float = Field(ge=-1.0, le=1.0)  # negative to positive
    arousal: float = Field(ge=0.0, le=1.0)  # calm to excited
    frustration: float = Field(ge=0.0, le=1.0)
    confusion: float = Field(ge=0.0, le=1.0)
    engagement: float = Field(ge=0.0, le=1.0)
    timestamp: int


class GestureData(BaseModel):
    """Hand/body gesture tracking"""
    gestureType: str  # e.g., "pointing", "head_nod", "fidgeting"
    confidence: float = Field(ge=0.0, le=1.0)
    duration: int  # milliseconds
    timestamp: int


class EngagementSnapshot(BaseModel):
    """Complete multimodal engagement snapshot"""
    timestamp: int
    sessionId: str

    # Basic metrics
    isFocused: bool
    mouseX: float
    mouseY: float
    hasInteraction: bool

    # Advanced metrics
    eyeGaze: Optional[EyeGazePoint] = None
    audioFeatures: Optional[AudioFeatures] = None
    microexpression: Optional[MicroexpressionData] = None
    gesture: Optional[GestureData] = None

    # Computed scores
    attentionScore: float = Field(ge=0.0, le=100.0)
    engagementScore: float = Field(ge=0.0, le=100.0)
    frustrationLevel: float = Field(ge=0.0, le=100.0)

    # Response metrics
    responseLatency: Optional[float] = None  # milliseconds


class HybridEngagementAnalysis(BaseModel):
    """Results from hybrid CNN+LSTM model"""
    sessionId: str
    timestamp: int

    # Individual model scores
    cnnScore: float = Field(ge=0.0, le=100.0)  # Eye tracking (scanpath/velocity)
    lstmScore: float = Field(ge=0.0, le=100.0)  # Audio (MFCC)
    microexpressionScore: float = Field(ge=0.0, le=100.0)
    gestureScore: float = Field(ge=0.0, le=100.0)

    # Ensemble score
    hybridEngagementScore: float = Field(ge=0.0, le=100.0)

    # Disorder-specific likelihood scores (if applicable)
    asdLikelihood: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    adhdLikelihood: Optional[float] = Field(default=None, ge=0.0, le=100.0)

    # Engagement classification
    engagementLevel: EngagementLevel

    # Recommendations
    interventionNeeded: bool
    recommendedBreakTime: Optional[int] = None  # seconds
    adaptiveDifficultyAdjustment: Optional[float] = None  # -1 to 1


# Adaptive Thresholds Model
class AdaptiveThresholds(BaseModel):
    """
    Disorder-specific engagement thresholds based on UN/APA/AAP guidelines
    Different conditions require different sensitivity levels
    """
    condition: str  # e.g., "dyslexia", "adhd", "asd"

    # Attention thresholds
    minAttentionScore: float = Field(default=40.0, ge=0.0, le=100.0)
    criticalAttentionScore: float = Field(default=20.0, ge=0.0, le=100.0)

    # Engagement thresholds
    minEngagementScore: float = Field(default=50.0, ge=0.0, le=100.0)
    criticalEngagementScore: float = Field(default=30.0, ge=0.0, le=100.0)

    # Frustration thresholds
    maxFrustrationLevel: float = Field(default=60.0, ge=0.0, le=100.0)
    criticalFrustrationLevel: float = Field(default=80.0, ge=0.0, le=100.0)

    # Session duration limits (minutes)
    recommendedSessionLength: int = Field(default=20, ge=5, le=60)
    maxSessionLength: int = Field(default=30, ge=10, le=90)

    # Break frequency (minutes of continuous work before break)
    breakFrequency: int = Field(default=15, ge=5, le=30)
    breakDuration: int = Field(default=5, ge=2, le=10)

    # Response latency thresholds (seconds)
    normalResponseTime: float = Field(default=3.0)
    slowResponseTime: float = Field(default=10.0)

    # Adjustments based on research
    notes: Optional[str] = None


# Customized Learning Plan
class LearningActivity(BaseModel):
    """Individual learning activity in a plan"""
    activityId: str
    activityType: str  # "reading", "math", "game", "exercise", etc.
    subject: str
    title: str
    description: str
    estimatedDuration: int  # minutes
    difficulty: int = Field(ge=1, le=10)
    adaptations: List[str] = []  # Accessibility adaptations
    goals: List[str] = []


class LearningPlan(BaseModel):
    """Personalized learning plan based on profile"""
    planId: str
    userId: str

    # Plan metadata
    createdAt: datetime = Field(default_factory=datetime.now)
    startDate: datetime
    endDate: datetime

    # Customization based on profile
    activities: List[LearningActivity]
    accommodations: List[str]  # IEP/504 accommodations
    assistiveTechnologies: List[str]

    # Goals and progress
    weeklyGoals: List[str]
    progressMetrics: Dict[str, float] = {}

    # Adaptive parameters
    currentDifficulty: int = Field(ge=1, le=10)
    paceAdjustment: float = Field(default=1.0, ge=0.5, le=2.0)


# Session models
class SessionData(BaseModel):
    """Extended session data with multimodal tracking"""
    sessionId: str
    userId: str
    planId: Optional[str] = None

    startTime: int
    endTime: Optional[int] = None

    # Activity data
    activityId: Optional[str] = None
    activityType: str
    subject: str

    # Engagement snapshots
    engagementSnapshots: List[EngagementSnapshot] = []

    # Eye tracking data
    eyeGazeData: List[EyeGazePoint] = []
    scanpaths: List[Scanpath] = []

    # Audio data
    audioFeatures: List[AudioFeatures] = []

    # Multimodal analysis results
    hybridAnalysis: Optional[HybridEngagementAnalysis] = None

    # Performance data
    questionsAnswered: int = 0
    correctAnswers: int = 0
    averageResponseTime: float = 0.0

    # Intervention events
    breaksTriggered: int = 0
    difficultyAdjustments: List[float] = []


# Analytics and reporting
class ProgressReport(BaseModel):
    """Progress report for student/parent/teacher dashboard"""
    userId: str
    reportPeriod: str  # e.g., "week", "month"
    startDate: datetime
    endDate: datetime

    # Engagement metrics
    totalSessions: int
    totalLearningTime: int  # minutes
    averageEngagement: float
    averageAttention: float

    # Performance metrics
    subjectProgress: Dict[str, float]  # subject: progress percentage
    goalsAchieved: List[str]
    challengeAreas: List[str]

    # Behavioral insights
    bestTimeOfDay: TimeOfDay
    optimalSessionLength: int
    frustratingTopics: List[str]

    # Recommendations
    recommendations: List[str]
    accommodationsUsed: List[str]
    suggestedAccommodations: List[str]
