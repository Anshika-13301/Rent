import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const predictRent = (data) => api.post("/predict", data).then((r) => r.data);
export const getProperties = (params) => api.get("/properties", { params }).then((r) => r.data);
export const getProperty = (id) => api.get(`/properties/${id}`).then((r) => r.data);
export const createProperty = (data) => api.post("/properties", data).then((r) => r.data);
export const getAnalytics = (endpoint) => api.get(`/analytics/${endpoint}`).then((r) => r.data);

export default api;
