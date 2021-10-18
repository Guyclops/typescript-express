import admin from "firebase-admin";
import serviceAccount from "./fcmkey.json";
import envConfig from "./config/env.config";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as Object),
});

/**
 * notice: 공지사항
 */
export type Topic = "notice";

const sendSingle = async (token: string, subject: string, contents: string, data?: {}) => {
  try {
    const message = {
      data,
      notification: {
        title: subject,
        body: contents,
      },
      token,
    };
    const response = await admin.messaging().send({
      data,
      notification: {
        title: subject,
        body: contents,
      },
      token,
    });
    return true;
  } catch (e) {
    return false;
  }
};

const sendMultiple = async (tokens: string[], subject: string, contents: string, data?: {}) => {
  try {
    for (let i = 0; i < tokens.length / 500; i++) {
      let arr = [];
      for (let j = i * 500; j < i * 500 + 500; j++) {
        if (j >= tokens.length) break;
        arr.push(tokens[j]);
      }
      if (arr.length > 0) {
        const message = {
          data,
          notification: {
            title: subject,
            body: contents,
          },
          tokens,
        };
        const response = await admin.messaging().sendMulticast(message);
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const subscribeTopic = async (token: string, topic: Topic) => {
  try {
    const result = await admin.messaging().subscribeToTopic(token, topic);
    return true;
  } catch (e) {
    return false;
  }
};

const unsubscribeTopic = async (token: string, topic: Topic) => {
  try {
    const result = await admin.messaging().unsubscribeFromTopic(token, topic);
    return true;
  } catch (e) {
    return false;
  }
};

const sendTopic = async (topic: Topic, subject: string, contents: string, data?: {}) => {
  try {
    const response = await admin.messaging().sendToTopic(topic, {
      data,
      notification: {
        title: subject,
        body: contents,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export default { sendSingle, sendMultiple, subscribeTopic, unsubscribeTopic, sendTopic };
