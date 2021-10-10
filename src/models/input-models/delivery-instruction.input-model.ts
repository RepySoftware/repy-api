import { AddressInputModel } from "./address.input-model";

export interface DeliveryInstructionInputModel {
    employeeDriverId: number;
    description: string;
    index?: number;
    address?: AddressInputModel;
    checkableByDriver: boolean;
    firstPosition: boolean;
}