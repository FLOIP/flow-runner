import { IContainer } from '../..';
import { ErrorObject } from 'ajv';
/**
 * Validate a Flow Spec container and return a set of errors (if they exist).
 * This checks that the structure of the container is valid according to the flow spec.
 * It does not check that the configuration of blocks is complete and ready to run/publish the flow;
 * for this see getFlowCompletenessErrors()
 * @param container : The result of calling JSON.parse() on flow spec container json
 * @returns null if there are no errors, or a set of validation errors
 */
export declare function getFlowStructureErrors(container: IContainer, shouldValidateBlocks?: boolean): ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
//# sourceMappingURL=FlowContainerValidator.d.ts.map