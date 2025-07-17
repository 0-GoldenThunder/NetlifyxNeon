import API from "./api.mjs";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log("🔄 Checking connection...");
  const connectionStatus = await API.checkConnectionStatus();
  console.log("Connection:", connectionStatus);
  await delay(800);

  console.log("\n👤 Registering new user...");
//   const register = await API.registerUser("Tsaqif", "tsaqif@example.com", "testpass123");
//   console.log("Register:", register);
  await delay(800);

  console.log("\n🔐 Logging in...");
  const login = await API.loginUser("tsaqif@example.com", "testpass123");
  console.log("Login:", login);
  await delay(800);

  console.log("\n📝 Submitting authenticated story...");
  const userStory = await API.addStory({
    description: "A story from Tsaqif!",
    photo_url: "Replace this with actual photo data url",
    lat: -1.23,
    lon: 116.85,
  });
  console.log("Authenticated story:", userStory);
  await delay(800);

  console.log("\n🙈 Submitting guest story...");
  const guestStory = await API.addStoryGuest({
    description: "Anonymous guest story",
    photo_url: "Replace this with actual photo data url",
    lat: -1.25,
    lon: 116.89,
  });
  console.log("Guest story:", guestStory);
  await delay(800);

  console.log("\n📦 Fetching all stories...");
  const stories = await API.getAllStories();
  console.log("Stories:", stories);
  await delay(800);

  console.log("\n📨 Subscribing to notifications...");
  const subscribe = await API.subscribeToNotifications("https://example-endpoint", {
    p256dh: "fakeP256DH",
    auth: "fakeAuth",
  });
  console.log("Subscribe response:", subscribe);
  await delay(800);

  console.log("\n🚫 Unsubscribing from notifications...");
  const unsubscribe = await API.unsubscribeFromNotifications("https://example-endpoint");
  console.log("Unsubscribe response:", unsubscribe);
  await delay(800);

  console.log("\n📣 Triggering simulated notification...");
  const trigger = await API.triggerNotification({ title: "API Test", body: "This is a test" });
  console.log("Trigger result:", trigger);
})();
