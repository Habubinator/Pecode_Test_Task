import express, {
    Application,
    Express,
    Router,
    Request,
    Response,
} from "express";

import "dotenv/config";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import checkToken from "./middlewares/jwt.js";

const app: Application = express();
app.use(express.json());
app.use(checkToken);
const PORT: string | number = process.env.PORT || 5000;

app.use("/user", userRouter as Router);
app.use("/post", postRouter as Router);

app.listen(PORT, () => {
    console.log("Server works on port " + PORT);
});
