import express from "express";
import os from "node:os";
import fs from "fs";

const app = express();

console.log(os.homedir());

// app.get("/", (req, res) => {
//     // res.send("Welcome to the AI Power Workflow Automation Hub!");
//     res.json({
//         message: "Welcome to the AI Power Workflow Automation Hub!"
//     })
// });

// app.listen(5000, () => {
//     console.log("Server is running on http://localhost:5000");
// })