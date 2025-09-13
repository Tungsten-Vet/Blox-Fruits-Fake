const { Client, GatewayIntentBits } = require("discord.js");
import fetch from "node-fetch";

const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.UNIVERSE_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Tên topic MessagingService (giống trong Roblox script)
const TOPIC = "discord";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // bỏ qua bot

  // gửi message Discord -> Roblox
  const payload = {
    topic: TOPIC,
    message: `${msg.author.username}: ${msg.content}`
  };

  try {
    const response = await fetch(`https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}:publishMessage`, {
      method: "POST",
      headers: {
        "x-api-key": ROBLOX_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("Sent to Roblox:", payload.message);
    } else {
      const err = await response.text();
      console.error("Failed to send:", err);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});

client.login(DISCORD_TOKEN);
