import {IContainer} from '../..'
import Ajv, {ErrorObject} from 'ajv'

/**
 * Validate a Flow Spec container and return a set of errors (if they exist).
 * This checks that the structure of the container is valid according to the flow spec.
 * It does not check that the configuration of blocks is complete and ready to run/publish the flow;
 * for this see getFlowCompletenessErrors()
 * @param container : The result of calling JSON.parse() on flow spec container json
 * @returns null if there are no errors, or a set of validation errors
 */
export function getFlowStructureErrors(container: IContainer): ErrorObject<string, Record<string, any>, unknown>[] | null | undefined {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const flowSpecJsonSchema = require('../../../dist/resources/flowSpecJsonSchema.json')
  const ajv = new Ajv()
  const validate = ajv.compile(flowSpecJsonSchema)
  if (!validate(container)) {
    return validate.errors
  }

  return null
}
