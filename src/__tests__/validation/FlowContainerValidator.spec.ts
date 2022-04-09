import {getFlowStructureErrors} from '../../domain/validation/FlowContainerValidator'

describe('Validation Usage Tests for rc2', () => {
  test('Valid Usage Example', async () => {
    const flowJson = `{
        "specification_version": "1.0.0-rc2",
        "uuid": "e0616de8-68c5-4918-b375-f5eb9fcc1695",
        "name": "Museum of Interop Reception",
        "description": "Welcome and main menu for the Museum of Interoperability",
        "flows": [
          {
            "uuid": "b15be41c-d29b-41fb-b981-26b2ebe8a6ff",
            "name": "Museum of Interop Reception",
            "label": "Welcome and main menu for the Museum of Interoperability",
            "last_modified": "2021-03-14 16:11:43.326Z",
            "interaction_timeout": 172800,
            "supported_modes": [
              "SMS",
              "IVR",
              "USSD"
            ],
            "languages": [
              {
                "id": "22",
                "label": "English",
                "iso_639_3": "eng"
              },
              {
                "id": "23",
                "label": "Swahili - Kenyan",
                "iso_639_3": "swa",
                "variant": "kenyan",
                "bcp_47": "sw-KE"
              }
            ],
            "vendor_metadata": {},
            "blocks": [
              {
                "uuid": "3d2d806a-19a9-4827-93c3-22d4357ff8b2",
                "ui_metadata": {
                  "canvas_coordinates": {
                    "x": 200,
                    "y": 158
                  }
                },
                "type": "MobilePrimitives.Message",
                "name": "welcome_message",
                "label": "Welcome Message",
                "semantic_label": "",
                "exits": [
                  {
                    "uuid": "d4cb73df-c993-4395-9f75-1884ab7a0176",
                    "name": "Default",
                    "default": true,
                    "config": {},
                    "destination_block": "2099719b-beb2-44cc-9093-e713e43ae5cc"
                  }
                ],
                "config": {
                  "prompt": "3559a6fc-5a80-4fd9-89b4-9972cf218519"
                }
              },
              {
                "uuid": "2099719b-beb2-44cc-9093-e713e43ae5cc",
                "ui_metadata": {
                  "canvas_coordinates": {
                    "x": 426,
                    "y": 159
                  }
                },
                "type": "MobilePrimitives.SelectOneResponse",
                "name": "main_menu",
                "label": "Main Menu",
                "semantic_label": "",
                "exits": [
                  {
                    "uuid": "79d68b66-a50e-4c06-85b6-f766c72110d9",
                    "name": "Default",
                    "default": true,
                    "config": {}
                  }
                ],
                "config": {
                  "prompt": "85d506ac-c07a-490d-8867-0c6504d37521",
                  "question_prompt": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
                  "choices_prompt": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
                  "choices": {
                    "1": "30491e23-5f16-4af4-a02f-2a86f28316d1"
                  }
                }
              }
            ],
            "first_block_id": "3d2d806a-19a9-4827-93c3-22d4357ff8b2"
          }
        ],
        "resources": [
          {
            "uuid": "3559a6fc-5a80-4fd9-89b4-9972cf218519",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "Welcome to the Museum of Interoperability!"
              }
            ]
          },
          {
            "uuid": "30491e23-5f16-4af4-a02f-2a86f28316d1",
            "values": [
              {
                "language_id": "22",
                "value": "",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ]
              }
            ]
          },
          {
            "uuid": "85d506ac-c07a-490d-8867-0c6504d37521",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "What would you like to learn about today?"
              }
            ]
          },
          {
            "uuid": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
            "values": []
          },
          {
            "uuid": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
            "values": []
          },
          {
            "uuid": "997f78cb-c79d-4017-98fb-1f0734e13020",
            "values": []
          },
          {
            "uuid": "1cdf8be2-18af-4967-b255-ea360a8fa4a7",
            "values": []
          }
        ]
      }`

    const container = JSON.parse(flowJson)
    const errors = getFlowStructureErrors(container)

    expect(errors).toEqual([
      {
        dataPath: '/resources/1/values/0/value',
        keyword: 'pattern',
        message: 'should match pattern "^[\\w \\\\\\/@:,.!?+*^<>=()"\'-]+$"',
        params: {pattern: '^[\\w \\\\\\/@:,.!?+*^<>=()"\'-]+$'},
        schemaPath: '#/properties/value/pattern',
      },
    ])
  }),
    test('Find Too Many Default Exits', async () => {
      const flowJson = `{
        "specification_version": "1.0.0-rc2",
        "uuid": "e0616de8-68c5-4918-b375-f5eb9fcc1695",
        "name": "Museum of Interop Reception",
        "description": "Welcome and main menu for the Museum of Interoperability",
        "flows": [
          {
            "uuid": "b15be41c-d29b-41fb-b981-26b2ebe8a6ff",
            "name": "Museum of Interop Reception",
            "label": "Welcome and main menu for the Museum of Interoperability",
            "last_modified": "2021-03-14 16:11:43.326Z",
            "interaction_timeout": 172800,
            "supported_modes": [
              "SMS",
              "IVR",
              "USSD"
            ],
            "languages": [
              {
                "id": "22",
                "label": "English",
                "iso_639_3": "eng"
              },
              {
                "id": "23",
                "label": "Swahili - Kenyan",
                "iso_639_3": "swa",
                "variant": "kenyan",
                "bcp_47": "sw-KE"
              }
            ],
            "vendor_metadata": {},
            "blocks": [
              {
                "uuid": "3d2d806a-19a9-4827-93c3-22d4357ff8b2",
                "ui_metadata": {
                  "canvas_coordinates": {
                    "x": 200,
                    "y": 158
                  }
                },
                "type": "MobilePrimitives.Message",
                "name": "welcome_message",
                "label": "Welcome Message",
                "semantic_label": "",
                "exits": [
                  {
                    "uuid": "d4cb73df-c993-4395-9f75-1884ab7a0176",
                    "name": "Default",
                    "default": true,
                    "config": {},
                    "destination_block": "2099719b-beb2-44cc-9093-e713e43ae5cc"
                  }
                ],
                "config": {
                  "prompt": "3559a6fc-5a80-4fd9-89b4-9972cf218519"
                }
              },
              {
                "uuid": "2099719b-beb2-44cc-9093-e713e43ae5cc",
                "ui_metadata": {
                  "canvas_coordinates": {
                    "x": 426,
                    "y": 159
                  }
                },
                "type": "MobilePrimitives.SelectOneResponse",
                "name": "main_menu",
                "label": "Main Menu",
                "semantic_label": "",
                "exits": [
                  {
                    "uuid": "79d68b66-a50e-4c06-85b6-f766c72110d9",
                    "name": "Default",
                    "default": true,
                    "config": {}
                  },
                  {
                    "uuid": "79d68b66-a50e-4c06-85b6-f766c72110d9",
                    "name": "Default",
                    "default": true,
                    "config": {}
                  }
                ],
                "config": {
                  "prompt": "85d506ac-c07a-490d-8867-0c6504d37521",
                  "question_prompt": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
                  "choices_prompt": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
                  "choices": {
                    "1": "30491e23-5f16-4af4-a02f-2a86f28316d1"
                  }
                }
              }
            ],
            "first_block_id": "3d2d806a-19a9-4827-93c3-22d4357ff8b2"
          }
        ],
        "resources": [
          {
            "uuid": "3559a6fc-5a80-4fd9-89b4-9972cf218519",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "Welcome to the Museum of Interoperability!"
              }
            ]
          },
          {
            "uuid": "30491e23-5f16-4af4-a02f-2a86f28316d1",
            "values": [
              {
                "language_id": "22",
                "value": "anything",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ]
              }
            ]
          },
          {
            "uuid": "85d506ac-c07a-490d-8867-0c6504d37521",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "What would you like to learn about today?"
              }
            ]
          },
          {
            "uuid": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "anything"
              }
            ]
          },
          {
            "uuid": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "anything"
              }
            ]
          },
          {
            "uuid": "997f78cb-c79d-4017-98fb-1f0734e13020",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "anything"
              }
            ]
          },
          {
            "uuid": "1cdf8be2-18af-4967-b255-ea360a8fa4a7",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "anything"
              }
            ]
          }
        ]
      }`

      const container = JSON.parse(flowJson)
      const errors = getFlowStructureErrors(container)

      expect(errors).toEqual([
        {
          dataPath: '/container/flows/0/blocks/1/exits',
          keyword: 'invalid',
          message: 'There must not be more than one default exit.',
          params: [],
          propertyName: 'exits',
          schemaPath: '#/properties/exits',
        },
      ])
    }),
    test('Missing resources', async () => {
      const nonExistentResourceUuid1 = '3559a6fc-5a80-4fd9-89b4-9972cf218520'
      const nonExistentResourceUuid2 = '3559a6fc-5a80-4fd9-89b4-9972cf218521'
      const flowJson = `{
      "specification_version": "1.0.0-rc2",
      "uuid": "e0616de8-68c5-4918-b375-f5eb9fcc1695",
      "name": "Museum of Interop Reception",
      "description": "Welcome and main menu for the Museum of Interoperability",
      "flows": [
        {
          "uuid": "b15be41c-d29b-41fb-b981-26b2ebe8a6ff",
          "name": "Museum of Interop Reception",
          "label": "Welcome and main menu for the Museum of Interoperability",
          "last_modified": "2021-03-14 16:11:43.326Z",
          "interaction_timeout": 172800,
          "supported_modes": [
            "SMS",
            "IVR",
            "USSD"
          ],
          "languages": [
            {
              "id": "22",
              "label": "English",
              "iso_639_3": "eng"
            },
            {
              "id": "23",
              "label": "Swahili - Kenyan",
              "iso_639_3": "swa",
              "variant": "kenyan",
              "bcp_47": "sw-KE"
            }
          ],
          "vendor_metadata": {},
          "blocks": [
            {
              "uuid": "3d2d806a-19a9-4827-93c3-22d4357ff8b2",
              "ui_metadata": {
                "canvas_coordinates": {
                  "x": 200,
                  "y": 158
                }
              },
              "type": "MobilePrimitives.Message",
              "name": "welcome_message",
              "label": "Welcome Message",
              "semantic_label": "",
              "exits": [
                {
                  "uuid": "d4cb73df-c993-4395-9f75-1884ab7a0176",
                  "name": "Default",
                  "default": true,
                  "config": {},
                  "destination_block": "2099719b-beb2-44cc-9093-e713e43ae5cc"
                }
              ],
              "config": {
                "prompt": "${nonExistentResourceUuid1}"
              }
            },
            {
              "uuid": "2099719b-beb2-44cc-9093-e713e43ae5cc",
              "ui_metadata": {
                "canvas_coordinates": {
                  "x": 426,
                  "y": 159
                }
              },
              "type": "MobilePrimitives.SelectOneResponse",
              "name": "main_menu",
              "label": "Main Menu",
              "semantic_label": "",
              "exits": [
                {
                  "uuid": "79d68b66-a50e-4c06-85b6-f766c72110d9",
                  "name": "Default",
                  "default": true,
                  "config": {}
                }
              ],
              "config": {
                "prompt": "${nonExistentResourceUuid2}",
                "question_prompt": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
                "choices_prompt": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
                "choices": {
                  "1": "30491e23-5f16-4af4-a02f-2a86f28316d1"
                }
              }
            }
          ],
          "first_block_id": "3d2d806a-19a9-4827-93c3-22d4357ff8b2"
        }
      ],
      "resources": [
        {
          "uuid": "3559a6fc-5a80-4fd9-89b4-9972cf218519",
          "values": [
            {
              "language_id": "22",
              "content_type": "TEXT",
              "modes": [
                "SMS"
              ],
              "value": "Welcome to the Museum of Interoperability!"
            }
          ]
        },
        {
          "uuid": "30491e23-5f16-4af4-a02f-2a86f28316d1",
          "values": [
            {
              "language_id": "22",
              "value": "anything",
              "content_type": "TEXT",
              "modes": [
                "SMS"
              ]
            }
          ]
        },
        {
          "uuid": "85d506ac-c07a-490d-8867-0c6504d37521",
          "values": [
            {
              "language_id": "22",
              "content_type": "TEXT",
              "modes": [
                "SMS"
              ],
              "value": "What would you like to learn about today?"
            }
          ]
        },
        {
          "uuid": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
          "values": []
        },
        {
          "uuid": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
          "values": []
        },
        {
          "uuid": "997f78cb-c79d-4017-98fb-1f0734e13020",
          "values": []
        },
        {
          "uuid": "1cdf8be2-18af-4967-b255-ea360a8fa4a7",
          "values": []
        }
      ]
    }`

      const container = JSON.parse(flowJson)
      const errors = getFlowStructureErrors(container)

      expect(errors).toEqual([
        {
          dataPath: '/container/resources',
          keyword: 'missing',
          message:
            'Resources specified in block configurations are missing from resources: 3559a6fc-5a80-4fd9-89b4-9972cf218520,3559a6fc-5a80-4fd9-89b4-9972cf218521',
          params: [],
          propertyName: 'resources',
          schemaPath: '#/properties/resources',
        },
      ])
    })
})

describe('Validation Usage Tests for rc3', () => {
  test('Valid Usage Example', async () => {
    const flowJson = `{
        "specification_version": "1.0.0-rc3",
        "uuid": "e0616de8-68c5-4918-b375-f5eb9fcc1695",
        "name": "Museum of Interop Reception",
        "description": "Welcome and main menu for the Museum of Interoperability",
        "flows": [
          {
            "uuid": "b15be41c-d29b-41fb-b981-26b2ebe8a6ff",
            "name": "Museum of Interop Reception",
            "label": "Welcome and main menu for the Museum of Interoperability",
            "last_modified": "2021-03-14 16:11:43.326Z",
            "interaction_timeout": 172800,
            "supported_modes": [
              "SMS",
              "IVR",
              "USSD"
            ],
            "languages": [
              {
                "id": "22",
                "label": "English",
                "iso_639_3": "eng"
              },
              {
                "id": "23",
                "label": "Swahili - Kenyan",
                "iso_639_3": "swa",
                "variant": "kenyan",
                "bcp_47": "sw-KE"
              }
            ],
            "vendor_metadata": {},
            "blocks": [
              {
                "uuid": "3d2d806a-19a9-4827-93c3-22d4357ff8b2",
                "ui_metadata": {
                  "canvas_coordinates": {
                    "x": 200,
                    "y": 158
                  }
                },
                "type": "MobilePrimitives.Message",
                "name": "welcome_message",
                "label": "Welcome Message",
                "semantic_label": "",
                "exits": [
                  {
                    "uuid": "d4cb73df-c993-4395-9f75-1884ab7a0176",
                    "name": "Default",
                    "default": true,
                    "vendor_metadata": {},
                    "destination_block": "2099719b-beb2-44cc-9093-e713e43ae5cc"
                  }
                ],
                "config": {
                  "prompt": "3559a6fc-5a80-4fd9-89b4-9972cf218519"
                }
              },
              {
                "uuid": "2099719b-beb2-44cc-9093-e713e43ae5cc",
                "ui_metadata": {
                  "canvas_coordinates": {
                    "x": 426,
                    "y": 159
                  }
                },
                "type": "MobilePrimitives.SelectOneResponse",
                "name": "main_menu",
                "label": "Main Menu",
                "semantic_label": "",
                "exits": [
                  {
                    "uuid": "79d68b66-a50e-4c06-85b6-f766c72110d9",
                    "name": "Default",
                    "default": true,
                    "vendor_metadata": {}
                  }
                ],
                "config": {
                  "prompt": "85d506ac-c07a-490d-8867-0c6504d37521",
                  "question_prompt": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
                  "choices_prompt": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
                  "choices": {
                    "1": "30491e23-5f16-4af4-a02f-2a86f28316d1"
                  }
                }
              }
            ],
            "first_block_id": "3d2d806a-19a9-4827-93c3-22d4357ff8b2"
          }
        ],
        "resources": [
          {
            "uuid": "3559a6fc-5a80-4fd9-89b4-9972cf218519",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "Welcome to the Museum of Interoperability!"
              }
            ]
          },
          {
            "uuid": "30491e23-5f16-4af4-a02f-2a86f28316d1",
            "values": [
              {
                "language_id": "22",
                "value": "",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ]
              }
            ]
          },
          {
            "uuid": "85d506ac-c07a-490d-8867-0c6504d37521",
            "values": [
              {
                "language_id": "22",
                "content_type": "TEXT",
                "modes": [
                  "SMS"
                ],
                "value": "What would you like to learn about today?"
              }
            ]
          },
          {
            "uuid": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
            "values": []
          },
          {
            "uuid": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
            "values": []
          },
          {
            "uuid": "997f78cb-c79d-4017-98fb-1f0734e13020",
            "values": []
          },
          {
            "uuid": "1cdf8be2-18af-4967-b255-ea360a8fa4a7",
            "values": []
          }
        ]
      }`

    const container = JSON.parse(flowJson)
    const errors = getFlowStructureErrors(container)

    expect(errors).toEqual([
      {
        dataPath: '/resources/1/values/0/value',
        keyword: 'pattern',
        message: 'should match pattern "^[\\w \\\\\\/@:,.!?+*^<>=()"\'-]+$"',
        params: {pattern: '^[\\w \\\\\\/@:,.!?+*^<>=()"\'-]+$'},
        schemaPath: '#/properties/value/pattern',
      },
    ])
  })
})

describe('Validation Usage Tests for rc4', () => {
  test('Valid Usage Example', async () => {
    const flowJson = `{
      "specification_version": "1.0.0-rc4",
      "uuid": "e0616de8-68c5-4918-b375-f5eb9fcc1695",
      "name": "Museum of Interop Reception",
      "description": "Welcome and main menu for the Museum of Interoperability",
      "flows": [
        {
          "uuid": "b15be41c-d29b-41fb-b981-26b2ebe8a6ff",
          "name": "Museum of Interop Reception",
          "label": "Welcome and main menu for the Museum of Interoperability",
          "last_modified": "2021-03-14 16:11:43.326Z",
          "interaction_timeout": 172800,
          "supported_modes": [
            "SMS",
            "IVR",
            "USSD"
          ],
          "languages": [
            {
              "id": "22",
              "label": "English",
              "iso_639_3": "eng"
            },
            {
              "id": "23",
              "label": "Swahili - Kenyan",
              "iso_639_3": "swa",
              "variant": "kenyan",
              "bcp_47": "sw-KE"
            }
          ],
          "vendor_metadata": {},
          "blocks": [
            {
              "uuid": "3d2d806a-19a9-4827-93c3-22d4357ff8b2",
              "ui_metadata": {
                "canvas_coordinates": {
                  "x": 200,
                  "y": 158
                }
              },
              "type": "MobilePrimitives.Message",
              "name": "welcome_message",
              "label": "Welcome Message",
              "semantic_label": "",
              "exits": [
                {
                  "uuid": "d4cb73df-c993-4395-9f75-1884ab7a0176",
                  "name": "Default",
                  "default": true,
                  "vendor_metadata": {},
                  "destination_block": "2099719b-beb2-44cc-9093-e713e43ae5cc"
                }
              ],
              "config": {
                "prompt": "3559a6fc-5a80-4fd9-89b4-9972cf218519"
              }
            },
            {
              "uuid": "2099719b-beb2-44cc-9093-e713e43ae5cc",
              "ui_metadata": {
                "canvas_coordinates": {
                  "x": 426,
                  "y": 159
                }
              },
              "type": "MobilePrimitives.SelectOneResponse",
              "name": "main_menu",
              "label": "Main Menu",
              "semantic_label": "",
              "exits": [
                {
                  "uuid": "79d68b66-a50e-4c06-85b6-f766c72110d9",
                  "name": "Default",
                  "default": true,
                  "vendor_metadata": {}
                }
              ],
              "config": {
                "prompt": "85d506ac-c07a-490d-8867-0c6504d37521",
                "question_prompt": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
                "choices_prompt": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
                "choices": {
                  "1": "30491e23-5f16-4af4-a02f-2a86f28316d1"
                }
              }
            }
          ],
          "first_block_id": "3d2d806a-19a9-4827-93c3-22d4357ff8b2",
          "resources": [
            {
              "uuid": "3559a6fc-5a80-4fd9-89b4-9972cf218519",
              "values": [
                {
                  "language_id": "22",
                  "content_type": "TEXT",
                  "modes": [
                    "SMS"
                  ],
                  "value": "Welcome to the Museum of Interoperability!"
                }
              ]
            },
            {
              "uuid": "30491e23-5f16-4af4-a02f-2a86f28316d1",
              "values": [
                {
                  "language_id": "22",
                  "value": "",
                  "content_type": "TEXT",
                  "modes": [
                    "SMS"
                  ]
                }
              ]
            },
            {
              "uuid": "85d506ac-c07a-490d-8867-0c6504d37521",
              "values": [
                {
                  "language_id": "22",
                  "content_type": "TEXT",
                  "modes": [
                    "SMS"
                  ],
                  "value": "What would you like to learn about today?"
                }
              ]
            },
            {
              "uuid": "4d6712c4-64d7-4dc2-91c6-f49f765be197",
              "values": []
            },
            {
              "uuid": "90ef94ee-0f69-4c7d-9874-e57ec51c300f",
              "values": []
            },
            {
              "uuid": "997f78cb-c79d-4017-98fb-1f0734e13020",
              "values": []
            },
            {
              "uuid": "1cdf8be2-18af-4967-b255-ea360a8fa4a7",
              "values": []
            }
          ]
        }
      ]
    }`

    const container = JSON.parse(flowJson)
    const errors = getFlowStructureErrors(container)

    expect(errors).toEqual([
      {
        dataPath: '/flows/0/resources/1/values/0/value',
        keyword: 'pattern',
        message: 'should match pattern "^[\\w \\\\\\/@:,.!?+*^<>=()"\'-]+$"',
        params: {pattern: '^[\\w \\\\\\/@:,.!?+*^<>=()"\'-]+$'},
        schemaPath: '#/properties/value/pattern',
      },
    ])
  })
})
