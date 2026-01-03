// models.js
import { http } from "./http";

export async function fetchModels() {
  // Backend route expected at /api/models
  return http.get("/api/models");
}
