// http.js
const API_URL = "http://localhost:5000";

export const http = {
  async request(url, options = {}) {
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
    const res = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = isJson ? (payload?.error || JSON.stringify(payload)) : payload;
      throw new Error(message || `HTTP ${res.status}`);
    }

    return payload;
  },

  get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  },

  post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
