import { 
  addApiKey,
  getApiKey,
  getAllApiKeys,
  updateApiKey,
  deleteApiKey
} from "../services/aiIntegration/aiIntegration.service.js";

export const addApiKeyController = async (req, res, next) => {
  try {

    const userId = req.user.userId;
    const { name, provider, apiKey } = req.body;

    const result = await addApiKey({
      userId,
      name,
      provider,
      apiKey
    });

    res.status(201).json({
      success: true,
      message: result?.message || "API key added successfully"
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({ 
        success: false,
        message: error.message || "Internal Server Error"
    });
  }
};

export const getApiKeyController = async (req, res, next) => {
  try {

    const userId = req.user.userId;
    const { provider } = req.params;

    const result = await getApiKey({
      userId,
      provider
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({ 
        success: false,
        message: error.message || "Internal Server Error"
    });
  }
};


export const getAllApiKeysController = async (req, res, next) => {
  try {

    const userId = req.user.userId;

    const result = await getAllApiKeys({
      userId
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({ 
        success: false,
        message: error.message || "Internal Server Error"
    });
  }
};


export const updateApiKeyController = async (req, res, next) => {
  try {

    const userId = req.user.userId;
    const { name, provider, apiKey } = req.body;

    const result = await updateApiKey({
      userId,
      name,
      provider,
      apiKey
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({ 
        success: false,
        message: error.message || "Internal Server Error"
    });
  }
};


export const deleteApiKeyController = async (req, res, next) => {
  try {

    const userId = req.user.userId;
    const { provider } = req.params;

    const result = await deleteApiKey({
      userId,
      provider
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({ 
        success: false,
        message: error.message || "Internal Server Error"
    });
  }
};