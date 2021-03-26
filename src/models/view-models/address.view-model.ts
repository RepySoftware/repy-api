import { Address } from "../entities/address";

export class AddressViewModel {

    public id: number;
    public description: string;
    public street: string;
    public number?: string;
    public zipCode: string;
    public neighborhood?: string;
    public city: string;
    public region: string;
    public country: string;
    public complement: string;
    public referencePoint: string;
    public latitude: number;
    public longitude: number;

    public static fromEntity(a: Address): AddressViewModel {

        const address = new AddressViewModel();

        address.id = a.id;
        address.description = a.description;
        address.street = a.street;
        address.number = a.number;
        address.zipCode = a.zipCode;
        address.neighborhood = a.neighborhood;
        address.city = a.city;
        address.region = a.region;
        address.country = a.country;
        address.complement = a.complement;
        address.referencePoint = a.referencePoint;
        address.latitude = a.latitude;
        address.longitude = a.longitude;

        return address;
    }
}