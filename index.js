const axios = require("axios");

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_USER_ID = process.env.LINE_USER_ID;

async function generateEnglish() {
  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content:
            "生成一句有質感的英文短句，附中文翻譯，適合社群分享"
        }
      ]
    },
    {
      headers: {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      }
    }
  );

  return response.data.content[0].text;
}

async function sendLineMessage(message) {
  await axios.post(
    "https://api.line.me/v2/bot/message/push",
    {
      to: LINE_USER_ID,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

async function main() {
  const text = await generateEnglish();

  await sendLineMessage(
    `Daily English ☀️\\n\\n${text}`
  );

  console.log("sent!");
}

main();
