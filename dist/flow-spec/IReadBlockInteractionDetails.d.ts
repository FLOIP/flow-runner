import { IBlockInteractionDetails } from '..';
export interface IReadBlockInteractionDetails extends IBlockInteractionDetails {
    readError: IReadError;
}
export interface IReadError {
    message: string;
}
//# sourceMappingURL=IReadBlockInteractionDetails.d.ts.map