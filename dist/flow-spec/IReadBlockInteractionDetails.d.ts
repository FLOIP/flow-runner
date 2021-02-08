import { IBlockInteractionDetails } from '..';
export interface IReadBlockInteractionDetails extends IBlockInteractionDetails {
    read_error: IReadError;
}
export interface IReadError {
    message: string;
}
//# sourceMappingURL=IReadBlockInteractionDetails.d.ts.map