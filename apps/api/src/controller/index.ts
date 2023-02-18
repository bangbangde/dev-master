// Docs: https://github.com/koajs/router/blob/master/API.md
import Koa from "koa";
import router, { get, post } from "./common";

get('ping', '/ping', async (ctx, next) => {
  ctx.body = `ping success: ${new Date().toLocaleTimeString()}`
  await next();
});

//
post('pong', '/pong', async (ctx, next) => {
  ctx.body = JSON.stringify(ctx.request);
  await next();
});

export default (app:Koa) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
}
