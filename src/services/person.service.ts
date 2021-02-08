import { injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { Address } from "../models/entities/address";
import { Person } from "../models/entities/person";
import { PersonFilter } from "../models/input-models/filter/person.filter";
import { PersonViewModel } from "../models/view-models/person.view-model";

@injectable()
export class PersonService {

    public async getAll(input: PersonFilter): Promise<PersonViewModel[]> {

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        let where: WhereOptions = {};

        if (input.q) {
            where['name'] = {
                [Op.like]: `%${input.q}%`
            }
        }

        const persons: Person[] = await Person.findAll({
            where,
            include: [
                {
                    model: Address,
                    as: 'address'
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return persons.map(PersonViewModel.fromEntity);
    }
}