export interface CompanyBranchProductPriceInputModel {
    id?: number;
    productId: number;
    name: string;
    salePrice: number;
    isDefault: boolean;
    isActive: boolean;
}