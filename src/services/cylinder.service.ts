import { inject, injectable } from "inversify";
import { Cylinder } from "../models/entities/cylinder";
import { UserService } from "./user.service";
import { CylinderViewModel } from '../models/view-models/cylinder.view-model';

@injectable()
export class CylinderService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAll(userId: number): Promise<CylinderViewModel[]> {

        await this._userService.getEntityById(userId);

        const cylinders: Cylinder[] = await Cylinder.findAll({
            order: [['name', 'ASC']]
        });

        return cylinders.map(CylinderViewModel.fromEntity);
    }
}