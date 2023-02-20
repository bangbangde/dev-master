import { all } from "./common";
import * as Proxy from "../service/proxy";

all('proxy', '/proxy', async (ctx, next) => {
  const { url, method, headers, body } = ctx.request?.body;
  const response = Proxy.bypass({
    url,
    method,
    headers,
    body
  });

  // 响应
  response.then(res => {

  }).catch(err => {

  });

  await next();
})
