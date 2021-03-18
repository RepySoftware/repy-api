import { ProductCategory } from "../entities/product-category";

export class ProductCategoryViewModel {

    public id: number;
    public name: string;

    public static fromEntity(pc: ProductCategory): ProductCategoryViewModel {
        const category = new ProductCategoryViewModel();

        category.id = pc.id;
        category.name = pc.name;

        return category;
    }
}