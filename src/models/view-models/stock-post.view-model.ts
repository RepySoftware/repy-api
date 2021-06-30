import { StockPostType } from "../../common/enums/stock-post-type";
import { DateHelper } from "../../common/helpers/date.helper";
import { StockPost } from "../entities/stock-post";
import { DepositProductViewModel } from "./deposit-product.view-model";
import { DepositViewModel } from "./deposit.view-model";

export class StockPostViewModel {

    public id: number;
    public deposit: DepositViewModel;
    public depositProduct: DepositProductViewModel;
    public type: StockPostType;
    public quantity: number;
    public observation?: string;
    public dateOfIssue: string;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(sp: StockPost): StockPostViewModel {
        const stockPost = new StockPostViewModel();

        stockPost.id = sp.id;
        stockPost.deposit = sp.deposit ? DepositViewModel.fromEntity(sp.deposit) : null;
        stockPost.depositProduct = sp.depositProduct ? DepositProductViewModel.fromEntity(sp.depositProduct) : null;
        stockPost.type = sp.getType();
        stockPost.quantity = sp.quantity;
        stockPost.observation = sp.observation;
        stockPost.dateOfIssue = DateHelper.toStringViewModel(sp.dateOfIssue);
        stockPost.createdAt = DateHelper.toStringViewModel(sp.createdAt);
        stockPost.updatedAt = DateHelper.toStringViewModel(sp.updatedAt);

        return stockPost;
    }
}