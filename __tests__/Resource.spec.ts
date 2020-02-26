import {IResource, IResourceDefinitionContentTypeSpecific, Resource, SupportedContentType, SupportedMode} from '../src'

import ResourceNotFoundException from '../src/domain/exceptions/ResourceNotFoundException'
import IContext from '../src/flow-spec/IContext'

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

    resource = new Resource('some-uuid', values, {
      contact: {name: 'Expressions'},
      languageId: 'some-language-id',
      mode: SupportedMode.SMS
    } as IContext)
  })

  describe('getAudio', () => {
    it('should return value from first audio resource', async () => {
      expect(resource.getAudio()).toBe('viamo://your-audio-file.wav')
    })

    it('should raise ResourceNotFoundException when audio resource absent', async () => {
      resource.values = []

      expect(resource.getAudio.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })

  describe('getText', () => {
    it('should return value from first text resource', async () => {
      expect(resource.getText()).toBe('My first text!')
    })

    it('should raise ResourceNotFoundException when text resource absent', async () => {
      resource.values = []
      expect(resource.getText.bind(resource)).toThrow(ResourceNotFoundException)
    })

    it('should return text interpolated with values from context when an expression is provided', async () => {
      resource.values = [{...baseResource, contentType: SupportedContentType.TEXT, value: 'Hello @contact.name!'}]
      expect(resource.getText()).toBe('Hello Expressions!')
    })
  })

  describe('getImage', () => {
    it('should return value from first image resource', async () => {
      expect(resource.getImage()).toBe('viamo://your-image-file.jpg')
    })

    it('should raise ResourceNotFoundException when image resource absent', async () => {
      resource.values = []
      expect(resource.getImage.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })

  describe('getVideo', () => {
    it('should return value from first video resource', async () => {
      expect(resource.getVideo()).toBe('viamo://your-video-file.mp4')
    })

    it('should raise ResourceNotFoundException when video resource absent', async () => {
      resource.values = []
      expect(resource.getVideo.bind(resource)).toThrow(ResourceNotFoundException)
    })
  })
})