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

export const createGoal = async (data) => {
    try {
        const response = await apiClient.post("/goals", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getGoals = async (params = {}) => {
  try {
    const response = await apiClient.get("/goals", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const updateGoal = async (id, data) => {
  try {
    const response = await apiClient.put(`/goals/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const completeGoal = async (data) => {
  try {
    const response = await apiClient.post(`/goals/complete`,data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getMonthlyGoals = async (params = {}) => {
  try {
    const response = await apiClient.get(`/goals/monthly-exp`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getMonthlyPies = async (params = {}) => {
  try {
    const response = await apiClient.get(`/goals/goals-pie`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};