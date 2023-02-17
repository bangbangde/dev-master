import fetch from "@/common/request";

export const HOST = {
  def: import.meta.env.VITE_HOST_DEF,
  api: import.meta.env.VITE_HOST_API,
};

export const defineApi = (
  path: string,
  method: string = "get",
  host: string = HOST.def
) => {
  const params = {
    url: host + path,
    method,
  };
  return (options: Request) =>
    fetch({
      ...params,
      ...options,
    } as Request);
};
