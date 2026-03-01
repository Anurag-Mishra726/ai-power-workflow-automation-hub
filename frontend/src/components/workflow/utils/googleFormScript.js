export const googleFormScript = (webhookUrl) =>
    `
    const WEBHOOK_URL = ${webhookUrl};

    function onFormSubmit(e) {
        try {
            const form = FormApp.getActiveForm();
            const formResponse = e.response;
            const itemResponses = formResponse.getItemResponses();
            
            // Construct the data object
            const payload = {
                metadata: {
                    formId: form.getId(),
                    formTitle: form.getTitle(),
                    responseId: formResponse.getId(),
                    timestamp: formResponse.getTimestamp(),
                    respondentEmail: formResponse.getRespondentEmail() || "Anonymous"
                },
                // This maps Question Title -> User Answer
                response: {}
            };

            // Loop through each question answered
            itemResponses.forEach((itemResponse) => {
                const question = itemResponse.getItem().getTitle();
                const answer = itemResponse.getResponse();
                
                // Handle array-based answers (like Checkboxes)
                payload.response[question] = answer;
            });

            // Send the data to your backend
            const options = {
                method: 'post',
                contentType: 'application/json',
                payload: JSON.stringify(payload),
            };

            const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
            
            // Log response for debugging in the Apps Script console
            //console.log("Response Code: " + response.getResponseCode());
            //console.log("Response Body: " + response.getContentText());

        } catch (error) {
            console.error("Error in onFormSubmit: " + error.toString());
        }
    }
`