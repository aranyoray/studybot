/**
 * Type definitions for MediaPipe
 */

declare module '@mediapipe/hands' {
  export interface HandsOptions {
    locateFile: (file: string) => string
  }

  export interface HandsConfig {
    maxNumHands?: number
    modelComplexity?: number
    minDetectionConfidence?: number
    minTrackingConfidence?: number
  }

  export interface NormalizedLandmark {
    x: number
    y: number
    z: number
  }

  export interface HandsResults {
    multiHandLandmarks?: NormalizedLandmark[][]
    multiHandedness?: any[]
  }

  export class Hands {
    constructor(options: HandsOptions)
    setOptions(config: HandsConfig): void
    onResults(callback: (results: HandsResults) => void): void
    send(inputs: { image: HTMLVideoElement | HTMLCanvasElement }): Promise<void>
    close(): void
  }
}

declare module '@mediapipe/camera_utils' {
  export interface CameraOptions {
    onFrame: () => Promise<void>
    width: number
    height: number
  }

  export class Camera {
    constructor(videoElement: HTMLVideoElement, options: CameraOptions)
    start(): Promise<void>
    stop(): void
  }
}

declare module '@mediapipe/drawing_utils' {
  export function drawConnectors(
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: any[],
    options?: any
  ): void

  export function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    options?: any
  ): void
}
