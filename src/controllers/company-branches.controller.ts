import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { ProductService } from "../services/product.service";
import { CompanyBranchService } from "../services/company-branch.service";

const CompanyBranchesController = Router();

const companyBranchesService = ServicesCollection.resolve(CompanyBranchService);

CompanyBranchesController.get('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyBranches = await companyBranchesService.getAll(TokenHelper.getPayload(res).userId);
        res.json(companyBranches);
    } catch (error) {
        next(error);
    }
});

export { CompanyBranchesController };