const BASE_URL = "http://localhost:8888/.netlify/functions";

const API = {
  ENDPOINTS: {
    REGISTER: `${BASE_URL}/register`,
    LOGIN: `${BASE_URL}/login`,
    ADD_STORY: `${BASE_URL}/addStory`,
    ADD_STORY_GUEST: `${BASE_URL}/guestStory`,
    GET_ALL_STORIES: `${BASE_URL}/getAllStories`,
    SUBSCRIBE_NOTIFICATIONS: `${BASE_URL}/notifications/subscribe`,
    CONNECT: `${BASE_URL}/test`,
  },

  token: "",

  async setToken(value) {
    this.token = value || "";
  },

  async getToken() {
    return this.token;
  },

  async checkConnectionStatus() {
    try {
      const res = await fetch(this.ENDPOINTS.CONNECT);
      const result = await res.json();
      console.log(res.ok ? "✅ Connected" : "⚠️ Connection issue", result);
      return result;
    } catch (err) {
      console.error("❌ Network error:", err.message);
      return { success: false, error: err.message };
    }
  },

  async registerUser(name, email, password) {
    try {
      const res = await fetch(this.ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      return await res.json();
    } catch (err) {
      console.error("Registration failed:", err.message);
      return { success: false };
    }
  },

  async loginUser(email, password) {
    try {
      const res = await fetch(this.ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (result.token) await this.setToken(result.token);
      return result;
    } catch (err) {
      console.error("Login error:", err.message);
      return { success: false };
    }
  },

  async uploadStory({ description, photo, lat = null, lon = null }, isGuest = false) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat !== null) formData.append("lat", lat);
    if (lon !== null) formData.append("lon", lon);

    const endpoint = isGuest ? this.ENDPOINTS.ADD_STORY_GUEST : this.ENDPOINTS.ADD_STORY;
    const headers = {};

    if (!isGuest) {
      const token = await this.getToken();
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        console.error("Upload error:", result.message);
        alert(`Upload failed: ${result.message}`);
      }

      return result;
    } catch (err) {
      console.error("Upload failed:", err.message);
      return { success: false };
    }
  },

  async addStory(...args) {
    return this.uploadStory(...args, false);
  },

  async addStoryGuest(...args) {
    return this.uploadStory(...args, true);
  },

  async getAllStories() {
    try {
      const res = await fetch(this.ENDPOINTS.GET_ALL_STORIES);
      if (!res.ok) throw new Error("Failed to fetch stories");
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err.message);
      return { listStory: [], error: err.message };
    }
  },

  async subscribeToNotifications(endpoint, keys) {
    try {
      const token = await this.getToken();
      const res = await fetch(this.ENDPOINTS.SUBSCRIBE_NOTIFICATIONS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint, keys }),
      });
      return await res.json();
    } catch (err) {
      console.error("Subscription failed:", err.message);
      return { success: false };
    }
  },

  async unsubscribeFromNotifications(endpoint) {
    try {
      const token = await this.getToken();
      const res = await fetch(this.ENDPOINTS.SUBSCRIBE_NOTIFICATIONS, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      });
      return await res.json();
    } catch (err) {
      console.error("Unsubscription failed:", err.message);
      return { success: false };
    }
  },

  async triggerNotification(payload) {
    console.log("Triggering simulated notification:", payload);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, message: "Simulated notification sent." }), 500)
    );
  },
};

export default API;