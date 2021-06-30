import { StockPostType } from "../../common/enums/stock-post-type";

export interface StockPostInputModel {
    depositId: number;
    companyBranchProductId: number;
    type: StockPostType;
    quantity?: number;
    observation?: string;
    dateOfIssue: string;

    saleOrderId?: number;
}