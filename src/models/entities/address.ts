import { AllowNull, Column, Table } from "sequelize-typescript";
import { PersonException } from "../../common/exceptions/person.exception";
import { CustomException } from "../../common/exceptions/setup/custom.exception";
import { AddressHelper } from "../../common/helpers/address.helper";
import { GeocodingService } from "../../services/geocoding.service";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Addresses',
    timestamps: false
})
export class Address extends Entity<Address> {

    public static create(input: {
        description: string;
        street: string;
        number: string;
        zipCode: string;
        neighborhood: string;
        city: string;
        region: string;
        country: string;
        complement: string;
        referencePoint: string;
        latitude?: number;
        longitude?: number;
    }): Address {
        return new Address(input);
    }

    @AllowNull(false)
    @Column
    public description: string;

    @AllowNull(false)
    @Column
    public street: string;

    @Column
    public number?: string;

    @Column
    public zipCode?: string;

    @Column
    public neighborhood?: string;

    @AllowNull(false)
    @Column
    public city: string;

    @AllowNull(false)
    @Column
    public region: string;

    @AllowNull(false)
    @Column
    public country: string;

    @Column
    public complement: string;

    @Column
    public referencePoint: string;

    @Column
    public latitude?: number;

    @Column
    public longitude?: number;

    public async setCoordinatesFromGeocoding(geocodingService: GeocodingService): Promise<void> {

        const coordinates = await geocodingService.addressToCoordinates(
            AddressHelper.format(this, { includeComplement: false })
        );

        if (!coordinates)
            throw new CustomException(400, 'Erro ao buscar endereço. Por favor revise.');

        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;
    }
}