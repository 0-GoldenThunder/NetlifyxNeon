import API from "./api.mjs";

(async () => {
  console.log("🔄 Checking connection...");
  const connectionStatus = await API.checkConnectionStatus();
  console.log("Connection:", connectionStatus);

  console.log("\n👤 Registering new user...");
  const register = await API.registerUser("Tsaqif", "tsaqif@example.com", "testpass123");
  console.log("Register:", register);

  console.log("\n🔐 Logging in...");
  const login = await API.loginUser("tsaqif@example.com", "testpass123");
  console.log("Login:", login);

  console.log("\n📝 Submitting authenticated story...");
  const userStory = await API.addStory({
    description: "A story from Tsaqif!",
    photo: new Blob(["image-data"], { type: "image/jpeg" }),
    lat: -1.23,
    lon: 116.85,
  });
  console.log("Authenticated story:", userStory);

  console.log("\n🙈 Submitting guest story...");
  const guestStory = await API.addStoryGuest({
    description: "Anonymous guest story",
    photo: new Blob(["image-data"], { type: "image/jpeg" }),
    lat: -1.25,
    lon: 116.89,
  });
  console.log("Guest story:", guestStory);

  console.log("\n📦 Fetching all stories...");
  const stories = await API.getAllStories();
  console.log("Stories:", stories);

  console.log("\n📨 Simulating notification subscription...");
  const subscribe = await API.subscribeToNotifications("https://example-endpoint", {
    p256dh: "fakeP256DH",
    auth: "fakeAuth",
  });
  console.log("Subscribe response:", subscribe);

  console.log("\n🚫 Unsubscribing from notifications...");
  const unsubscribe = await API.unsubscribeFromNotifications("https://example-endpoint");
  console.log("Unsubscribe response:", unsubscribe);

  console.log("\n📣 Triggering a simulated notification...");
  const trigger = await API.triggerNotification({ title: "API Test", body: "This is a test" });
  console.log("Trigger result:", trigger);
})();
