import jwt from "jsonwebtoken";
import { AppError } from "./AppErrors.js";

const normalizePrivateKey = (privateKey) => {
  if (!privateKey) return "";
  return privateKey.replace(/\\n/g, "\n");
};

export const generateGithubAppJwt = () => {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyRaw = process.env.GITHUB_APP_PRIVATE_KEY;
  const privateKey = normalizePrivateKey(privateKeyRaw);

  if (!appId || !privateKey) {
    throw new AppError("Missing GitHub App credentials (GITHUB_APP_ID / GITHUB_APP_PRIVATE_KEY).", 500);
  }

  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      iat: now - 60,
      exp: now + 9 * 60,
      iss: appId,
    },
    privateKey,
    { algorithm: "RS256" },
  );
};
