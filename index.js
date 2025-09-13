import { Client, GatewayIntentBits } from "discord.js";
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

const prefix = "!"; // ký tự bắt đầu lệnh

client.once("ready", () => {
  console.log(`Bot đã đăng nhập với ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Bỏ qua tin nhắn từ bot
  if (message.author.bot) return;

  // Kiểm tra xem có phải lệnh không
  if (!message.content.startsWith(prefix)) return;

  // Tách lệnh và tham số
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Ví dụ lệnh ping
  if (command === "ping") {
    message.reply("Pong!");
  }

  // Ví dụ lệnh gửi tin nhắn đến Roblox
  if (command === "send") {
    const content = args.join(" ");
    if (!content) {
      return message.reply("❌ Bạn cần nhập nội dung tin nhắn.");
    }

    try {
      const response = await fetch(
        `https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}:publishMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ROBLOX_API_KEY,
          },
          body: JSON.stringify({
            topic: "discord",
            message: content,
          }),
        }
      );

      if (response.ok) {
        message.reply("✅ Tin nhắn đã gửi đến Roblox!");
      } else {
        const err = await response.text();
        message.reply(`⚠️ Lỗi khi gửi: ${err}`);
      }
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Có lỗi khi kết nối Roblox.");
    }
  }
});

client.login(DISCORD_TOKEN);

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot đang chạy!');
});

app.listen(PORT, () => {
  console.log(`Server HTTP đang mở tại cổng ${PORT}`);
});