// src/api/ownerApi.js
import { api } from "./httpClient"; // same axios instance with baseURL + withCredentials

export const ownerApi = {
  login: ({ email, password }) =>
    api.post("/api/owners/login", { email, password }),
  me: () => api.get("/api/owners/me"),
};
