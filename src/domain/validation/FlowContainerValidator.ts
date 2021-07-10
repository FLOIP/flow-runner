import {IContainer} from '../..'
import Ajv, {ErrorObject} from 'ajv'
import ajvFormat from 'ajv-formats'

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
  }
  else if (container.specification_version == '1.0.0-rc2') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    flowSpecJsonSchema = require('../../../dist/resources/validationSchema/1.0.0-rc2/flowSpecJsonSchema.json')
  }
  else {
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

  return null
}
