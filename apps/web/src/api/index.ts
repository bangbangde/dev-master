import { HOST, defineApi } from "./base";
export { HOST };

export const ping = defineApi("/ping");
export const test = defineApi("/test", "get", HOST.api);
