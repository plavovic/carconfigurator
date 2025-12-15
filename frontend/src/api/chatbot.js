import { http } from "./http"; // adjust path

export function sendMessage(message) {
  // IMPORTANT: return the promise
  return http.post("/api/chatbot", { message });
}
