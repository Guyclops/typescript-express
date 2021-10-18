import { IncomingWebhook } from "@slack/webhook";

const url = process.env.WEB_HOOK_URL;
const channel = "서버알림";

const color = {
  success: "#5cb85c",
  warning: "#9F6000",
  error: "#D8000C",
};
const hook = new IncomingWebhook(url);

const webhook = {
  send: async (data: {
    title: string;
    statusCode?: string;
    message: string;
    method?: string;
    url?: string;
    parameters?: string;
    username?: string;
    channel?: string;
    type: "success" | "warning" | "error";
  }) => {
    const fields = [];
    if (data.statusCode !== undefined) {
      fields.push({
        title: "CODE",
        value: data.statusCode,
        short: true,
      });
    }
    if (data.method !== undefined) {
      fields.push({
        title: "METHOD",
        value: data.method,
        short: true,
      });
    }
    if (data.url !== undefined) {
      fields.push({
        title: "URL",
        value: data.url.replace(/\?.*$/, ""),
        short: true,
      });
    }
    if (data.parameters !== undefined) {
      fields.push({
        title: "PARAMETERS",
        value: data.parameters,
        short: false,
      });
    }
    fields.push({
      title: "MESSAGE",
      value: data.message,
      short: false,
    });
    await hook.send({
      channel: data.channel ? data.channel : channel,
      username: data.username ? data.username : "서버",
      icon_url: "https://icon.com/icon.png",
      text: data.title,
      attachments: [
        {
          color: color[data.type],
          fields,
        },
      ],
    });
  },
};
// class Webhook {
//   private hook: IncomingWebhook;
//   constructor() {
//     this.hook = new IncomingWebhook(url);
//   }
// }

export default webhook;
