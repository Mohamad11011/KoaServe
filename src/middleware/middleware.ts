import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import koaBody from "koa-body";
import serve from "koa-static";
import path from "path";

const MiddlewareKoa = (app: any, allowedURL: any) => {
  const parentDirectory = path.dirname(__dirname);
  const SERVING_PATH = path.join(parentDirectory, "assets");

  app.use(
    cors({
      origin: allowedURL,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
      credentials: true,
    })
  );
  app.use(async (ctx: any, next: any) => {
    await next();
    ctx.set("Access-Control-Allow-Origin", allowedURL);
    ctx.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    ctx.set("Access-Control-Allow-Headers", "Content-Type");
  });

  app.use(serve(SERVING_PATH));
  app.use(koaBody());
  app.use(bodyParser());
};

export default MiddlewareKoa;
