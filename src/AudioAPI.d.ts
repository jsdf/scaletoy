declare global {
    class DX7 extends AudioWorkletNode {
        constructor(actx: AudioContext, options: Object);
        static importScripts(publicUrl: string, actx: AudioContext);
        onMidi(messageBytes: Uint8Array)
    }
}
export type AudioAPI = {
    dx7: DX7 | null,
    actx: AudioContext
}