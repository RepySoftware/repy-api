export interface SaleOrderProductUpdateInputModel {
    id?: number;
    companyBranchProductId: number;
    companyBranchProductPriceId: number;
    quantity: number;
    salePrice: number;
}