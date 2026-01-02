/**
 * Type definitions for webgazer.js
 */

declare module 'webgazer' {
  interface GazeData {
    x: number
    y: number
  }

  interface WebGazerInstance {
    setGazeListener(listener: (data: GazeData | null, timestamp: number) => void): WebGazerInstance
    showPredictionPoints(show: boolean): WebGazerInstance
    showFaceOverlay(show: boolean): WebGazerInstance
    showVideo(show: boolean): WebGazerInstance
    showFaceFeedbackBox(show: boolean): WebGazerInstance
    saveDataAcrossSessions(save: boolean): WebGazerInstance
    setRegression(regression: string): WebGazerInstance
    begin(): Promise<void>
    pause(): void
    resume(): void
    end(): void
  }

  const webgazer: WebGazerInstance
  export default webgazer
}
