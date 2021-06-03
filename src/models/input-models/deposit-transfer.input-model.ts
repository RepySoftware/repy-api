export interface DepositTransferInputModel {

    originDepositId: number;
    destinationDepositId: number;
    companyBranchProductId: number;
    quantity: number;
    dateOfIssue: string;
    observation?: string;
}