import { http } from "./http";

export function fetchOptions(category) {
  let url;

  if (category) {
    url = `/api/options?category=${encodeURIComponent(category)}`;
  } else {
    url = "/api/options";
  }

  return http(url);
}
