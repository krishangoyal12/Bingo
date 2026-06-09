import createRNNWasmModuleSync from '../rnnoise-sync.js';

class RNNoiseProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.initialized = false;
        this.wasm = null;
        this.rnnoiseState = null;
        
        // Circular buffers for input and output
        this.inputBuffer = new Float32Array(960);
        this.outputBuffer = new Float32Array(960);
        this.inputBufferLength = 0;
        this.outputBufferLength = 0;
        
        // Pointers for WASM memory
        this.wasmInputPtr = null;
        this.wasmOutputPtr = null;

        // Initialize WASM
        this.initWasm();
    }

    async initWasm() {
        try {
            this.wasm = await createRNNWasmModuleSync();
            this.rnnoiseState = this.wasm._rnnoise_create(0);
            
            // Allocate memory in WASM heap (480 samples * 4 bytes for float32)
            this.wasmInputPtr = this.wasm._malloc(480 * 4);
            this.wasmOutputPtr = this.wasm._malloc(480 * 4);
            this.initialized = true;
            this.port.postMessage({ status: 'ready' });
        } catch (err) {
            console.error('AudioWorklet: Failed to initialize RNNoise WASM:', err);
        }
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        // If no input/output channels, or not initialized, do a pass-through
        if (!input || input.length === 0 || !output || output.length === 0 || !this.initialized) {
            if (input && input[0] && output && output[0]) {
                output[0].set(input[0]);
            }
            return true;
        }

        const inputChannel = input[0];
        const outputChannel = output[0];
        const numSamples = inputChannel.length; // Typically 128

        // 1. Push input samples into inputBuffer
        if (this.inputBufferLength + numSamples <= this.inputBuffer.length) {
            this.inputBuffer.set(inputChannel, this.inputBufferLength);
            this.inputBufferLength += numSamples;
        }

        // 2. Process all complete 480-sample frames in inputBuffer
        while (this.inputBufferLength >= 480) {
            const frame = this.inputBuffer.subarray(0, 480);
            
            // Scale Float32 [-1, 1] to signed 16-bit float PCM [-32768, 32768]
            const scaledFrame = new Float32Array(480);
            for (let i = 0; i < 480; i++) {
                scaledFrame[i] = frame[i] * 32768.0;
            }

            // Copy to WASM heap
            this.wasm.HEAPF32.set(scaledFrame, this.wasmInputPtr / 4);

            // Process the frame
            this.wasm._rnnoise_process_frame(this.rnnoiseState, this.wasmOutputPtr, this.wasmInputPtr);

            // Read the clean frame from WASM heap
            const cleanScaledFrame = this.wasm.HEAPF32.subarray(this.wasmOutputPtr / 4, this.wasmOutputPtr / 4 + 480);

            // Scale back by dividing by 32768.0 and write to outputBuffer
            const cleanFrame = new Float32Array(480);
            for (let i = 0; i < 480; i++) {
                cleanFrame[i] = cleanScaledFrame[i] / 32768.0;
            }

            // Append to output buffer
            if (this.outputBufferLength + 480 <= this.outputBuffer.length) {
                this.outputBuffer.set(cleanFrame, this.outputBufferLength);
                this.outputBufferLength += 480;
            }

            // Shift input buffer
            this.inputBuffer.copyWithin(0, 480, this.inputBufferLength);
            this.inputBufferLength -= 480;
        }

        // 3. Write processed output from outputBuffer to the output channel
        if (this.outputBufferLength >= numSamples) {
            outputChannel.set(this.outputBuffer.subarray(0, numSamples));
            
            // Shift output buffer
            this.outputBuffer.copyWithin(0, numSamples, this.outputBufferLength);
            this.outputBufferLength -= numSamples;
        } else {
            // Fallback pass-through if we don't have enough processed samples yet
            outputChannel.set(inputChannel);
        }

        return true;
    }
}

registerProcessor('rnnoise-processor', RNNoiseProcessor);
