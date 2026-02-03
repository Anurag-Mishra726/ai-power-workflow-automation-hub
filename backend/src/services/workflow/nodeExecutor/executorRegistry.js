import { AppError } from "../../../utils/AppErrors.js";
import { manualExecutor } from "./manualExecutor.js";
import { httpExecutor } from "./httpExecutor.js";

export const executorRegistry =  {
    manual: manualExecutor,
    http: httpExecutor,
}

export const getNodeExecutor = (type) => {
    const getExecutor = executorRegistry[type];
    if (!getExecutor) {
        throw new AppError(`No Executor found for this node type: ${type}`);
    }
    return getExecutor;
}