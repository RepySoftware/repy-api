import { Cylinder } from "../entities/cylinder";

export class CylinderViewModel {

    public id: number;
    public name: string;
    public defaultCylinderWeight: number;
    public defaultContentWeight: number;

    public static fromEntity(c: Cylinder): CylinderViewModel {

        const cylinder = new CylinderViewModel();

        cylinder.id = c.id;
        cylinder.name = c.name;
        cylinder.defaultCylinderWeight = c.defaultCylinderWeight;
        cylinder.defaultContentWeight = c.defaultContentWeight;

        return cylinder;
    }
}