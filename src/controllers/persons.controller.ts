import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { PersonService } from "../services/person.service";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";

const PersonsController = Router();

const personService = ServicesCollection.resolve(PersonService);

PersonsController.get('/', [checkToken, checkRole(AccessControlRole.MANAGER)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const persons = await personService.getAll(req.query, TokenHelper.getPayload(res).userId);
        res.json(persons);
    } catch (error) {
        next(error);
    }
});

PersonsController.get('/:personId', [checkToken, checkRole(AccessControlRole.MANAGER)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const person = await personService.getById(Number(req.params.personId), TokenHelper.getPayload(res).userId);
        res.json(person);
    } catch (error) {
        next(error);
    }
});

export { PersonsController };