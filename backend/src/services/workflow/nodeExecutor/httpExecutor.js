import { NonRetriableError } from "inngest";
import axios from "axios";
import Handlebars from 'handlebars';
import { createExecutionResult } from "../../../utils/executionResult.js";

export const httpExecutor = async ({data, nodeId, context}) => {

    if (!data.isConfigured || !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(data?.config?.method) || !data.config.variable ) {
        throw new NonRetriableError("Node is not configured.")
    }

    const method = data.config.method;
    
    if (["POST", "PUT", "PATCH"].includes(method) && !data.config.body && !data.config.headers) {
        throw new NonRetriableError("Node is not configured.");
    }
    
    const endpoint = Handlebars.compile(data.config.url)(context);    

    const startTime = Date.now();

    let result;
    let error = null;
    let executionStatus = true;
    
    try {
        const config = {
            method: method,
            url: endpoint,
        };

        if (["POST", "PUT", "PATCH"].includes(method) ) {
            const body = JSON.parse(Handlebars.compile(JSON.stringify(data.config.body))(context));

            config.data = body;
            config.headers = data.config.headers;

        }else if (method == "DELETE"){
            config.headers = data.config.headers;
        }

        result = await axios(config);
        //console.log(result);
    } catch (err) {
        console.log(err);
        executionStatus = false;
        error = {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            stack: err.stack
        };
        result = { data: null }; 
    }

    return createExecutionResult({
        output:{
            nodeId,
            triggered: true,
            startTime: startTime,
            endTime: Date.now(), 
            data: result.data,
            statusCode: result.status || error?.status,
            status: executionStatus, 
            //headers: result.headers 
        },
        error: error
    });
}
