/**
 * Type definitions for Meyda
 */

declare module 'meyda' {
  interface MeydaAnalyzerOptions {
    audioContext: AudioContext
    source: MediaStreamAudioSourceNode
    bufferSize: number
    featureExtractors: string[]
    callback: (features: any) => void
  }

  interface MeydaAnalyzer {
    start(): void
    stop(): void
  }

  interface MeydaStatic {
    createMeydaAnalyzer(options: MeydaAnalyzerOptions): MeydaAnalyzer
    extract(features: string | string[], signal: Float32Array | number[]): any
  }

  const Meyda: MeydaStatic
  export default Meyda
}
