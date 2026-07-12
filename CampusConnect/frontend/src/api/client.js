import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let accessToken = null;
let refreshPromise = null;
const listeners = new Set();

export const setAccessToken = (t) => {
  accessToken = t;
  listeners.forEach((cb) => cb(t));
};
export const getAccessToken = () => accessToken;
export const onTokenChange = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/")
    ) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post("/api/auth/refresh", null, { withCredentials: true })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
