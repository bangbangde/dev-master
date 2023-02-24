import { API, postJson, fetch } from "./base";

export const ping = () => postJson(API.ping);
export const chat = (msg: string) =>
  fetch(API.chat, {
    method: "POST",
    body: JSON.stringify({ msg }),
  } as RequestInit);
