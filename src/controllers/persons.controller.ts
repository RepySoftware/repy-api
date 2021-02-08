import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { PersonService } from "../services/person.service";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";

const PersonsController = Router();

const personService = ServicesCollection.resolve(PersonService);

PersonsController.get('/', [checkToken, checkRole([AccessControlRole.ADMIN, AccessControlRole.SUPPLIER_EMPLOYEE])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const persons = await personService.getAll(req.query);
        res.json(persons);
    } catch (error) {
        next(error);
    }
});

export { PersonsController };