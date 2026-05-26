import { App } from "octokit";
import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(path.join(process.cwd(), "keys/github_private_key.pem"), "utf-8");

export const githubApp = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey
});