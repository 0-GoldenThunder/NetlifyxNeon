// import {
//   storePendingStory,
//   getUserSession,
// } from "../utils/db.js"; // Import IndexedDB 

const BASE_URL = 'http://localhost:8888/.netlify/functions'

const API = {
  ENDPOINTS: {
    REGISTER: `${BASE_URL}/register`,
    LOGIN: `${BASE_URL}/login`, 
    ADD_STORY: `${BASE_URL}/addStory`,
    ADD_STORY_GUEST: `${BASE_URL}/stories/guest`,
    GET_ALL_STORIES: `${BASE_URL}/getAllStories`,
    SUBSCRIBE_NOTIFICATIONS: `${BASE_URL}/notifications/subscribe`,
    CONNECT: `${BASE_URL}/test`,
  },
  
  async getToken() {
    // const session = await getUserSession(); // Retrieve token from IndexedDB
    return session?.token || "";
  },

  async checkConnectionStatus() {
  try {
    const response = await fetch(this.ENDPOINTS.CONNECT);
    const result = await response.json();

    if (response.ok) {
      console.log("✅ Connected:", result.success);
    } else {
      console.warn("⚠️ Connection issue:", result.success || result.error);
    }

    return result;
  } catch (error) {
    console.error("❌ Network error:", error.message);
    return { success: false, message: "Failed to reach server", error };
  }
},

  async registerUser(name, email, password) {
    try {
      const response = await fetch(this.ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  async loginUser(email, password) {
    try {
      const response = await fetch(this.ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  async addStory(description, photo, lat = null, lon = null) {
    try {
      // Ensure inputs are provided
      if (!description || !photo) {
        throw new Error("Description and photo are required!");
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);
      if (lat !== null) formData.append("lat", lat);
      if (lon !== null) formData.append("lon", lon);

      // Debug FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Await token retrieval properly
      const token = await this.getToken();

      const response = await fetch(this.ENDPOINTS.ADD_STORY, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.json(); // Log server error
        console.error("Server Response:", errorText.message);
        alert(`Error: ${errorText.message}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Offline detected, storing story locally...");
      await storePendingStory({ description, photo, lat, lon });
    }
  },

  async addStoryGuest(description, photo, lat = null, lon = null) {
    try {
      // Ensure inputs are provided
      if (!description || !photo) {
        throw new Error("Description and photo are required!");
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);
      if (lat !== null) formData.append("lat", lat);
      if (lon !== null) formData.append("lon", lon);

      // Debug FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(this.ENDPOINTS.ADD_STORY_GUEST, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.json(); // Log server error
        console.error("Server Response:", errorText.message);
        alert(`Error: ${errorText.message}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Offline detected, storing story locally...");
      await storePendingStory({ description, photo, lat, lon });
    }
  },

  async getAllStories() {
    try {
      // Await token retrieval properly
      const token = await this.getToken();

      const response = await fetch(this.ENDPOINTS.GET_ALL_STORIES, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stories");

      const stories = await response.json();
      return stories;
    } catch (error) {
      console.warn("Network error, loading cached stories...");

      // Load from cache when offline
    const cache = await caches.open("story-api");
    const cachedResponse = await cache.match(this.ENDPOINTS.GET_ALL_STORIES);

    return cachedResponse ? await cachedResponse.json() : { listStory: [] };
    }
  },

  async subscribeToNotifications(endpoint, keys) {
  const token = await this.getToken();
  
  // Destructure the keys for clarity
  const { p256dh, auth } = keys;
  
  // Construct the request payload as documented
  const body = {
    endpoint,
    keys: { "auth": auth, "p256dh": p256dh},
  };
  

  const response = await fetch(this.ENDPOINTS.SUBSCRIBE_NOTIFICATIONS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
      const errorData = await response.text();
      console.error("Subscription failed (Option A):", errorData);
  }
 
  // Parse the success response
  const responseData = await response.json();
  console.log("Subscription succeeded, response:", responseData);
  return responseData;
},


  async unsubscribeFromNotifications(endpoint) {
    const token = await this.getToken();
    const body = { endpoint };

    const response = await fetch(this.ENDPOINTS.SUBSCRIBE_NOTIFICATIONS, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Unsubscription failed: ${response.statusText}`);
    }
    return await response.json();
  },

  async triggerNotification(payload) {
    // Simulated trigger for push notifications.
    console.log("Simulating triggerNotification with payload:", payload);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Notification triggered (simulated).");
        resolve({
          success: true,
          message: "Notification triggered successfully (simulated).",
        });
      }, 500);
    });
  },
};

export default API;
