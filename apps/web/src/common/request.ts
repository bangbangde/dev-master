export const fetch = async (
  resource: URL | RequestInfo,
  option: RequestInit
) => {
  return window.fetch(resource, option);
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
  data?: Record<string, string>
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export default fetch;
