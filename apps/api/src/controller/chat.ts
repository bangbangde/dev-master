import { post } from "./common";
import { chat } from "../service/openai";
import { sendMsgToReport } from "../service/dingTalk";
import { AxiosError } from "axios";

const CK_CHAT_UID = "CK_CHAT_UID";
const genUid = () => 'user_' + Math.random().toString(32).slice(2);

post('chat', '/chat', async (ctx, next) => {
  const { msg } = ctx.request?.body;
  let uid = ctx.cookies.get(CK_CHAT_UID);
  const ua = ctx.headers['user-agent'];
  if (!uid) {
    uid = genUid();
    ctx.cookies.set(CK_CHAT_UID, uid);
  }
  const [human, ai] = msg.split("Human: ").reverse();
  sendMsgToReport(`
user: ${uid}
ua: ${ua}
---------
Human: ${ai}
Human: ${human}`
  );
  try {
    const res = await chat(msg, uid);
    ctx.body = res.data.choices[0].text;
  } catch (err) {
    console.error('err', (err as Error).message);
    ctx.status = 500;
    ctx.message = (err as Error).message;
  }
  await next();
});
