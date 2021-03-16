import { inject, injectable } from "inversify";
import { FindOptions, Op, Transaction, WhereOptions } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { PersonException } from "../common/exceptions/person.exception";
import { StringHelper } from "../common/helpers/string.helper";
import { Database } from "../data/database-config";
import { Address } from "../models/entities/address";
import { Person } from "../models/entities/person";
import { PersonPhone } from "../models/entities/person-phone";
import { User } from "../models/entities/user";
import { ViewPersonSearch } from "../models/entities/views/view-person-search";
import { PersonSearchInputModel } from "../models/input-models/filter/person-search-filter.input-model";
import { PersonFilter } from "../models/input-models/filter/person.filter";
import { PersonInputModel } from "../models/input-models/person.input-model";
import { PersonSearchViewModel } from "../models/view-models/person-search.view-model";
import { PersonViewModel } from "../models/view-models/person.view-model";

@injectable()
export class PersonService {

    constructor(
        @inject(Database) private _database: Database
    ) { }

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

    public async create(input: PersonInputModel, userId: number): Promise<PersonViewModel> {

        this.verifyInputPerson(input);

        const user = await this.getUserPerson(userId);

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            let address: Address = null;

            if (input.address) {

                address = new Address({
                    description: input.address.description,
                    zipCode: input.address.zipCode,
                    city: input.address.city,
                    region: input.address.region,
                    country: input.address.country,
                    complement: input.address.complement,
                    referencePoint: input.address.referencePoint,
                    latitude: input.address.latitude,
                    longitude: input.address.longitude
                });

                await address.save({ transaction });
            }

            const person = new Person({
                type: input.type,
                documentNumber: input.documentNumber,
                name: input.name,
                tradeName: input.tradeName,
                email: input.email,
                addressId: address ? address.id : null,
                companyId: user.person.companyId,
                isSupplier: input.isSupplier,
                isCustomer: input.isCustomer || false
            });

            await person.save({ transaction });

            for (let p of input.personPhones) {
                await new PersonPhone({
                    personId: person.id,
                    phone: StringHelper.getOnlyNumbers(p.phone)
                }).save({ transaction });
            }

            await transaction.commit();

            return await this.getById(person.id, userId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async update(input: PersonInputModel, userId: number): Promise<PersonViewModel> {

        this.verifyInputPerson(input);

        const user = await this.getUserPerson(userId);

        const person: Person = await Person.findOne({
            where: {
                companyId: user.person.companyId,
                id: input.id
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

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            if (!input.address) {
                await person.address.destroy({ transaction });
                person.addressId = null;
            } else {

                if (!person.addressId) {
                    const address = new Address({
                        description: input.address.description,
                        zipCode: input.address.zipCode,
                        city: input.address.city,
                        region: input.address.region,
                        country: input.address.country,
                        complement: input.address.complement,
                        referencePoint: input.address.referencePoint,
                        latitude: input.address.latitude,
                        longitude: input.address.longitude
                    });

                    await address.save({ transaction });

                    person.addressId = address.id;
                } else {
                    person.address.description = input.address.description;
                    person.address.zipCode = input.address.zipCode;
                    person.address.city = input.address.city;
                    person.address.region = input.address.region;
                    person.address.country = input.address.country;
                    person.address.complement = input.address.complement;
                    person.address.referencePoint = input.address.referencePoint;
                    person.address.latitude = input.address.latitude;
                    person.address.longitude = input.address.longitude;

                    await person.address.save({ transaction });
                }
            }

            person.type = input.type;
            person.documentNumber = input.documentNumber;
            person.name = input.name;
            person.tradeName = input.tradeName;
            person.email = input.email;
            person.companyId = user.person.companyId;
            person.isSupplier = input.isSupplier || false;
            person.isCustomer = input.isCustomer || false;

            await person.save({ transaction });

            const phonesToDelete = person.personPhones.filter(pp => !input.personPhones.find(x => x.id == pp.id));
            if (phonesToDelete.length > 0) {
                await PersonPhone.destroy({
                    where: {
                        id: { [Op.in]: phonesToDelete.map(pp => pp.id) }
                    },
                    transaction
                });
            }

            const phonesToAdd = input.personPhones.filter(pp => !pp.id);
            for (let p of phonesToAdd) {
                await new PersonPhone({
                    personId: person.id,
                    phone: StringHelper.getOnlyNumbers(p.phone)
                }).save({ transaction });
            }

            await transaction.commit();

            return await this.getById(person.id, userId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async search(input: PersonSearchInputModel, userId: number): Promise<PersonSearchViewModel[]> {

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        const user = await this.getUserPerson(userId);

        const options: FindOptions = {
            limit,
            offset,
            where: {
                [Op.and]: [
                    { companyId: user.person.companyId }
                ]
            }
        }

        if (input.q) {
            options.where[Op.and].push({
                generalSearch: { [Op.like]: `%${input.q}%` }
            });
        }

        if (input.name) {
            options.where[Op.and].push({
                nameSearch: { [Op.like]: `%${input.name}%` }
            });
        }

        if (input.phone) {
            options.where[Op.and].push({
                phonesSearch: { [Op.like]: `%${input.phone}%` }
            });
        }

        if (input.address) {
            options.where[Op.and].push({
                addressSearch: { [Op.like]: `%${input.address}%` }
            });
        }

        const viewPersonSearchModel = ViewPersonSearch.getDefinedModel(this._database.sequelize);
        const persons: ViewPersonSearch[] = await viewPersonSearchModel.findAll(options);

        return persons.map(PersonSearchViewModel.fromEntity);
    }

    private verifyInputPerson(input: PersonInputModel): void {
        if (input.isCustomer && !input.address)
            throw new PersonException('Endereço é obrigatório para cliente');
    }
}