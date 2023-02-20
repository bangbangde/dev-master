import { API, postJson } from "./base";

export const ping = () => postJson(API.ping);
export const chat = (msg: string) => postJson(API.chat, { msg });
export const initChat = () => postJson(API.initChat);
