import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getCharacter = async (params = {}) => {
  try {
    const response = await apiClient.get("/character", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
