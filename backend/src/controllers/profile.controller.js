import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppErrors.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await User.findProfileById(req.user.userId);

    if (!profile) {
      throw new AppError("USER_NOT_FOUND", 404);
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile Error --> : ", error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user.userId);

    if (!profile) {
      throw new AppError("USER_NOT_FOUND", 404);
    }

    await User.deleteById(req.user.userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax"
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Profile Error --> : ", error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
