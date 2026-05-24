import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://192.168.0.230:8000";
const TOKEN_KEY = "shoplist-access-token";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    config.data ? JSON.stringify(config.data).slice(0, 200) : "",
  );
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      JSON.stringify(response.data).slice(0, 300),
    );
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      console.error(
        `[API] ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        JSON.stringify(error.response.data),
      );
      if (error.response.status === 401) {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
    } else if (error.request) {
      console.error(`[API] NO RESPONSE ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.message);
    } else {
      console.error("[API]", error.message);
    }
    return Promise.reject(error);
  },
);

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
