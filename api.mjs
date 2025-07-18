const BASE_URL = "http://localhost:8888/.netlify/functions";

const API = {
  ENDPOINTS: {
    REGISTER: `${BASE_URL}/register`,
    LOGIN: `${BASE_URL}/login`,
    ADD_STORY: `${BASE_URL}/addStory`,
    ADD_STORY_GUEST: `${BASE_URL}/guestStory`,
    GET_ALL_STORIES: `${BASE_URL}/getAllStories`,
    SUBSCRIBE_NOTIFICATIONS: `${BASE_URL}/notifications/subscribe`,
    UNSUBSCRIBE_NOTIFICATIONS: `${BASE_URL}/notifications/unsubscribe`,
    CONNECT: `${BASE_URL}/test`,
  },

  token: "",

  async setToken(value) {
    this.token = value || "";
  },

  async getToken() {
    return this.token;
  },

  async safeParse(res) {
    try {
      return await res.json();
    } catch {
      const text = await res.text();
      return { success: false, error: "Non-JSON response", raw: text };
    }
  },

  async checkConnectionStatus() {
    try {
      const res = await fetch(this.ENDPOINTS.CONNECT);
      const result = await this.safeParse(res);
      console.log(res.ok ? "✅ Connected" : "⚠️ Connection issue", result);
      return result;
    } catch (err) {
      console.error("❌ Network error:", err.message);
      return { success: false, error: err.message };
    }
  },

  async registerUser(username, email, password) {
    return this.postJSON(this.ENDPOINTS.REGISTER, { username, email, password });
  },

  async loginUser(email, password) {
    const result = await this.postJSON(this.ENDPOINTS.LOGIN, { email, password });
    if (result.token) await this.setToken(result.token);
    return result;
  },

  async uploadStory(payload, isGuest = false) {
    const endpoint = isGuest ? this.ENDPOINTS.ADD_STORY_GUEST : this.ENDPOINTS.ADD_STORY;
    const headers = { "Content-Type": "application/json" };

    if (!isGuest) {
      const token = await this.getToken();
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await this.safeParse(res);
      if (!res.ok) console.error("❌ Upload error:", result.error || result);

      return result;
    } catch (err) {
      console.error("Upload failed:", err.message);
      return { success: false };
    }
  },

  async addStory(payload) {
    return this.uploadStory(payload, false);
  },

  async addStoryGuest(payload) {
    return this.uploadStory(payload, true);
  },

  async getAllStories() {
    try {
      const res = await fetch(this.ENDPOINTS.GET_ALL_STORIES);
      if (!res.ok) throw new Error("Fetch failed");
      return await res.json();
    } catch (err) {
      console.error("Story fetch error:", err.message);
      return { listStory: [], error: err.message };
    }
  },

  async subscribeToNotifications(endpoint, keys) {
    const token = await this.getToken();
    return this.postJSON(this.ENDPOINTS.SUBSCRIBE_NOTIFICATIONS, { endpoint, keys }, token);
  },

  async unsubscribeFromNotifications(endpoint) {
    const token = await this.getToken();
    return this.deleteJSON(this.ENDPOINTS.UNSUBSCRIBE_NOTIFICATIONS, { endpoint }, token);
  },

  async postJSON(url, payload, token = null) {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      return await this.safeParse(res);
    } catch (err) {
      console.error("POST error:", err.message);
      return { success: false };
    }
  },

  async deleteJSON(url, payload, token = null) {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify(payload),
      });
      return await this.safeParse(res);
    } catch (err) {
      console.error("DELETE error:", err.message);
      return { success: false };
    }
  },

  async triggerNotification(payload) {
    console.log("🚀 Simulated notification payload:", payload);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, message: "Simulated push sent." }), 500)
    );
  },
};

export default API;
