import { post } from "./common";
import { chat, init } from "../service/openai";

post('chat', '/chat', async (ctx, next) => {
  const { msg } = ctx.request?.body;
  try {
    const res = await chat(msg);
    ctx.body = res.data.choices[0];
  } catch (err) {
    console.error('err')
  }
  await next();
});

post('initChat', '/init-chat', async (ctx, next) => {
  try {
    const res = await init();
    ctx.body = res.data.choices;
  } catch (err) {
    console.error('err')
  }
  await next();
});
