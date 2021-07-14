import { DateHelper } from "../../common/helpers/date.helper";
import { PersonCustomerNextGasSale } from "../entities/person-customer-next-gas-sale";

export class PersonCustomerNextGasSaleViewModel {

    public personCustomerId: number;
    public personCustomerName: string;
    public salesCount: number;
    public lastSale: string;
    public nextSaleMinDate: string;
    public nextSaleAverageDate: string;
    public nextSaleMaxDate: string;

    public static fromEntity(pcngs: PersonCustomerNextGasSale): PersonCustomerNextGasSaleViewModel {

        const nextSale = new PersonCustomerNextGasSaleViewModel();

        nextSale.personCustomerId = pcngs.personCustomerId;
        nextSale.personCustomerName = pcngs.personCustomerName;
        nextSale.salesCount = pcngs.salesCount;
        nextSale.lastSale = DateHelper.toStringViewModel(pcngs.lastSale);
        nextSale.nextSaleMinDate = DateHelper.toStringViewModel(pcngs.nextSaleMinDate);
        nextSale.nextSaleAverageDate = DateHelper.toStringViewModel(pcngs.nextSaleAverageDate);
        nextSale.nextSaleMaxDate = DateHelper.toStringViewModel(pcngs.nextSaleMaxDate);

        return nextSale;
    }
}