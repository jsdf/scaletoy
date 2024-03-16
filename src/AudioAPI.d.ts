declare global {
    class DX7 extends AudioWorkletNode {
        constructor(actx: AudioContext, options: Object);
        static importScripts(publicUrl: string, actx: AudioContext);
        onMidi(messageBytes: Uint8Array)
        setPatch(patch: Object);
    }
}
export interface Instrument {
    connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
    disconnect(destinationNode?: AudioNode): void;
    onMidi(messageBytes: Uint8Array)
    setPatch(patch: Object);
    [x: string]: any;

}
export type AudioAPI = {
    dx7: Instrument | null,
    actx: AudioContext,
    sampled?: boolean,
}