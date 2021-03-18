import { MeasurementUnit } from "../../common/enums/measurement-unit";
import { DateHelper } from "../../common/helpers/date.helper";
import { Product } from "../entities/product";
import { ProductCategoryViewModel } from "./product-category.view-model";

export class ProductViewModel {

    public id: number;
    public categoryId: number;
    public category: ProductCategoryViewModel;
    public code: string;
    public name: string;
    public description: string;
    public measurementUnit: MeasurementUnit;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(p: Product): ProductViewModel {

        const product = new ProductViewModel();

        product.id = p.id;
        product.category = p.category ? ProductCategoryViewModel.fromEntity(p.category) : null;
        product.code = p.code;
        product.name = p.name;
        product.description = p.description;
        product.measurementUnit = p.measurementUnit;
        product.createdAt = DateHelper.toStringViewModel(p.createdAt);
        product.updatedAt = DateHelper.toStringViewModel(p.updatedAt);

        return product;
    }
}