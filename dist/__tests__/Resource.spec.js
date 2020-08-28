"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
describe('Resource', () => {
    let baseResource;
    let values;
    let resource;
    beforeEach(() => {
        baseResource = {
            contentType: __1.SupportedContentType.AUDIO,
            modes: [__1.SupportedMode.SMS],
            languageId: 'some-language-id',
            value: 'hello world!',
        };
        values = [
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.TEXT, value: 'My first text!' }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.TEXT }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.AUDIO, value: 'viamo://your-audio-file.wav' }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.AUDIO }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.IMAGE, value: 'viamo://your-image-file.jpg' }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.IMAGE }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.VIDEO, value: 'viamo://your-video-file.mp4' }),
            Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.VIDEO }),
        ];
        resource = new __1.Resource('some-uuid', values, {
            contact: {
                id: '0',
                name: 'Expressions',
            },
            languageId: 'some-language-id',
            mode: __1.SupportedMode.SMS,
        });
    });
    describe('getAudio', () => {
        it('should return value from first audio resource', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(resource.getAudio()).toBe('viamo://your-audio-file.wav');
        }));
        it('should raise ResourceNotFoundException when audio resource absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            resource.values = [];
            expect(resource.getAudio.bind(resource)).toThrow(__1.ResourceNotFoundException);
        }));
    });
    describe('getText', () => {
        it('should return value from first text resource', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(resource.getText()).toBe('My first text!');
        }));
        it('should raise ResourceNotFoundException when text resource absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            resource.values = [];
            expect(resource.getText.bind(resource)).toThrow(__1.ResourceNotFoundException);
        }));
        it('should return text interpolated with values from context when an expression is provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            resource.values = [Object.assign(Object.assign({}, baseResource), { contentType: __1.SupportedContentType.TEXT, value: 'Hello @contact.name!' })];
            expect(resource.getText()).toBe('Hello Expressions!');
        }));
    });
    describe('getImage', () => {
        it('should return value from first image resource', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(resource.getImage()).toBe('viamo://your-image-file.jpg');
        }));
        it('should raise ResourceNotFoundException when image resource absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            resource.values = [];
            expect(resource.getImage.bind(resource)).toThrow(__1.ResourceNotFoundException);
        }));
    });
    describe('getVideo', () => {
        it('should return value from first video resource', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(resource.getVideo()).toBe('viamo://your-video-file.mp4');
        }));
        it('should raise ResourceNotFoundException when video resource absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            resource.values = [];
            expect(resource.getVideo.bind(resource)).toThrow(__1.ResourceNotFoundException);
        }));
    });
});
//# sourceMappingURL=Resource.spec.js.map