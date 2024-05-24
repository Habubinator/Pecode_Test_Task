import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();
const PORT: string | number = process.env.PORT || 5000;

app.get("/", function (req: Request, res: Response) {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log("Server works on port " + PORT);
});
