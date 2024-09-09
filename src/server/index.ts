import Koa from "koa";
import { routes } from "../routes";
import dotenv from "dotenv";
import MiddlewareKoa from "../middleware/middleware";

const app = new Koa();
const envFile =process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: envFile });
const allowedURL = process.env.NODE_ENV === "production" ? "*" : "*";

// Middleware to handle CORS
MiddlewareKoa(app, allowedURL);

app.on("error", (err: any) => {
  console.error("Server error", err);
});

app.use(routes.prefix("/api").routes()).use(routes.allowedMethods());

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Koa Server Is Running on port: `, port);
});
