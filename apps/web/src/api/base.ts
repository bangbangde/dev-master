export * from "@/common/request";

const _ = (path: string, host = HOST.def) => host + path;

export const HOST = {
  def: import.meta.env.VITE_HOST_DEF,
  api: import.meta.env.VITE_HOST_API,
};

export const API = {
  ping: _("/ping"),
  chat: _("/chat"),
};
