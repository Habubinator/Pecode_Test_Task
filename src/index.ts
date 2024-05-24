import express, { Application, Request, Response } from "express";
import "dotenv/config";
import checkToken from "./middlewares/jwt.ts";

const app: Application = express();
app.use(checkToken);
const PORT: string | number = process.env.PORT || 5000;

app.get("/user", function (req: Request, res: Response) {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log("Server works on port " + PORT);
});
