import { post } from "./common";
import { chat } from "../service/openai";

post('chat', '/chat', async (ctx, next) => {
  const { q } = ctx.request?.body;
  const r = await chat(q);
  ctx.body = r;
  await next();
});
