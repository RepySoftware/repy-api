export interface DeliveryInstructionInputModel {
    employeeDriverId: number;
    description: string;
    index?: number;
    checkableByDriver: boolean;
    firstPosition: boolean;
}