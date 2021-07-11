import {IContainer} from '../..'
import Ajv, {ErrorObject} from 'ajv'
import ajvFormat from 'ajv-formats'
import { IMessageBlock } from '../../model/block/IMessageBlock'
import { ISelectOneResponseBlock } from '../../model/block/ISelectOneResponseBlock'
import { ISelectManyResponseBlock } from '../../model/block/ISelectManyResponseBlock'
import { IOpenResponseBlock } from '../../model/block/IOpenResponseBlock'
import { INumericResponseBlock } from '../../model/block/INumericResponseBlock'

/**
 * Validate a Flow Spec container and return a set of errors (if they exist).
 * This checks that the structure of the container is valid according to the flow spec.
 * It does not check that the configuration of blocks is complete and ready to run/publish the flow;
 * for this see getFlowCompletenessErrors()
 * @param container : The result of calling JSON.parse() on flow spec container json
 * @returns null if there are no errors, or a set of validation errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFlowStructureErrors(container: IContainer): ErrorObject<string, Record<string, any>, unknown>[] | null | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let flowSpecJsonSchema: any

  if (container.specification_version == '1.0.0-rc1') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    flowSpecJsonSchema = require('../../../dist/resources/validationSchema/1.0.0-rc1/flowSpecJsonSchema.json')
  } else if (container.specification_version == '1.0.0-rc2') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    flowSpecJsonSchema = require('../../../dist/resources/validationSchema/1.0.0-rc2/flowSpecJsonSchema.json')
  } else {
    return [
      {
        keyword: 'version',
        dataPath: '/containers/0/specification_version',
        schemaPath: '#/properties/specification_version/valid',
        params: [],
        propertyName: 'specification_version',
        message: 'Unsupported specification version',
      },
    ]
  }

  const ajv = new Ajv()
  ajvFormat(ajv) // we need this to use AJV format such as 'date-time' (https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7)
  const validate = ajv.compile(flowSpecJsonSchema)
  if (!validate(container)) {
    return validate.errors
  }

  const missingResources = checkAllResourcesPresent(container)
  if (missingResources != null) {
    return [
      {
        keyword: 'missing',
        dataPath: '/containers/0/resources',
        schemaPath: '#/properties/resources',
        params: [],
        propertyName: 'resources',
        message: 'Resources specified in block configurations are missing from resources: ' + missingResources.join(','),
      },
    ]
  }

  return null
}

/**
 * Check that all resources asked for within blocks are available in the Resources array of the container
 * @param container Flow package container
 * @returns null if all resources are available, otherwise an array of the missing resource UUIDs
 */
function checkAllResourcesPresent(container: IContainer): string[] | null {
  const resourcesRequested: string[] = []
  container.flows.forEach(flow => {
    flow.blocks.forEach(block => {
      if (block.type == 'MobilePrimitives.Message') {
        const b = block as IMessageBlock
        resourcesRequested.push(b.config.prompt)
      }

      if (block.type == 'MobilePrimitives.SelectOneResponse') {
        const b = block as ISelectOneResponseBlock
        if (b.config.prompt != undefined) {
          resourcesRequested.push(b.config.prompt)
        }
        if (b.config.question_prompt != undefined) {
          resourcesRequested.push(b.config.question_prompt)
        }
      }

      if (block.type == 'MobilePrimitives.SelectManyResponse') {
        const b = block as ISelectManyResponseBlock
        if (b.config.prompt != undefined) {
          resourcesRequested.push(b.config.prompt)
        }
        if (b.config.question_prompt != undefined) {
          resourcesRequested.push(b.config.question_prompt)
        }
      }

      if (block.type == 'MobilePrimitives.OpenResponse') {
        const b = block as IOpenResponseBlock
        resourcesRequested.push(b.config.prompt)
      }

      if (block.type == 'MobilePrimitives.NumericResponse') {
        const b = block as INumericResponseBlock
        resourcesRequested.push(b.config.prompt)
      }
    })
  })

  const missingResources: string[] = []
  const allResourceStrings = container.resources.map(r => r.uuid)

  resourcesRequested.forEach(resourcesString => {
    if (!allResourceStrings.includes(resourcesString)) {
      missingResources.push(resourcesString)
    }
  })

  if (missingResources.length > 0) {
    return missingResources
  } else {
    return null
  }
}
