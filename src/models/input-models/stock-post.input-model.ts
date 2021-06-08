export interface StockPostInputModel {
    depositId: number;
    companyBranchProductId: number;
    quantity: number;
    observation?: string;
    dateOfIssue: string;

    saleOrderId?: number;
}