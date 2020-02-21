import { IBlockInteractionDetails } from './IBlockInteraction';
export interface IReadBlockInteractionDetails extends IBlockInteractionDetails {
    readError: IReadError;
}
export interface IReadError {
    message: string;
}
export default IReadBlockInteractionDetails;
//# sourceMappingURL=IReadBlockInteractionDetails.d.ts.map