import { AppError } from "../../../utils/AppErrors.js";
import { manualExecutor } from "./manualExecutor.js";
import { httpExecutor } from "./httpExecutor.js";
import { geminiAIExecutor } from "./geminiAIExecutor.js";
import { perplexityAIExecutor } from "./perplexityAIExecutor.js";
import { openAIExecutor } from "./openAIExecutor.js";
import { slackExecutor } from "./slackExecutor.js";
import { googleFormExecutor } from "./googleFormExecutor.js";
import { gmailExecutor } from "./gmail/gmailExecutor.js";
import { googleDriveExecutor } from "./googleDrive/googleDriveExecutor.js";

export const executorRegistry =  {
    manual: manualExecutor,
    http: httpExecutor,
    googleForm: googleFormExecutor,
    geminiAI: geminiAIExecutor,
    perplexityAI: perplexityAIExecutor,
    openAI: openAIExecutor,
    slack: slackExecutor,
    gmail: gmailExecutor,
    googleDrive: googleDriveExecutor,
}

export const getNodeExecutor = (type) => {
    const getExecutor = executorRegistry[type];
    if (!getExecutor) {
        throw new AppError(`No Executor found for this node type: ${type}`);
    }
    return getExecutor;
}