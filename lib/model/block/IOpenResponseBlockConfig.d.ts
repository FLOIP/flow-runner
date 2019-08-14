export default interface IOpenResponseBlockConfig {
    prompt: string;
    'prompt-audio': string;
    ivr: {
        'max-duration-seconds': number;
    };
    text: {
        'max-response-characters'?: number;
    };
}
//# sourceMappingURL=IOpenResponseBlockConfig.d.ts.map