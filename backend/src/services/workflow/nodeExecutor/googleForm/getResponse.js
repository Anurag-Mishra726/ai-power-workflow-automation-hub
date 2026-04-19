import axios from "axios";
import { Integration } from "../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../utils/executionResult.js";
import { executeGoogleRequestWithAutoRefresh } from "../../../integration/google/google.auth.service.js";
import { NonRetriableError } from "inngest";

const getGoogleAccessToken = async (userId, accountId) => {
  return await Integration.getIntegrationAccountToken({
    userId,
    provider: "google",
    externalId: accountId,
  });
};

export const handleGoogleForm = async ({
  data,
  nodeId,
  context,
  userId,
}) => {
  try {
    const { formId, googleFormAccountId } = data.config;

    if (!formId?.trim() || !googleFormAccountId?.trim()) {
      throw new NonRetriableError("Missing formId or googleFormAccountId.");
    }

    const accessToken = await getGoogleAccessToken(
      userId,
      googleFormAccountId
    );

    if (!accessToken) {
      throw new NonRetriableError("Google access token not found.");
    }

    const rawResponses = Array.isArray(context.triggerData) ? context.triggerData : [context.triggerData];

    if (!rawResponses) {
      return createExecutionResult({
        output: {
          nodeId,
          success: true,
          data: [],
        },
      });
    }

    const formSchemaRes = await executeGoogleRequestWithAutoRefresh({
      userId,
      externalId: googleFormAccountId,
      requestFn: async (overrideToken) => {
        const token = overrideToken || accessToken;
        return await axios.get(
          `https://forms.googleapis.com/v1/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      },
    });

    const formItems = formSchemaRes.data.items || [];

    const questionMap = {};

    formItems.forEach((item) => {
      if (item.questionItem) {
        const qId = item.questionItem.question.questionId;

        const questionText =
          item.title ||
          item.description ||
          `Question_${qId}`;

        questionMap[qId] = questionText;
      }
    });

    const mappedResponses = rawResponses.map((response) => {
      const answers = {};

      if (response.answers) {
        Object.entries(response.answers).forEach(([qId, answerObj]) => {
          const question =
            questionMap[qId] || `Question_${qId}`;

          let value = "";

          if (answerObj?.textAnswers?.answers?.length) {
            value = answerObj.textAnswers.answers
              .map((a) => a.value)
              .join(", ");
          } else if (answerObj?.integerAnswers?.answers?.length) {
            value = answerObj.integerAnswers.answers
              .map((a) => a.value)
              .join(", ");
          } else if (answerObj?.booleanAnswers?.answers?.length) {
            value = String(
              answerObj.booleanAnswers.answers[0].value
            );
          } else {
            value = "";
          }

          answers[question] = value;
        });
      }

      return {
        responseId: response.responseId,
        submittedAt: response.createTime,
        response: answers,
        raw: response.answers,
      };
    });

    console.log("Mapped Responses:", mappedResponses);

    return createExecutionResult({
      output: {
        nodeId,
        success: true,
        data: {
          responseId: mappedResponses[0]?.responseId || null,
          submittedAt: mappedResponses[0]?.submittedAt || null,
          response: mappedResponses[0]?.response || {}, 
          //allResponses: mappedResponses, 
        },
      },
    });

  } catch (error) {
    console.error(
      "Google Form Mapping Error:",
      error?.response?.data || error
    );

    throw new NonRetriableError(
      error?.response?.data?.error?.message ||
        error.message ||
        "Google Form mapping failed"
    );
  }
};
