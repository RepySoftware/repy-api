import { Address } from "../../models/entities/address";
import { ViewPersonSearch } from "../../models/entities/views/view-person-search";

export abstract class AddressHelper {

    public static format(
        address: Address | ViewPersonSearch,
        options: { includeComplement?: boolean } = { includeComplement: true }
    ): string {

        let addressStr = '';

        if ((<Address>address).description) {

            const a: Address = <Address>address;

            addressStr += a.street;
            addressStr += a.number ? `, ${a.number}` : '';

            if (options.includeComplement)
                addressStr += a.complement ? ` (${a.complement}${a.referencePoint ? ' - ' + a.referencePoint : ''})` : '';

            addressStr += a.neighborhood ? ` - ${a.neighborhood}` : '';
            addressStr += ` - ${a.city}`;
            addressStr += ` - ${a.region}`;
        } else {
            const a: ViewPersonSearch = <ViewPersonSearch>address;

            addressStr += a.addressStreet;
            addressStr += a.addressNumber ? `, ${a.addressNumber}` : '';

            if (options.includeComplement)
                addressStr += a.addressComplement ? ` (${a.addressComplement}${a.addressReferencePoint ? ' - ' + a.addressReferencePoint : ''})` : '';

            addressStr += a.addressNeighborhood ? ` - ${a.addressNeighborhood}` : '';
            addressStr += ` - ${a.addressCity}`;
            addressStr += ` - ${a.addressRegion}`;
        }

        return addressStr;
    }
}