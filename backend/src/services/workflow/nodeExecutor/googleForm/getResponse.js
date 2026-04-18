import axios from "axios";
import { Integration } from "../../../../models/integration/integration.model.js";
import { createExecutionResult } from "../../../../utils/executionResult.js";
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

    const rawResponses = context.triggerData?.payload || [];

    if (!rawResponses.length) {
      return createExecutionResult({
        output: {
          nodeId,
          success: true,
          data: [],
        },
      });
    }

    // 1. Fetch form schema
    const formSchemaRes = await axios.get(
      `https://forms.googleapis.com/v1/forms/${formId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const formItems = formSchemaRes.data.items || [];

    // 2. Build question map (questionId → readable question text)
    const questionMap = {};

    formItems.forEach((item) => {
      if (item.questionItem) {
        const qId = item.questionItem.question.questionId;

        // Better fallback chain for question text
        const questionText =
          item.title ||
          item.description ||
          `Question_${qId}`;

        questionMap[qId] = questionText;
      }
    });

    // 3. Map responses into readable format
    const mappedResponses = rawResponses.map((response) => {
      const answers = {};

      if (response.answers) {
        Object.entries(response.answers).forEach(([qId, answerObj]) => {
          const question =
            questionMap[qId] || `Question_${qId}`;

          let value = "";

          // Handle different Google Forms answer types safely
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

        // 👇 human readable output (for workflow)
        answers,

        // 👇 raw fallback (debugging / advanced nodes)
        raw: response.answers,
      };
    });

    console.log("Mapped Responses:", mappedResponses);

    return createExecutionResult({
      output: {
        nodeId,
        success: true,
        data: mappedResponses,
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
