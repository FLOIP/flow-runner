import {
  SupportedMode,
  IResourceDefinitionContentTypeSpecific,
  Resource,
  SupportedContentType, IResource,
} from '../src'

import ResourceNotFoundException from '../src/domain/exceptions/ResourceNotFoundException'

describe('Resource', () => {
  let baseResource: IResourceDefinitionContentTypeSpecific
  let values: IResourceDefinitionContentTypeSpecific[]
  let resource: IResource

  beforeEach(() => {
    baseResource = {
      contentType: SupportedContentType.AUDIO,
      modes: [SupportedMode.SMS],
      languageId: 'some-language-id',
      value: 'hello world!',
    }

    values = [
      {...baseResource, contentType: SupportedContentType.TEXT, value: 'My first text!'},
      {...baseResource, contentType: SupportedContentType.TEXT},
      {...baseResource, contentType: SupportedContentType.AUDIO, value: 'viamo://your-audio-file.wav'},
      {...baseResource, contentType: SupportedContentType.AUDIO},
      {...baseResource, contentType: SupportedContentType.IMAGE, value: 'viamo://your-image-file.jpg'},
      {...baseResource, contentType: SupportedContentType.IMAGE},
      {...baseResource, contentType: SupportedContentType.VIDEO, value: 'viamo://your-video-file.mp4'},
      {...baseResource, contentType: SupportedContentType.VIDEO},
    ]

    resource = new Resource('some-uuid', values, {languageId: 'some-language-id', modes: []})
  })

  describe('getAudio', () => {
    it('should return value from first audio resource', () => {
      expect(resource.getAudio()).toBe('viamo://your-audio-file.wav')
    })

    it('should raise ResourceNotFoundException when audio resource absent', () => {
      resource.values = []

      expect(resource.getAudio.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })

  describe('getText', () => {
    it('should return value from first text resource', () => {
      expect(resource.getText()).toBe('My first text!')
    })

    it('should raise ResourceNotFoundException when text resource absent', () => {
      resource.values = []
      expect(resource.getText.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })

  describe('getImage', () => {
    it('should return value from first image resource', () => {
      expect(resource.getImage()).toBe('viamo://your-image-file.jpg')
    })

    it('should raise ResourceNotFoundException when image resource absent', () => {
      resource.values = []
      expect(resource.getImage.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })

  describe('getVideo', () => {
    it('should return value from first video resource', () => {
      expect(resource.getVideo()).toBe('viamo://your-video-file.mp4')
    })

    it('should raise ResourceNotFoundException when video resource absent', () => {
      resource.values = []
      expect(resource.getVideo.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })
})