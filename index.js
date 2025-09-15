import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import express from "express";

const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.UNIVERSE_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TOPIC = "discord";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

async function toRoblox(message,command,username,arg) {
  const content = JSON.stringify({
    command: command,
    username: username,
    arg: arg,
  })
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
            topic: TOPIC,
            message: content,
          }),
        }
      );

      if (response.ok) {
        message.reply("✅ Đã thực thi lệnh!");
      } else {
        const err = await response.text();
        message.reply(`⚠️ Lỗi khi gửi: ${err}`);
      }
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Có lỗi khi kết nối Roblox.");
    }
}


const prefix = "/";

// Bảng command

const robloxCommands = {
  verify,send,retry,kick,ban,unban,lag
}

const commands = {
  ping: async (message) => {
    message.reply("Pong!");
  },

  sendToRoblox: async (message, username , arg) => {
    if (!username) {
      return message.reply("❌ Bạn cần nhập tên người dùng.");
    }
    
    toRoblox(message,command,username,arg)
  },


};

client.once("ready", () => {
  console.log(`Bot đã đăng nhập với ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const username = args[0];  
  const arg = args.slice(1).join(" ");

  if (commands[command]) {
    try {
      await commands[command](message);
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Có lỗi khi chạy lệnh.");
    }
  } if (robloxCommands[command]) {

  }else {
    message.reply("❓ Không có lệnh này.");
  }

});

// HTTP server để Render không bị kill
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot đang chạy!"));
app.listen(PORT, () => console.log(`HTTP server tại cổng ${PORT}`));

client.login(DISCORD_TOKEN);
