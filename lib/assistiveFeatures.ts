/**
 * Assistive Features Module
 * Provides disorder-specific accommodations and adaptive support
 * Based on research guidelines from UN, APA, AAP, and IDA
 */

export interface AssistiveConfig {
  // Visual accommodations
  fontSize: number // percentage of base
  lineSpacing: number // multiplier
  letterSpacing: number // multiplier
  fontFamily: string
  colorScheme: 'default' | 'high-contrast' | 'dyslexia-friendly' | 'reduced-glare'
  overlayColor: string | null // Colored overlay for dyslexia

  // Text-to-Speech
  ttsEnabled: boolean
  ttsSpeed: number // 0.5 to 2.0
  ttsVoice: string | null

  // Speech-to-Text
  sttEnabled: boolean

  // Content presentation
  chunking: boolean // Break content into smaller chunks
  chunkSize: number // words per chunk
  progressTracking: 'detailed' | 'simplified' | 'gamified'

  // Interaction modes
  extendedTime: boolean
  timeMultiplier: number // 1.0 = normal, 1.5 = 50% more time, etc.
  pauseAllowed: boolean
  hintingEnabled: boolean

  // Sensory accommodations
  reducedAnimations: boolean
  quietMode: boolean // Reduced sounds/alerts
  focusMode: boolean // Minimize distractions

  // Math-specific
  visualCalculator: boolean
  numberLine: boolean
  manipulatives: boolean // Virtual manipulatives

  // Organization
  visualSchedule: boolean
  checklistsEnabled: boolean
  reminderSystem: boolean

  // Break management
  structuredBreaks: boolean
  breakFrequency: number // minutes
  breakDuration: number // minutes
  movementBreaks: boolean
}

export const DEFAULT_ASSISTIVE_CONFIG: AssistiveConfig = {
  fontSize: 100,
  lineSpacing: 1.0,
  letterSpacing: 1.0,
  fontFamily: 'system-ui',
  colorScheme: 'default',
  overlayColor: null,
  ttsEnabled: false,
  ttsSpeed: 1.0,
  ttsVoice: null,
  sttEnabled: false,
  chunking: false,
  chunkSize: 50,
  progressTracking: 'detailed',
  extendedTime: false,
  timeMultiplier: 1.0,
  pauseAllowed: true,
  hintingEnabled: false,
  reducedAnimations: false,
  quietMode: false,
  focusMode: false,
  visualCalculator: false,
  numberLine: false,
  manipulatives: false,
  visualSchedule: false,
  checklistsEnabled: false,
  reminderSystem: false,
  structuredBreaks: false,
  breakFrequency: 25,
  breakDuration: 5,
  movementBreaks: false,
}

/**
 * Generate assistive configuration based on diagnosed conditions
 */
export function generateAssistiveConfig(conditions: {
  dyslexia: boolean
  dyscalculia: boolean
  adhd: boolean
  asd: boolean
  dysgraphia: boolean
  processingDisorder: boolean
  anxietyDisorder: boolean
}): AssistiveConfig {
  let config = { ...DEFAULT_ASSISTIVE_CONFIG }

  // DYSLEXIA accommodations
  if (conditions.dyslexia) {
    config = {
      ...config,
      // Visual accommodations (International Dyslexia Association guidelines)
      fontSize: 120,
      lineSpacing: 1.5,
      letterSpacing: 1.1,
      fontFamily: 'OpenDyslexic, Comic Sans MS, Arial',
      colorScheme: 'dyslexia-friendly',
      overlayColor: '#FFF8DC', // Beige overlay

      // Assistive technology
      ttsEnabled: true,
      ttsSpeed: 0.9, // Slightly slower
      sttEnabled: true,

      // Content presentation
      chunking: true,
      chunkSize: 30, // Smaller chunks

      // Timing
      extendedTime: true,
      timeMultiplier: 1.5, // 50% more time (ADA standard)
      pauseAllowed: true,
      hintingEnabled: true,

      // Sensory
      reducedAnimations: false,
    }
  }

  // DYSCALCULIA accommodations
  if (conditions.dyscalculia) {
    config = {
      ...config,
      // Math-specific tools
      visualCalculator: true,
      numberLine: true,
      manipulatives: true,

      // Visual support
      fontSize: Math.max(config.fontSize, 115),
      colorScheme: 'high-contrast',

      // Timing
      extendedTime: true,
      timeMultiplier: Math.max(config.timeMultiplier, 1.5),

      // Content
      chunking: true,
      chunkSize: Math.min(config.chunkSize, 25),

      // Support
      hintingEnabled: true,
      progressTracking: 'gamified',
    }
  }

  // ADHD accommodations
  if (conditions.adhd) {
    config = {
      ...config,
      // Focus support
      focusMode: true,
      reducedAnimations: true,
      quietMode: true,

      // Breaks (APA guidelines for ADHD)
      structuredBreaks: true,
      breakFrequency: 15, // More frequent breaks
      breakDuration: 5,
      movementBreaks: true, // Movement is important for ADHD

      // Organization
      visualSchedule: true,
      checklistsEnabled: true,
      reminderSystem: true,

      // Content
      chunking: true,
      chunkSize: Math.min(config.chunkSize, 20), // Very small chunks

      // Progress
      progressTracking: 'gamified', // Immediate feedback important

      // Timing
      pauseAllowed: true,
    }
  }

  // ASD accommodations
  if (conditions.asd) {
    config = {
      ...config,
      // Sensory accommodations (AAP guidelines)
      reducedAnimations: true,
      quietMode: true,

      // Predictability and structure
      visualSchedule: true,
      progressTracking: 'detailed', // Clear expectations

      // Breaks
      structuredBreaks: true,
      breakFrequency: Math.min(config.breakFrequency, 20),
      breakDuration: 7, // Longer breaks for self-regulation

      // Timing
      extendedTime: true,
      timeMultiplier: Math.max(config.timeMultiplier, 1.5),
      pauseAllowed: true,

      // Support
      hintingEnabled: true,

      // Content
      chunking: true,
      chunkSize: Math.min(config.chunkSize, 30),
    }
  }

  // DYSGRAPHIA accommodations
  if (conditions.dysgraphia) {
    config = {
      ...config,
      // Alternative input
      sttEnabled: true, // Speech-to-text is critical

      // Timing
      extendedTime: true,
      timeMultiplier: Math.max(config.timeMultiplier, 1.5),

      // Support
      hintingEnabled: true,
    }
  }

  // PROCESSING DISORDER accommodations
  if (conditions.processingDisorder) {
    config = {
      ...config,
      // Multi-modal support
      ttsEnabled: true,
      sttEnabled: true,

      // Visual clarity
      fontSize: Math.max(config.fontSize, 120),
      lineSpacing: Math.max(config.lineSpacing, 1.5),
      colorScheme: 'high-contrast',

      // Timing
      extendedTime: true,
      timeMultiplier: Math.max(config.timeMultiplier, 1.75),

      // Content
      chunking: true,
      chunkSize: Math.min(config.chunkSize, 25),

      // Support
      hintingEnabled: true,
    }
  }

  // ANXIETY DISORDER accommodations
  if (conditions.anxietyDisorder) {
    config = {
      ...config,
      // Reduce pressure
      pauseAllowed: true,
      progressTracking: 'simplified', // Less overwhelming

      // Sensory comfort
      quietMode: true,
      reducedAnimations: true,

      // Support
      hintingEnabled: true,
      structuredBreaks: true,

      // Timing
      extendedTime: true,
      timeMultiplier: Math.max(config.timeMultiplier, 1.25),
    }
  }

  return config
}

/**
 * Apply assistive configuration to the DOM
 */
export function applyAssistiveStyles(config: AssistiveConfig, targetElement?: HTMLElement): void {
  const root = targetElement || document.documentElement

  // Font settings
  root.style.setProperty('--font-size-multiplier', `${config.fontSize / 100}`)
  root.style.setProperty('--line-spacing', `${config.lineSpacing}`)
  root.style.setProperty('--letter-spacing', `${config.letterSpacing}em`)
  root.style.setProperty('--font-family', config.fontFamily)

  // Color scheme
  if (config.colorScheme === 'high-contrast') {
    root.classList.add('high-contrast-mode')
  } else if (config.colorScheme === 'dyslexia-friendly') {
    root.classList.add('dyslexia-friendly-mode')
  } else if (config.colorScheme === 'reduced-glare') {
    root.classList.add('reduced-glare-mode')
  }

  // Overlay color
  if (config.overlayColor) {
    root.style.setProperty('--overlay-color', config.overlayColor)
  }

  // Animations
  if (config.reducedAnimations) {
    root.classList.add('reduced-motion')
  }

  // Focus mode
  if (config.focusMode) {
    root.classList.add('focus-mode')
  }

  console.log('Assistive styles applied:', config)
}

/**
 * Text-to-Speech functionality
 */
export class TextToSpeech {
  private synthesis: SpeechSynthesis | null = null
  private utterance: SpeechSynthesisUtterance | null = null
  private config: AssistiveConfig

  constructor(config: AssistiveConfig) {
    this.config = config

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synthesis = window.speechSynthesis
    }
  }

  speak(text: string): void {
    if (!this.synthesis || !this.config.ttsEnabled) return

    // Cancel any ongoing speech
    this.stop()

    this.utterance = new SpeechSynthesisUtterance(text)
    this.utterance.rate = this.config.ttsSpeed

    if (this.config.ttsVoice) {
      const voices = this.synthesis.getVoices()
      const selectedVoice = voices.find(v => v.name === this.config.ttsVoice)
      if (selectedVoice) {
        this.utterance.voice = selectedVoice
      }
    }

    this.synthesis.speak(this.utterance)
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  pause(): void {
    if (this.synthesis) {
      this.synthesis.pause()
    }
  }

  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume()
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (this.synthesis) {
      return this.synthesis.getVoices()
    }
    return []
  }
}

/**
 * Speech-to-Text functionality
 */
export class SpeechToText {
  private recognition: any = null
  private config: AssistiveConfig
  private onResult: ((text: string) => void) | null = null

  constructor(config: AssistiveConfig) {
    this.config = config

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.lang = 'en-US'

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          if (this.onResult) {
            this.onResult(transcript)
          }
        }
      }
    }
  }

  start(onResult: (text: string) => void): void {
    if (!this.recognition || !this.config.sttEnabled) return

    this.onResult = onResult
    this.recognition.start()
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  isSupported(): boolean {
    return this.recognition !== null
  }
}

/**
 * Break timer for structured breaks
 */
export class BreakTimer {
  private config: AssistiveConfig
  private workStartTime: number = 0
  private breakCallbacks: ((breakType: 'work' | 'break') => void)[] = []
  private timerInterval: number | null = null

  constructor(config: AssistiveConfig) {
    this.config = config
  }

  start(onBreakNeeded: (breakType: 'work' | 'break') => void): void {
    if (!this.config.structuredBreaks) return

    this.breakCallbacks.push(onBreakNeeded)
    this.workStartTime = Date.now()

    // Check every minute
    this.timerInterval = window.setInterval(() => {
      const elapsedMinutes = (Date.now() - this.workStartTime) / 60000

      if (elapsedMinutes >= this.config.breakFrequency) {
        this.triggerBreak()
      }
    }, 60000)
  }

  private triggerBreak(): void {
    this.breakCallbacks.forEach(cb => cb('break'))

    // Automatically resume after break duration
    setTimeout(() => {
      this.resumeWork()
    }, this.config.breakDuration * 60000)
  }

  private resumeWork(): void {
    this.workStartTime = Date.now()
    this.breakCallbacks.forEach(cb => cb('work'))
  }

  stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }
}
