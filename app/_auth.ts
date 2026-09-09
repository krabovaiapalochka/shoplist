import { apiClient, API_BASE_URL, getStoredToken } from "./_api";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  phone?: string | null;
  birth_date?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdate {
  email?: string;
  username?: string;
  phone?: string | null;
  birth_date?: string | null;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  phone?: string | null;
  birth_date?: string | null;
  avatar_url?: string | null;
}

export const authApi = {
  async login(email: string, password: string): Promise<Token> {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const { data } = await apiClient.post<Token>("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },

  async register(email: string, username: string, password: string): Promise<void> {
    const payload: UserCreate = { email, username, password };
    await apiClient.post("/auth/register", payload);
  },

  async getMe(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>("/users/me");
    return data;
  },

  async updateProfile(updates: UserUpdate): Promise<UserResponse> {
    const { data } = await apiClient.patch<UserResponse>("/users/me", updates);
    return data;
  },

  async uploadAvatar(uri: string): Promise<void> {
    const token = await getStoredToken();
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);
    const res = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      let detail = "Upload failed";
      try {
        const body = await res.json();
        detail = body.detail || detail;
      } catch {}
      throw new Error(detail);
    }
  },

  async deleteAvatar(): Promise<void> {
    await apiClient.delete("/users/me/avatar");
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/auth/request-reset", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
  },
};
