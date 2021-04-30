import {
  IContact,
  IContext,
  IResourceWithContext,
  IResourceValue,
  Resource,
  ResourceNotFoundException,
  SupportedContentType,
  SupportedMode,
} from '..'

describe('Resource', () => {
  let baseResource: IResourceValue
  let values: IResourceValue[]
  let resource: IResourceWithContext

  beforeEach(() => {
    baseResource = {
      content_type: SupportedContentType.AUDIO,
      modes: [SupportedMode.SMS],
      language_id: 'some-language-id',
      value: 'hello world!',
    }

    values = [
      {...baseResource, content_type: SupportedContentType.TEXT, value: 'My first text!'},
      {...baseResource, content_type: SupportedContentType.TEXT},
      {...baseResource, content_type: SupportedContentType.AUDIO, value: 'viamo://your-audio-file.wav'},
      {...baseResource, content_type: SupportedContentType.AUDIO},
      {...baseResource, content_type: SupportedContentType.IMAGE, value: 'viamo://your-image-file.jpg'},
      {...baseResource, content_type: SupportedContentType.IMAGE},
      {...baseResource, content_type: SupportedContentType.VIDEO, value: 'viamo://your-video-file.mp4'},
      {...baseResource, content_type: SupportedContentType.VIDEO},
    ]

    resource = new Resource('some-uuid', values, ({
      contact: ({
        id: '0',
        name: 'Expressions',
      } as unknown) as IContact,
      languageId: 'some-language-id',
      mode: SupportedMode.SMS,
    } as unknown) as IContext)
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
      resource.values = [{...baseResource, content_type: SupportedContentType.TEXT, value: 'Hello @contact.name!'}]
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
