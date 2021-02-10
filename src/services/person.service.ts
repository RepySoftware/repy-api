import { injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Address } from "../models/entities/address";
import { Person } from "../models/entities/person";
import { PersonPhone } from "../models/entities/person-phone";
import { User } from "../models/entities/user";
import { PersonFilter } from "../models/input-models/filter/person.filter";
import { PersonViewModel } from "../models/view-models/person.view-model";

@injectable()
export class PersonService {

    private async getUserPerson(userId: number): Promise<User> {

        const user: User = await User.findOne({
            include: [
                {
                    model: Person,
                    as: 'person'
                }
            ],
            where: {
                id: userId
            }
        });

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        return user;
    }

    public async getAll(input: PersonFilter, userId: number): Promise<PersonViewModel[]> {

        const user = await this.getUserPerson(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        let where: WhereOptions = {
            companyId: user.person.companyId
        };

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

    public async getById(personId: number, userId: number): Promise<PersonViewModel> {

        const user = await this.getUserPerson(userId);

        const person: Person = await Person.findOne({
            where: {
                companyId: user.person.companyId,
                id: personId
            },
            include: [
                {
                    model: Address,
                    as: 'address'
                },
                {
                    model: PersonPhone,
                    as: 'personPhones'
                }
            ]
        });

        if (!person)
            throw new NotFoundException('Pessoa não encontrada');

        return PersonViewModel.fromEntity(person);
    }
}