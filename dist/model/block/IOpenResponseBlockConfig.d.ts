export interface IOpenResponseBlockConfig {
    prompt: string;
    promptAudio: string;
    ivr?: {
        maxDurationSeconds: number;
    };
    text?: {
        maxResponseCharacters?: number;
    };
}
export default IOpenResponseBlockConfig;
//# sourceMappingURL=IOpenResponseBlockConfig.d.ts.map