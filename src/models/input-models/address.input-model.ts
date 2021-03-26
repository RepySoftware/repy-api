export interface AddressInputModel {
    description: string;
    street: string;
    number?: string;
    zipCode: string;
    neighborhood?: string;
    city: string;
    region: string;
    country: string;
    complement: string;
    referencePoint: string;
    latitude?: number;
    longitude?: number;
}