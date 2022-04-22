import {IContainer, ILogBlock, IResources} from '../..'
import Ajv, {AnySchema, ErrorObject} from 'ajv'
import ajvFormat from 'ajv-formats'
import {IMessageBlock} from '../../model/block/IMessageBlock'
import {ISelectOneResponseBlock} from '../../model/block/ISelectOneResponseBlock'
import {ISelectManyResponseBlock} from '../../model/block/ISelectManyResponseBlock'
import {IOpenResponseBlock} from '../../model/block/IOpenResponseBlock'
import {INumericResponseBlock} from '../../model/block/INumericResponseBlock'
import {IBlock} from '../../flow-spec/IBlock'
import {difference} from 'lodash'

function getJsonSchemaFrom(version: string, schemaFileName: string): AnySchema | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`../../../dist/resources/validationSchema/${version}/${schemaFileName}.json`)
  } catch (_e) {
    return null
  }
}

/**
 * Validate a Flow Spec container and return a set of errors (if they exist).
 * This checks that the structure of the container is valid according to the flow spec.
 * It does not check that the configuration of blocks is complete and ready to run/publish the flow;
 * for this see getFlowCompletenessErrors()
 * @param container : The result of calling JSON.parse() on flow spec container json
 * @returns null if there are no errors, or a set of validation errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFlowStructureErrors(
  container: IContainer,
  shouldValidateBlocks = true
): ErrorObject<string, Record<string, any>, unknown>[] | null | undefined {
  const flowSpecJsonSchema = getJsonSchemaFrom(container.specification_version, 'flowSpecJsonSchema')
  if (flowSpecJsonSchema == null) {
    return [
      {
        keyword: 'version',
        dataPath: '/container/specification_version',
        schemaPath: '#/properties/specification_version',
        params: [],
        propertyName: 'specification_version',
        message: 'Unsupported specification version',
      },
    ]
  }

  const ajv = new Ajv()
  // we need this to use AJV format such as 'date-time' (https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7)
  ajvFormat(ajv)
  const validate = ajv.compile(flowSpecJsonSchema)
  if (!validate(container)) {
    return validate.errors
  }

  if (shouldValidateBlocks) {
    const blockSpecificErrors = checkIndividualBlocks(container)
    if (blockSpecificErrors && blockSpecificErrors.length > 0) {
      return blockSpecificErrors
    }
  }

  const missingResources = checkAllResourcesPresent(container)
  if (missingResources != null) {
    return [
      {
        keyword: 'missing',
        dataPath: '/flows/*/resources',
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
 * Detailed checking of individual blocks, based on their unique jsonSchema requirements
 */
function checkIndividualBlocks(container: IContainer): ErrorObject<string, Record<string, any>, unknown>[] | null | undefined {
  let errors: any[] = []
  container.flows.forEach((flow, flowIndex) => {
    flow.blocks.forEach((block, blockIndex) => {
      errors = errors.concat(checkIndividualBlock(block, container, blockIndex, flowIndex))
    })
  })
  return errors
}

function checkIndividualBlock(
  block: IBlock,
  container: IContainer,
  blockIndex: number,
  flowIndex: number
): ErrorObject<string, Record<string, any>, unknown>[] | null | undefined {
  const schemaFileName = blockTypeToInterfaceName(block.type)
  if (schemaFileName != null) {
    const ajv = new Ajv()
    ajvFormat(ajv)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const blockJsonSchema = getJsonSchemaFrom(container.specification_version, schemaFileName)
    if (blockJsonSchema == null) {
      return [
        {
          keyword: 'version',
          dataPath: '/container/specification_version',
          schemaPath: '#/properties/specification_version',
          params: [],
          propertyName: 'specification_version',
          message: 'Unsupported specification version',
        },
      ]
    }
    const validate = ajv.compile(blockJsonSchema)
    if (!validate(block)) {
      return validate.errors?.map(error => {
        error.dataPath = '/container/flows/' + flowIndex + '/blocks/' + blockIndex + error.dataPath
        return error
      })
    }
  }

  // Check that exits has at least one exit, and that the Default exit is listed last
  const exitError = checkExitsOnBlock(block)
  if (exitError != null) {
    return [
      {
        keyword: 'invalid',
        dataPath: '/container/flows/' + flowIndex + '/blocks/' + blockIndex + '/exits',
        schemaPath: '#/properties/exits',
        params: [],
        propertyName: 'exits',
        message: exitError,
      },
    ]
  }
  return []
}

function checkExitsOnBlock(block: IBlock): string | null {
  if (block.exits.length < 1) {
    return 'There must be at least one exit.'
  }
  if (block.exits[block.exits.length - 1].default != true) {
    return 'The last exit must be a default exit.'
  }
  if (
    block.exits.slice(0, -1).reduce(function (prev, current, _i) {
      return prev || current.default == true
    }, false)
  ) {
    return 'There must not be more than one default exit.'
  }

  return null
}

function blockTypeToInterfaceName(type: string): string | null {
  switch (type) {
    case 'Core.Log':
      return 'ILogBlock'
    case 'Core.Case':
      return 'ICaseBlock'
    case 'Core.RunBlock':
      return 'IRunFlowBlock'
    case 'Core.Output':
      return 'IOutputBlock'
    case 'Core.SetContactProperty':
      return 'ISetContactPropertyBlock'
    case 'Core.SetGroupMembership':
      return 'ISetGroupMembershipBlock'
    case 'ConsoleIO.Print':
      return 'IPrintBlock'
    case 'ConsoleIO.Read':
      return 'IReadBlock'
    case 'MobilePrimitives.Message':
      return 'IMessageBlock'
    case 'MobilePrimitives.SelectOneResponse':
      return 'ISelectOneResponseBlock'
    case 'MobilePrimitives.SelectManyResponses':
      return 'ISelectManyResponseBlock'
    case 'MobilePrimitives.NumericResponse':
      return 'INumericResponseBlock'
    case 'MobilePrimitives.OpenResponse':
      return 'IOpenResponseBlock'
    case 'SmartDevices.LocationResponse':
      return 'ILocationResponseBlock'
    case 'SmartDevices.PhotoResponse':
      return 'IPhotoResponseBlock'
    default:
      return null
  }
}

/**
 * Check that all resources asked for within blocks are available in the Resources array
 * @param container Flow package container
 * @returns null if all resources are available, otherwise an array of the missing resource UUIDs
 */
function checkAllResourcesPresent(container: IContainer): string[] | null {
  const resourcesRequested: string[] = []
  const allResources: IResources = []

  container.flows.forEach(flow => {
    allResources.push(...flow.resources)
    flow.blocks.forEach(block => {
      resourcesRequested.push(...collectResourceUuidsFromBlock(block))
    })
  })

  const allResourceStrings = allResources.map(r => r.uuid)
  const missingResources: string[] = difference(resourcesRequested, allResourceStrings)

  if (missingResources.length > 0) {
    return missingResources
  } else {
    return null
  }
}

function collectResourceUuidsFromBlock(block: IBlock): string[] {
  const uuids: string[] = []
  if (block.type == 'MobilePrimitives.Message') {
    const b = block as IMessageBlock
    uuids.push(b.config.prompt)
  }

  if (block.type == 'MobilePrimitives.SelectOneResponse') {
    const b = block as ISelectOneResponseBlock
    if (b.config.prompt != undefined) {
      uuids.push(b.config.prompt)
    }
    if (b.config.question_prompt != undefined) {
      uuids.push(b.config.question_prompt)
    }
  }

  if (block.type == 'MobilePrimitives.SelectManyResponse') {
    const b = block as ISelectManyResponseBlock
    if (b.config.prompt != undefined) {
      uuids.push(b.config.prompt)
    }
    if (b.config.question_prompt != undefined) {
      uuids.push(b.config.question_prompt)
    }
  }

  if (block.type == 'MobilePrimitives.OpenResponse') {
    const b = block as IOpenResponseBlock
    uuids.push(b.config.prompt)
  }

  if (block.type == 'MobilePrimitives.NumericResponse') {
    const b = block as INumericResponseBlock
    uuids.push(b.config.prompt)
  }

  if (block.type == 'Core.Log') {
    const b = block as ILogBlock
    uuids.push(b.config.message)
  }

  return uuids
}
