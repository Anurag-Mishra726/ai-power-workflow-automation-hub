import { NonRetriableError } from "inngest";
import { httpRequestChannel } from "../../../inngest/httpRequestChannel.js";
import Handlebars from 'handlebars';
import { createExecutionResult } from "../../../utils/executionResult.js";

export const googleFormExecutor = async ({data, nodeId, context, publish}) => {
    console.log("Google Form: ",nodeId);
}