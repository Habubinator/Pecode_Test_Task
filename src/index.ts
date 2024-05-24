import express, {
    Application,
    Express,
    Router,
    Request,
    Response,
} from "express";

import "dotenv/config";
import userRouter from "./routes/userRouter.ts";
import postRouter from "./routes/postRouter.ts";
import checkToken from "./middlewares/jwt.ts";

const app: Application = express();
app.use(checkToken);
const PORT: string | number = process.env.PORT || 5000;

app.get("/user", userRouter as Router);
app.get("/post", postRouter as Router);

app.listen(PORT, () => {
    console.log("Server works on port " + PORT);
});
