export const fetch = async (
  resource: URL | RequestInfo,
  option: RequestInit
) => {
  const headers: Record<string, string> = {};
  if (option.method?.toLowerCase() === "post") {
    headers["content-type"] = "application/json";
  }
  return window.fetch(resource, {
    credentials: "same-origin",
    headers,
    ...option,
  });
};

export const getJson = async (
  url: string | URL,
  searchParams?: Record<string, string>
) => {
  url = new URL(url);
  const sp = new URLSearchParams(searchParams);
  for (const [key, value] of sp) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url, {
    method: "GET",
  });
  return await res.json();
};

export const postJson = async (
  url: string | URL,
  data?: Record<string, string>,
  options?: Record<string, string>
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
    ...options,
  });
  return await res.json();
};

export default fetch;
