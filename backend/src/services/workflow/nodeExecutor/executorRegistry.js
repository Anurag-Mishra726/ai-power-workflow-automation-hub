import { AppError } from "../../../utils/AppErrors.js";
import { manualExecutor } from "./manualExecutor.js";
import { httpExecutor } from "./httpExecutor.js";
import { googleFormExecutor } from "./googleFormExecutor.js";

export const executorRegistry =  {
    manual: manualExecutor,
    http: httpExecutor,
    googleForm: googleFormExecutor,
}

export const getNodeExecutor = (type) => {
    const getExecutor = executorRegistry[type];
    if (!getExecutor) {
        throw new AppError(`No Executor found for this node type: ${type}`);
    }
    return getExecutor;
}