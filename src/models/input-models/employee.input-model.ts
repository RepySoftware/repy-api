export interface EmployeeInputModel {
    
    id?: number;
    name: string;
    documentNumber?: string;
    email?: string;
    color?: string;
    vehicleId?: number;
    isManager: boolean;
    isAgent: boolean;
    isDriver: boolean;
    isActive: boolean;
}